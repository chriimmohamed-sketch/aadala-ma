# AADALA.MA — Design & Refactor Prompts (reference)

Two prompts provided by the user for use in external AI tools (ChatGPT/Claude/Cursor).
Not executed here — kept as reference.

---

## Prompt 1 — UI/UX Design (design & creative sites)

Role: You are an expert UI/UX designer and frontend developer specializing in building professional, trustworthy web applications that do not look AI-generated.

Context: I am building a Moroccan Legal AI Assistant (AADALA Legal AI). The interface must project high authority, trust, and modern elegance (using colors like deep red, gold, and clean white).

Task: I want to completely redesign the frontend using the best modern tools available. Based on my curated list of resources, please provide a step-by-step design and code integration plan:
1. Component Libraries: I have access to coss.com/ui, beui.dev, ui.nexvyn.dev, and astryx.atmeta.com. Which one is best for a sleek, professional Chat UI and data tables? Provide the initial setup commands for the best choice.
2. Animations & Interactions: I want subtle, professional animations for the chat interface and scrolling. I found scrolltide.co and kinetics.colorion.co. Give me code examples of how to integrate these into a React/Next.js app.
3. Design Assets & MCP: I am using craftwork.design. Generate an MCP configuration file (Model Context Protocol) so my AI coding agent (like Cursor) can directly pull from their 740+ React components and 880+ fonts to build my UI. Ensure the design follows strict commercial licensing (Legal compliance).
4. Prompts & AI UI: I also have botprompts.fyi and uxsnaps.com. Suggest 3 UX patterns for displaying "Legal Citations" and "Sources" under an AI answer to ensure transparency (avoiding the "AI Hallucination" look).
Output: Provide a structured React/Next.js layout for a "Legal Chat Interface" that looks human-crafted, clean, and trustworthy, using the tools mentioned above.

## Prompt 2 — Programming refactor for AADALA

Role: You are a Senior Full-Stack AI Engineer and Database Architect.
Context: I am building AADALA Legal AI (a Moroccan legal assistant). The project is currently a Demo. Looking at my codebase, we have major issues:
- Database is empty: 9 files / 0 PDF processed.
- No OCR implemented. legal_articles are not extracted.
- The RAG (Retrieval-Augmented Generation) pipeline is not fully active.
- last_verified_at is NULL for all documents.
- Frontend Auth is using client-side is_admin() which is insecure.
- No citations/sources are currently linked to AI answers.

Task: I need a complete step-by-step code refactoring plan and the necessary scripts to fix this. Please execute the following steps:

Step 1: Data Ingestion & OCR Pipeline
- Write a Python script using PyMuPDF and Tesseract OCR (or Azure Document Intelligence) to parse Moroccan Legal PDFs (like the Code des Obligations et Contrats).
- The script must extract individual articles (Article Number, Law Name, Text) and output them as clean JSON.

Step 2: Database & RAG Setup (Supabase)
- Provide the SQL schema for Supabase. Create a legal_articles table with columns: id, article_number, law_name, content, embedding (using pgvector), and last_verified_at.
- Write a Node.js/Python script to take the JSON from Step 1, generate embeddings using OpenAI (text-embedding-3-small), and insert them into Supabase.

Step 3: Secure Authentication & RLS
- Write the Supabase Row Level Security (RLS) policies. Ensure that only admins can insert/update articles, and public users can only read.
- Replace the insecure frontend is_admin() logic with secure Supabase Auth middleware (protecting the /admin routes).

Step 4: The RAG Logic (Backend)
- Write the API endpoint (Next.js Route Handler or Cloudflare Worker) for the Chat.
- It should: Receive the user's question -> Generate embedding -> Perform a Vector Search in Supabase -> Retrieve the top 3 relevant articles -> Send them to the LLM with a strict prompt to ONLY answer using the provided articles and return the answer + the exact Article citations.

Step 5: Frontend Implementation
- Update the Chat UI to display the "Sources" and "Article Numbers" dynamically below the AI response. Include the "Demo/Trial" badge and the "Human Verification Required" disclaimer as designed.

Please write the complete code blocks for Step 1, Step 2 (SQL), and Step 4.

Note: AADALA.MA currently uses lexical (IDF) retrieval, not embeddings, by deliberate decision (no embeddings). Applying Step 2/4 would replace that architecture. Confirm before proceeding.
