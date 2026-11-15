import json
import cv2
import numpy as np
import time
from fastapi import FastAPI, UploadFile, File, HTTPException
from investigation_matcher import match_investigation
from pdf_utils import pdf_to_images
from image_utils import preprocess_image
from gemini_service import analyze_prescription

app = FastAPI(
    title="Prescan Python Service",
    description="Handwritten prescription analysis service",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Prescan Python Service is running!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    if file.content_type not in [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPG, PNG, WEBP or PDF file."
        )

    try:
        start_time = time.time()
        print("Starting prescription analysis...")

        image_bytes = await file.read()

        # Convert PDF pages or prepare uploaded image
        if file.content_type == "application/pdf":
            pages = pdf_to_images(image_bytes)
        else:
            image_array = cv2.imdecode(
                np.frombuffer(image_bytes, dtype=np.uint8),
                cv2.IMREAD_COLOR
            )

            if image_array is None:
                raise ValueError("Unable to read the uploaded image.")

            pages = [image_array]

        print(f"PDF/image conversion completed in {time.time() - start_time:.2f}s")
        print(f"Total pages: {len(pages)}")

        all_investigations = []

        # Process each page separately
        for page_number, page in enumerate(pages, start=1):
            print(f"Processing page {page_number}...")

            page_start = time.time()

            success, encoded_image = cv2.imencode(".png", page)

            if not success:
                raise ValueError("Image processing failed.")

            result = analyze_prescription(
                encoded_image.tobytes(),
                "image/png"
            )

            print(
                f"Gemini completed page {page_number} "
                f"in {time.time() - page_start:.2f}s"
            )

            # Parse Gemini response for this page
            result = result.strip()
            result = result.replace("```json", "").replace("```", "").strip()

            extracted_data = json.loads(result)

            # Match investigations for this page
            for investigation in extracted_data.get("investigations", []):
                match = match_investigation(
                    investigation["raw_name"],
                    investigation["standard_name"]
                )

                match["confidence"] = investigation["confidence"]
                match["page_number"] = page_number

                all_investigations.append(match)

        print(
            f"Analysis completed in {time.time() - start_time:.2f}s"
        )

        return {
            "investigations": all_investigations
        }

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Gemini returned an invalid JSON response."
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
