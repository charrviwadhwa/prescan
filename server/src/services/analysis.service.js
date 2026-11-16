
const PYTHON_SERVICE_URL =
  process.env.PYTHON_SERVICE_URL || "http://127.0.0.1:8000";

export const analyzePrescription = async (file) => {
  const formData = new FormData();

  formData.append(
    "file",
    new Blob([file.buffer], { type: file.mimetype }),
    file.originalname
  );

  const response = await fetch(
    `${PYTHON_SERVICE_URL.replace(/\/+$/, "")}/analyze`,
    {
      method: "POST",
      body: formData
    }
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.detail || "Prescription analysis failed."
    );
  }

  return result;
};
