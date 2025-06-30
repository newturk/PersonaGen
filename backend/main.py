from fastapi import FastAPI, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from typing import Any, Optional
from google import genai
from google.genai import types
import json
import PyPDF2
import re

app = FastAPI()

# Add CORS middleware for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = "AIzaSyBJG00JUXm-M7JVWykZCX3w4xoCG9GNq2E"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash"

client = genai.Client(api_key=GEMINI_API_KEY)

class ChatRequest(BaseModel):
    persona: dict
    history: list  # List of {role, content}
    message: str
    full_text: Optional[str] = None

@app.post("/chat")
async def chat(req: ChatRequest):
    persona = req.persona
    persona_name = persona.get("name", "Unknown")
    tone = persona.get("speakingStyle", {}).get("tone", "")
    beliefs = ", ".join(persona.get("coreBeliefs", []))
    philosophy = persona.get("lifePhilosophy", "")
    style = persona.get("speakingStyle", {}).get("expressions", [])
    style_str = ", ".join(style)
    # Add full_text context if provided
    full_text = req.full_text if hasattr(req, 'full_text') and req.full_text else None
    if full_text:
        system_prompt = (
            f"You are now acting as {persona_name}. "
            f"Your tone is: {tone}. "
            f"Core beliefs: {beliefs}. "
            f"Life philosophy: {philosophy}. "
            f"Speaking style: {style_str}. "
            f"Here is the full autobiography/biography for reference:\n{full_text}\n"
            f"Respond to all questions as if you are {persona_name}, using their tone, beliefs, style, and referencing the document as needed."
        )
    else:
        system_prompt = (
            f"You are now acting as {persona_name}. "
            f"Your tone is: {tone}. "
            f"Core beliefs: {beliefs}. "
            f"Life philosophy: {philosophy}. "
            f"Speaking style: {style_str}. "
            f"Respond to all questions as if you are {persona_name}, using their tone, beliefs, and style."
        )
    print("=== SYSTEM PROMPT SENT TO GEMINI ===")
    print(system_prompt)
    gemini_messages = [
        {"role": "user", "parts": [{"text": system_prompt}]}
    ]
    # Add present conversation history
    for msg in req.history:
        if msg['role'] == 'user':
            gemini_messages.append({"role": "user", "parts": [{"text": msg['content']}]})
        else:
            gemini_messages.append({"role": "model", "parts": [{"text": msg['content']}]})
    # Add the new user message
    gemini_messages.append({"role": "user", "parts": [{"text": req.message}]})
    # Prepare contents as a list of strings for the SDK
    contents = [msg['parts'][0]['text'] for msg in gemini_messages]
    response = client.models.generate_content(
        model='models/gemini-2.5-flash',
        contents=contents
    )
    print("=== GEMINI API RAW RESPONSE ===")
    print(response.text)
    if response.text:
        return {"response": response.text}
    else:
        return {"response": "Sorry, I couldn't get a response from the digital persona. Please try again later."}

# PDF upload and persona extraction endpoint
@app.post("/upload_pdf")
async def upload_pdf(file: UploadFile = File(...)):
    UPLOAD_DIR = "uploads"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    filename = file.filename or "uploaded.pdf"
    temp_path = os.path.join(UPLOAD_DIR, filename)
    with open(temp_path, "wb") as f:
        f.write(await file.read())
    # Extract full text from PDF
    full_text = ""
    try:
        with open(temp_path, "rb") as pdf_file:
            reader = PyPDF2.PdfReader(pdf_file)
            for page in reader.pages:
                full_text += page.extract_text() or ""
    except Exception as e:
        print("=== ERROR: Could not extract text from PDF ===")
        print(str(e))
        full_text = ""
    print("=== UPLOADING PDF TO GEMINI ===")
    print(f"File path: {temp_path}")
    gemini_file = client.files.upload(file=temp_path)
    print("=== FILE UPLOADED TO GEMINI ===")
    # Ask Gemini to extract persona traits, beliefs, style, etc.
    prompt = (
        "Analyze the attached PDF autobiography/biography and extract the following as JSON: "
        "name, title, era, nationality, traits (with name, value 0-100, description, color), "
        "speakingStyle (tone, vocabulary, expressions, greetings), knowledgeDomains (domain, expertise 0-100, keyTopics), "
        "coreBeliefs, lifePhilosophy, responsePatterns (with context, responses, emotion), colorScheme, avatar. "
        "Return only the JSON object."
    )
    print("=== SENDING PROMPT TO GEMINI ===")
    print(prompt)
    response = client.models.generate_content(
        model='models/gemini-1.5-flash',
        contents=[prompt, gemini_file]
    )
    print("=== RAW RESPONSE FROM GEMINI ===")
    print(response.text)
    # Try to parse the JSON from Gemini's response
    def normalize_persona(persona):
        # Normalize speakingStyle fields
        if 'speakingStyle' in persona:
            for key in ['greetings', 'expressions', 'vocabulary']:
                val = persona['speakingStyle'].get(key)
                if val is None:
                    persona['speakingStyle'][key] = []
                elif isinstance(val, str):
                    persona['speakingStyle'][key] = [val]
                elif isinstance(val, list):
                    pass  # already a list
                else:
                    persona['speakingStyle'][key] = [str(val)]
        # Normalize responsePatterns
        if 'responsePatterns' in persona:
            rps = persona['responsePatterns']
            if isinstance(rps, list):
                # Convert list to dict for compatibility
                persona['responsePatterns'] = {str(i): rp for i, rp in enumerate(rps)}
                rps = persona['responsePatterns']
            if isinstance(rps, dict):
                for k, rp in rps.items():
                    if 'responses' in rp:
                        resp = rp['responses']
                        if resp is None:
                            rp['responses'] = []
                        elif isinstance(resp, str):
                            rp['responses'] = [resp]
                        elif isinstance(resp, list):
                            pass
                        else:
                            rp['responses'] = [str(resp)]
        # Normalize colorScheme
        if 'colorScheme' in persona:
            cs = persona['colorScheme']
            if isinstance(cs, list):
                persona['colorScheme'] = {
                    "primary": cs[0] if len(cs) > 0 else "#007bff",
                    "secondary": cs[1] if len(cs) > 1 else "#FFD700",
                    "accent": cs[2] if len(cs) > 2 else "#FFA500"
                }
            elif isinstance(cs, dict):
                # Accept as is
                pass
            else:
                persona['colorScheme'] = {"primary": "#007bff", "secondary": "#FFD700", "accent": "#FFA500"}
        # Fill in missing optional fields with defaults
        persona.setdefault('era', None)
        persona.setdefault('avatar', None)
        persona.setdefault('title', None)
        persona.setdefault('nationality', None)
        persona.setdefault('traits', [])
        persona.setdefault('speakingStyle', {})
        persona.setdefault('knowledgeDomains', [])
        persona.setdefault('coreBeliefs', [])
        persona.setdefault('lifePhilosophy', "")
        persona.setdefault('responsePatterns', {})
        persona.setdefault('colorScheme', {"primary": "#007bff", "secondary": "#FFD700", "accent": "#FFA500"})
        return persona
    try:
        if response.text:
            raw_text = response.text.strip()
            # Remove Markdown code block if present
            if raw_text.startswith('```'):
                raw_text = re.sub(r'^```[a-zA-Z]*\s*', '', raw_text)
                raw_text = re.sub(r'```\s*$', '', raw_text)
                raw_text = raw_text.strip()
            if raw_text.startswith('{'):
                try:
                    persona_data = json.loads(raw_text)
                except Exception as e:
                    print("=== ERROR: JSON decode failed ===")
                    print(str(e))
                    print(raw_text)
                    return {"error": "JSON decode failed", "raw": raw_text}
                try:
                    persona_data = normalize_persona(persona_data)
                except Exception as e:
                    print("=== ERROR: Normalization failed ===")
                    print(str(e))
                    print(json.dumps(persona_data, indent=2))
                    return {"error": "Normalization failed", "raw": json.dumps(persona_data)}
                print("=== EXTRACTED PERSONA DATA FROM PDF ===")
                print(json.dumps(persona_data, indent=2))
                return {"persona": persona_data, "full_text": full_text}
            else:
                print("=== ERROR: Gemini returned empty or invalid JSON ===")
                print(f"Raw response: {response.text}")
                return {"error": "Gemini returned empty or invalid JSON.", "raw": response.text}
        else:
            print("=== ERROR: Gemini returned no response text ===")
            return {"error": "Gemini returned no response text.", "raw": ""}
    except Exception as e:
        print("=== ERROR: Could not parse persona data from Gemini response ===")
        print(str(e))
        print(response.text)
        return {"error": "Could not parse persona data from Gemini response.", "raw": response.text}

# File upload endpoint (for future agentic processing)
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Placeholder: Save file and trigger agentic processing
    contents = await file.read()
    # Save or process contents as needed
    return {"filename": file.filename, "status": "received"} 