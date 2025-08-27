AI Curriculum Generator
=======================

A minimal Express + TypeScript web app that uses an LLM to generate full-scale, standards-aware curriculum documents from user inputs. It includes a simple client UI, an API endpoint, validation with Zod, and client-side PDF export.

Quick start
-----------

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment:

   ```bash
   cp .env.example .env
   # Add your OpenAI API key to .env
   ```

3. Run the dev server:

   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

If no OPENAI_API_KEY is set, the app returns a local fallback summary instead of a full curriculum.

Endpoint
--------

- POST `/api/curricula/generate`

  Request body (JSON):

  ```json
  {
    "topic": "Intro to Data Science",
    "audience": "9-12",
    "length": { "weeks": 6, "classesPerWeek": 3, "minutesPerClass": 55 },
    "goals": ["Understand core concepts", "Build working programs"],
    "standards": ["CSTA 3A-AP-16"],
    "techAccess": "Medium",
    "constraints": ["Large class", "ELLs"],
    "differentiation": "Provide scaffolds and extensions"
  }
  ```

  Response body:

  ```json
  { "document": "<teacher-ready curriculum markdown-like text>" }
  ```

Customization
-------------

- Modify the system prompt and output format in `src/utils/generator.ts`.
- Replace client UI styling in `src/public/index.html` or integrate a frontend framework.
- Swap LLM providers by updating `generateCurriculum` accordingly.

Security notes
--------------

- Do not expose your API key to the client. The server calls the LLM.
- Rate limit and add auth for production.
- Validate and sanitize all inputs (Zod schema provided).

License
-------

MIT

