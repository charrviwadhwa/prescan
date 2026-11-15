import { db } from "../config/db.js";
import { prescriptions } from "../db/schema/prescriptions.js";
import { eq, desc, and } from "drizzle-orm";


export const createPrescription = async ({
  userId,
  fileName,
  fileUrl,
  publicId,
  extractedText,
  investigations
}) => {
  const [prescription] = await db
    .insert(prescriptions)
    .values({
      userId,
      fileName,
      fileUrl,
      publicId,
      extractedText,
      investigations
    })
    .returning();

  return prescription;
};



export const getUserPrescriptions = async (userId) => {
  return await db
    .select()
    .from(prescriptions)
    .where(eq(prescriptions.userId, userId))
    .orderBy(desc(prescriptions.createdAt));
};
export const deletePrescription = async (prescriptionId, userId) => {
  const [deletedPrescription] = await db
    .delete(prescriptions)
    .where(
      and(
        eq(prescriptions.id, prescriptionId),
        eq(prescriptions.userId, userId)
      )
    )
    .returning();

  return deletedPrescription;
};