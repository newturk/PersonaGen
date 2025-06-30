const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["*"],
    allowedHeaders: ["*"]
}));
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

// Initialize Gemini AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBJG00JUXm-M7JVWykZCX3w4xoCG9GNq2E";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Chat endpoint
app.post('/chat', async (req, res) => {
    try {
        const { persona, history, message, full_text } = req.body;
        
        const persona_name = persona.name || "Unknown";
        const tone = persona.speakingStyle?.tone || "";
        const beliefs = persona.coreBeliefs?.join(", ") || "";
        const philosophy = persona.lifePhilosophy || "";
        const style = persona.speakingStyle?.expressions?.join(", ") || "";
        
        let system_prompt;
        if (full_text) {
            system_prompt = `You are now acting as ${persona_name}. ` +
                `Your tone is: ${tone}. ` +
                `Core beliefs: ${beliefs}. ` +
                `Life philosophy: ${philosophy}. ` +
                `Speaking style: ${style}. ` +
                `Here is the full autobiography/biography for reference:\n${full_text}\n` +
                `Respond to all questions as if you are ${persona_name}, using their tone, beliefs, style, and referencing the document as needed.`;
        } else {
            system_prompt = `You are now acting as ${persona_name}. ` +
                `Your tone is: ${tone}. ` +
                `Core beliefs: ${beliefs}. ` +
                `Life philosophy: ${philosophy}. ` +
                `Speaking style: ${style}. ` +
                `Respond to all questions as if you are ${persona_name}, using their tone, beliefs, and style.`;
        }
        
        console.log("=== SYSTEM PROMPT SENT TO GEMINI ===");
        console.log(system_prompt);
        
        // Build conversation history
        let conversation = system_prompt + "\n\n";
        
        // Add conversation history
        for (const msg of history) {
            if (msg.role === 'user') {
                conversation += `User: ${msg.content}\n`;
            } else {
                conversation += `Assistant: ${msg.content}\n`;
            }
        }
        
        // Add current message
        conversation += `User: ${message}\n`;
        conversation += "Assistant: ";
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(conversation);
        const response = await result.response;
        const text = response.text();
        
        console.log("=== GEMINI API RAW RESPONSE ===");
        console.log(text);
        
        if (text) {
            res.json({ response: text });
        } else {
            res.json({ response: "Sorry, I couldn't get a response from the digital persona. Please try again later." });
        }
    } catch (error) {
        console.error("Chat error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Fallback: Create a basic persona from content heuristics
function createContentBasedPersona(text) {
    // Try to extract a name (first capitalized word or from the title)
    let name = null;
    // Try to find a name pattern (e.g., "by [Name]")
    const byMatch = text.match(/by ([A-Z][a-z]+(\s+[A-Z][a-z]+)?)/);
    if (byMatch) {
        name = byMatch[1];
    } else {
        // Fallback: first capitalized word
        const nameMatch = text.match(/([A-Z][a-z]+(\s+[A-Z][a-z]+)?)/);
        if (nameMatch) {
            name = nameMatch[0];
        }
    }
    // Use first 8 words as a title if no title
    let title = text.split(/\s+/).slice(0, 8).join(' ') + '...';
    return {
        name: name || 'Unknown Individual',
        title: title,
        era: null,
        nationality: null,
        traits: [],
        speakingStyle: {
            tone: null,
            vocabulary: [],
            expressions: [],
            greetings: []
        },
        knowledgeDomains: [],
        coreBeliefs: [],
        lifePhilosophy: '',
        responsePatterns: {},
        colorScheme: {
            primary: '#007bff',
            secondary: '#FFD700',
            accent: '#FFA500'
        },
        avatar: null
    };
}

// PDF upload and persona extraction endpoint
app.post('/upload_pdf', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        
        const filePath = req.file.path;
        console.log("=== UPLOADING PDF ===");
        console.log(`File path: ${filePath}`);
        
        // Extract text from PDF
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        const full_text = pdfData.text;
        
        console.log("=== PDF TEXT EXTRACTED ===");
        
        // Ask Gemini to extract persona traits
        const prompt = "Analyze the attached PDF autobiography/biography and extract the following as JSON: " +
            "name, title, era, nationality, traits (with name, value 0-100, description, color), " +
            "speakingStyle (tone, vocabulary, expressions, greetings), knowledgeDomains (domain, expertise 0-100, keyTopics), " +
            "coreBeliefs, lifePhilosophy, responsePatterns (with context, responses, emotion), colorScheme, avatar. " +
            "Return only the JSON object.\n\nText content:\n" + full_text;
        
        console.log("=== SENDING PROMPT TO GEMINI ===");
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();
        
        console.log("=== RAW RESPONSE FROM GEMINI ===");
        console.log(responseText);
        
        // Normalize persona function
        function normalize_persona(persona) {
            // Normalize speakingStyle fields
            if (persona.speakingStyle) {
                ['greetings', 'expressions', 'vocabulary'].forEach(key => {
                    const val = persona.speakingStyle[key];
                    if (val === null || val === undefined) {
                        persona.speakingStyle[key] = [];
                    } else if (typeof val === 'string') {
                        persona.speakingStyle[key] = [val];
                    } else if (!Array.isArray(val)) {
                        persona.speakingStyle[key] = [String(val)];
                    }
                });
            }
            
            // Normalize responsePatterns
            if (persona.responsePatterns) {
                if (Array.isArray(persona.responsePatterns)) {
                    const newPatterns = {};
                    persona.responsePatterns.forEach((rp, i) => {
                        newPatterns[String(i)] = rp;
                    });
                    persona.responsePatterns = newPatterns;
                }
                
                Object.keys(persona.responsePatterns).forEach(k => {
                    const rp = persona.responsePatterns[k];
                    if (rp.responses) {
                        const resp = rp.responses;
                        if (resp === null || resp === undefined) {
                            rp.responses = [];
                        } else if (typeof resp === 'string') {
                            rp.responses = [resp];
                        } else if (!Array.isArray(resp)) {
                            rp.responses = [String(resp)];
                        }
                    }
                });
            }
            
            // Normalize colorScheme
            if (persona.colorScheme) {
                if (Array.isArray(persona.colorScheme)) {
                    persona.colorScheme = {
                        primary: persona.colorScheme[0] || "#007bff",
                        secondary: persona.colorScheme[1] || "#FFD700",
                        accent: persona.colorScheme[2] || "#FFA500"
                    };
                }
            } else {
                persona.colorScheme = { primary: "#007bff", secondary: "#FFD700", accent: "#FFA500" };
            }
            
            // Fill in missing optional fields with defaults
            persona.era = persona.era || null;
            persona.avatar = persona.avatar || null;
            persona.title = persona.title || null;
            persona.nationality = persona.nationality || null;
            persona.traits = persona.traits || [];
            persona.speakingStyle = persona.speakingStyle || {};
            persona.knowledgeDomains = persona.knowledgeDomains || [];
            persona.coreBeliefs = persona.coreBeliefs || [];
            persona.lifePhilosophy = persona.lifePhilosophy || "";
            persona.responsePatterns = persona.responsePatterns || {};
            
            return persona;
        }
        
        try {
            if (responseText) {
                let raw_text = responseText.trim();
                
                // Remove Markdown code block if present
                if (raw_text.startsWith('```')) {
                    raw_text = raw_text.replace(/^```[a-zA-Z]*\s*/, '');
                    raw_text = raw_text.replace(/```\s*$/, '');
                    raw_text = raw_text.trim();
                }
                
                if (raw_text.startsWith('{')) {
                    try {
                        let persona_data = JSON.parse(raw_text);
                        persona_data = normalize_persona(persona_data);
                        
                        console.log("=== EXTRACTED PERSONA DATA FROM PDF ===");
                        console.log(JSON.stringify(persona_data, null, 2));
                        
                        // Replace the isPersonaEmpty function with a more robust version
                        function isPersonaEmpty(persona) {
                            // Consider it empty if name is missing, null, empty string, or generic fallback, and traits/knowledgeDomains are empty
                            const genericNames = [
                                'Unknown',
                                'Unknown Individual',
                                'Unknown Persona',
                                '',
                                null,
                                undefined
                            ];
                            return (
                                !persona ||
                                !persona.name ||
                                genericNames.includes(persona.name) ||
                                (Array.isArray(persona.traits) && persona.traits.length === 0) &&
                                (Array.isArray(persona.knowledgeDomains) && persona.knowledgeDomains.length === 0)
                            );
                        }
                        
                        if (isPersonaEmpty(persona_data)) {
                            persona_data = createContentBasedPersona(full_text);
                        }
                        
                        // After fallback, always ensure persona_data.name is set to a valid, non-empty value
                        if (!persona_data.name || persona_data.name === '' || persona_data.name === null || persona_data.name === 'Unknown' || persona_data.name === 'Unknown Individual') {
                            persona_data.name = createContentBasedPersona(full_text).name;
                        }
                        
                        res.json({ persona: persona_data, full_text: full_text });
                    } catch (e) {
                        console.log("=== ERROR: JSON decode failed ===");
                        console.log(e.message);
                        console.log(raw_text);
                        res.status(500).json({ error: "JSON decode failed", raw: raw_text });
                    }
                } else {
                    console.log("=== ERROR: Gemini returned empty or invalid JSON ===");
                    console.log(`Raw response: ${responseText}`);
                    res.status(500).json({ error: "Gemini returned empty or invalid JSON.", raw: responseText });
                }
            } else {
                console.log("=== ERROR: Gemini returned no response text ===");
                res.status(500).json({ error: "Gemini returned no response text.", raw: "" });
            }
        } catch (error) {
            console.log("=== ERROR: Could not parse persona data from Gemini response ===");
            console.log(error.message);
            console.log(responseText);
            res.status(500).json({ error: "Could not parse persona data from Gemini response.", raw: responseText });
        }
        
        // Clean up uploaded file
        fs.unlinkSync(filePath);
        
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// File upload endpoint (for future agentic processing)
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        
        res.json({ 
            filename: req.file.originalname, 
            status: "received" 
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 