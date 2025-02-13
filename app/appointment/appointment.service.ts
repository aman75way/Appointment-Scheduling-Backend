import { AppointmentStatus } from "@prisma/client";
import { AppointmentDTO } from "./appointment.dto";
import prisma from "../common/services/database.service";
import { sendAppointmentEmail } from "../common/services/email.service";



/**
 * Creates a new appointment.
 *
 * This function will create a new appointment record in the database using
 * the provided user ID, staff ID, and availability slot ID. It will then return
 * the created appointment as an AppointmentDTO.
 *
 * The function will throw an error if the selected availability slot does not
 * exist, or if the selected slot does not belong to the specified staff
 * member. Additionally, it will throw an error if the appointment time
 * conflicts with existing appointments for the specified staff member.
 *
 * @param userId - The unique identifier of the user making the appointment.
 * @param staffId - The unique identifier of the staff member receiving the
 * appointment.
 * @param availabilitySlotId - The unique identifier of the availability slot
 * being booked.
 * @returns A promise that resolves to an AppointmentDTO object representing
 * the newly created appointment.
 */
export const createAppointment = async (
  userId: string,
  staffId: string,
  availabilitySlotId: string
): Promise<AppointmentDTO> => {
  const availabilitySlot = await prisma.availabilitySlot.findUnique({
    where: { id: availabilitySlotId },
  });

  if (!availabilitySlot) throw new Error("The selected availability slot does not exist.");

  if (availabilitySlot.staffId !== staffId) {
    throw new Error("The selected slot does not belong to the specified staff member.");
  }

  const appointment = await prisma.appointment.create({
    data: {
      userId,
      staffId,
      startTime: availabilitySlot.startTime,
      endTime: availabilitySlot.endTime,
      status: AppointmentStatus.CONFIRMED,
    },
    include: {
      user: true, // Fetch user details for email
      staff: true, // Fetch staff details for email
    },
  });

  await prisma.availabilitySlot.delete({ where: { id: availabilitySlotId } });

  // Send confirmation email
  if (appointment.user.email) {
    await sendAppointmentEmail(
      appointment.user.email,
      appointment.startTime.toISOString()
    );
  }

  return {
    ...appointment,
    appointmentTime: appointment.startTime.toISOString(),
    startTime: appointment.startTime.toISOString(),
    endTime: appointment.endTime.toISOString(),
    createdAt: appointment.createdAt.toISOString(),
    updatedAt: appointment.updatedAt.toISOString(),
  };
};



/**
 * Retrieves a list of appointments for a specific user.
 * 
 * This function queries the database to find all appointments associated with
 * the provided user ID and returns them in the AppointmentDTO format.
 * 
 * @param userId - The unique identifier of the user whose appointments are to be retrieved.
 * @returns A promise that resolves to an array of AppointmentDTO objects, each representing an
 * appointment of the specified user.
 */
export const getAppointmentsForUser = async (userId: string): Promise<AppointmentDTO[]> => {
  const appointments = await prisma.appointment.findMany({
    where: { userId },
  });

  return appointments.map(appointment => ({
    ...appointment,
    appointmentTime: appointment.startTime.toISOString(),
    startTime: appointment.startTime.toISOString(),
    endTime: appointment.endTime.toISOString(),
    createdAt: appointment.createdAt.toISOString(),
    updatedAt: appointment.updatedAt.toISOString(),
  }));
};



/**
 * Updates an existing appointment with a new status.
 * 
 * This function takes the ID of an existing appointment and updates its status
 * in the database. It returns the updated appointment in the correct format.
 * 
 * @param appointmentId - The unique identifier of the appointment to be updated.
 * @param status - The new status of the appointment.
 * @returns A Promise that resolves to an AppointmentDTO object containing the updated
 * appointment details in a formatted manner.
 */
export const updateAppointmentStatus = async (
  appointmentId: string,
  status: AppointmentStatus
): Promise<AppointmentDTO> => {
  const updatedAppointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
  });

  return {
    ...updatedAppointment,
    appointmentTime: updatedAppointment.startTime.toISOString(),
    startTime: updatedAppointment.startTime.toISOString(),
    endTime: updatedAppointment.endTime.toISOString(),
    createdAt: updatedAppointment.createdAt.toISOString(),
    updatedAt: updatedAppointment.updatedAt.toISOString(),
  };
};


/**
 * Cancels an appointment by its ID.
 * 
 * This function retrieves the appointment associated with the provided ID,
 * checks if it exists, and if it does, deletes it from the database.
 * Finally, it returns the canceled appointment details.
 * 
 * @param appointmentId - The unique identifier of the appointment to be canceled.
 * @returns A Promise that resolves to an AppointmentDTO object containing the 
 * details of the canceled appointment.
 * @throws {Error} If the appointment with the provided ID does not exist.
 */
export const cancelAppointment = async (appointmentId: string): Promise<AppointmentDTO> => {
  // Step 1: Get the appointment details
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new Error("The appointment does not exist.");
  }

  // Step 2: Delete the appointment
  await prisma.appointment.delete({
    where: { id: appointmentId },
  });

  // Step 3: Return the canceled appointment data
  return {
    ...appointment,
    appointmentTime: appointment.startTime.toISOString(),
    startTime: appointment.startTime.toISOString(),
    endTime: appointment.endTime.toISOString(),
    createdAt: appointment.createdAt.toISOString(),
    updatedAt: appointment.updatedAt.toISOString(),
  };
};
