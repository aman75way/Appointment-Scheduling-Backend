import { BaseSchema } from "../common/dto/base.dto";  // Assuming base.dto.ts is in the common folder
import { Role } from "@prisma/client";

/**
 * DTO for AvailabilitySlot
 */
export interface AvailabilitySlotDTO extends BaseSchema {
  staffId: string;      // ID of the staff member
  startTime: string;      // Start time of the availability slot
  endTime: string;        // End time of the availability slot
  createdAt: string;      // Created date for the slot
  updatedAt: string;      // Last updated date for the slot
}
