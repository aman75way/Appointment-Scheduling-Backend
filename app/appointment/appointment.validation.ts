import { AppointmentStatus } from "@prisma/client";

/**
 * Validates appointment data
 */
export const validateAppointment = (data: any) => {
  const errors: string[] = [];
  const { staffId, availabilitySlotId, startTime, endTime, status } = data;

  // Ensure that staffId is provided and is a valid string
  if (!staffId || typeof staffId !== "string") errors.push("Invalid staffId.");

  // Ensure that availabilitySlotId is provided and is a valid string
  if (!availabilitySlotId || typeof availabilitySlotId !== "string") errors.push("Invalid availabilitySlotId.");

  // Ensure status is one of the valid AppointmentStatus values
  if (!Object.values(AppointmentStatus).includes(status)) errors.push("Invalid status.");

  return { valid: errors.length === 0, errors };
};
