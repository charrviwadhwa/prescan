import express from "express";
import {
  uploadPrescription,
  getPrescriptions,
  removePrescription
} from "../controllers/prescription.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.post(
  "/upload",
  authenticateUser,
  upload.single("prescription"),
  uploadPrescription
);
router.get(
  "/",
  authenticateUser,
  getPrescriptions
);
router.delete(
  "/:id",
  authenticateUser,
  removePrescription
);

export default router;