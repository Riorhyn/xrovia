import crypto from "crypto";
import { prisma } from "../db/prisma";

/**
 * Generates an unguessable, collision-resistant Professional ID
 * Format: PR-XXXXXX (e.g. PR-829471)
 */
export async function generateUniqueProfessionalId(): Promise<string> {
  let isUnique = false;
  let candidateId = "";
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    attempts++;
    // Generate a secure 6-digit number string: 100000 -> 999999
    const randomBuffer = crypto.randomBytes(4);
    const randomNumber = 100000 + (randomBuffer.readUInt32BE(0) % 900000);
    candidateId = `PR-${randomNumber}`;

    const existing = await prisma.profile.findUnique({
      where: { professionalId: candidateId },
      select: { id: true },
    });

    if (!existing) {
      isUnique = true;
    }
  }

  if (!isUnique) {
    throw new Error("Unable to generate unique Professional ID. Please retry.");
  }

  return candidateId;
}