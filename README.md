# PersonaGen

A full-stack application for generating lifelike digital personas from autobiographies, biographies, or personal documents. Upload a PDF, extract a persona, and chat with it using advanced AI (Gemini).

---

## Features
- **PDF Upload & Persona Extraction**: Upload any biography/autobiography PDF and extract a detailed persona profile using Gemini AI.
- **Chat with Persona**: Interact with the generated persona in a chat interface, with responses grounded in the uploaded document.
- **Modern Frontend**: Built with React, Vite, Tailwind CSS, and Framer Motion for a beautiful, responsive UI.
- **Node.js Backend**: Handles file uploads, PDF parsing, persona extraction, and chat endpoints.

---

## Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, Gemini API, pdf-parse

---

## Getting Started

### 1. Clone the Repository
```sh
git clone https://github.com/yourusername/PersonaGen.git
cd PersonaGen
```

### 2. Backend Setup
```sh
cd backend
npm install
```

- Create a `.env` file in `backend/` and add your Gemini API key:
  ```
  GEMINI_API_KEY=your_actual_gemini_api_key_here
  ```
- Start the backend:
  ```sh
  npm run dev
  ```
- The backend will run on `http://localhost:8000`

### 3. Frontend Setup
```sh
cd ../project
npm install
npm run dev
```
- The frontend will run on `http://localhost:5173`

---

## Usage
1. Open the frontend in your browser (`http://localhost:5173`).
2. Upload a PDF biography/autobiography.
3. Wait for persona extraction.
4. Start chatting with the generated persona!

---

## API Endpoints (Backend)
- `POST /upload_pdf` — Upload a PDF, returns persona JSON and full text.
- `POST /chat` — Send a message and get a persona-grounded response.
- `POST /upload` — (Future use) File upload endpoint.

---

## Notes
- Requires a valid Gemini API key for AI features.
- All code is now JavaScript/TypeScript (no Python dependencies).
- Uploaded files are stored in `backend/uploads/`.

---

## License
MIT 