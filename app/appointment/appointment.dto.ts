import { BaseSchema } from "../common/dto/base.dto";
import { AppointmentStatus } from "@prisma/client";

/**
 * DTO for Appointment
 */
export interface AppointmentDTO extends BaseSchema {
  userId: string;
  staffId: string;
  startTime: string;
  endTime: string;
  appointmentTime: string; 
  status: AppointmentStatus;
}
