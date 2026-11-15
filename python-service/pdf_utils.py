import pymupdf
import numpy as np
import cv2


def pdf_to_images(pdf_bytes: bytes):
    document = pymupdf.open(
        stream=pdf_bytes,
        filetype="pdf"
    )

    images = []

    for page in document:
        pixmap = page.get_pixmap(
            matrix=pymupdf.Matrix(2, 2),
            alpha=False
        )

        image_array = np.frombuffer(
            pixmap.samples,
            dtype=np.uint8
        )

        image = image_array.reshape(
            pixmap.height,
            pixmap.width,
            pixmap.n
        )

        image = cv2.cvtColor(
            image,
            cv2.COLOR_RGB2BGR
        )

        images.append(image)

    document.close()

    return images