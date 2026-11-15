import {
  createPrescription,
  getUserPrescriptions,
  deletePrescription
} from "../services/prescription.service.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary
} from "../services/storage.service.js";

import { analyzePrescription } from "../services/analysis.service.js";


export const uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a prescription."
      });
    }

    // 1. Upload original file to Cloudinary
    const uploadedFile = await uploadToCloudinary(req.file);

    let analysis = null;
    let analysisError = null;

    // 2. Send file to Python for analysis
    try {
      analysis = await analyzePrescription(req.file);
    } catch (error) {
      console.error("Prescription analysis error:", error);
      analysisError = error.message;
    }

    // 3. Prepare extracted text
    const investigations = analysis?.investigations || [];

    const extractedText = investigations
      .map(item => item.raw_name)
      .join("\n");

    // 4. Save prescription and analysis in Neon
    const prescription = await createPrescription({
      userId: req.userId,
      fileName: req.file.originalname,
      fileUrl: uploadedFile.url,
      publicId: uploadedFile.publicId,
      extractedText: analysis ? extractedText : null,
      investigations
    });

    // 5. Return response
    return res.status(201).json({
      message: analysis
        ? "Prescription uploaded and analyzed successfully."
        : "Prescription uploaded, but analysis failed.",
      prescription,
      analysisStatus: analysis ? "completed" : "failed",
      analysisError
    });

  } catch (error) {
    console.error("Prescription upload error:", error);

    return res.status(500).json({
      message: "Unable to upload prescription."
    });
  }
};

export const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await getUserPrescriptions(req.userId);

    return res.status(200).json({
      message: "Prescription history fetched successfully.",
      prescriptions
    });
  } catch (error) {
    console.error("Fetch prescriptions error:", error);

    return res.status(500).json({
      message: "Unable to fetch prescription history."
    });
  }
};
export const removePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await deletePrescription(id, req.userId);

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found."
      });
    }

    if (prescription.publicId) {
      await deleteFromCloudinary(prescription.publicId);
    }

    return res.status(200).json({
      message: "Prescription deleted successfully."
    });

  } catch (error) {
    console.error("Delete prescription error:", error);

    return res.status(500).json({
      message: "Unable to delete prescription."
    });
  }
};