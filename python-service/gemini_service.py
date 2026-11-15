import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load the existing server/.env file
env_path = Path(__file__).resolve().parent.parent / "server" / ".env"
load_dotenv(env_path)

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODEL = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")


def analyze_prescription(image_bytes: bytes, mime_type: str):
    prompt = """
    You are an AI vision system specialized in reading handwritten doctor prescriptions.

Your task is to identify ONLY medical investigations, laboratory tests, and diagnostic procedures visibly written on the prescription image.

## Strict extraction rules

1. Use only the prescription image as the source of truth.
2. Extract only investigations that are actually written or visibly indicated.
3. Never infer investigations from symptoms, diagnoses, diseases, medicines, or medical context.
4. Never add commonly associated tests.
5. Do not use external databases to decide whether an investigation exists.
6. Never invent an investigation.
7. If handwriting is unclear and the investigation cannot be confidently identified, omit it.
8. Do not include medicines, diagnoses, symptoms, or patient/doctor information.
9. Prioritize precision over recall.

## Output fields

For every confidently identified investigation, return:

- `raw_name`: The investigation exactly as written, or as closely as it can be read.
- `standard_name`: The medically standard/full name corresponding to the visible text. Only normalize the name; do not expand its meaning.
- `confidence`: A numerical confidence between 0.0 and 1.0 representing confidence in reading and standardizing the investigation.

## Important examples

- CBC → Complete Blood Count
- FBS → Fasting Blood Sugar
- PET CT → Positron Emission Tomography - Computed Tomography

Never convert PET CT into PSMA PET CT unless PSMA is visibly written.

Never add PPBS when only FBS is written.

Never add Platelet Count when only CBC is written.

## Output requirements

Return ONLY valid JSON. Do not include Markdown, explanations, or additional text.

Use exactly this structure:

{
  "investigations": [
    {
      "raw_name": "string",
      "standard_name": "string",
      "confidence": 0.0
    }
  ]
}

If no investigation can be confidently identified, return:

{
  "investigations": []
}
    """

    response = client.models.generate_content(
        model=MODEL,
        contents=[
            types.Part.from_bytes(
                data=image_bytes,
                mime_type=mime_type
            ),
            prompt
        ]
    )

    return response.text