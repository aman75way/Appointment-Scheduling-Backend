import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { createAppointment, getAppointmentsForUser, updateAppointmentStatus, cancelAppointment } from "./appointment.service";
import { validateAppointment } from "./appointment.validation";
import { AppointmentStatus } from "@prisma/client";

/**
 * Controller to create an appointment
 */
export const createAppointmentHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.id; // Assuming the userId is stored in req.user.id from authentication middleware
  const { staffId, availabilitySlotId } = req.body; // Accept availabilitySlotId from the body

  // // Ensure the user has "USER" role
  // if (req.user.role !== "USER") {
  //   res.status(403).json({ error: "Only users with 'USER' role can create an appointment." });
  //   return;
  // }

  // Step 1: Validate the request body
  // const { valid, errors } = validateAppointment(req.body);
  // if (!valid) {
  //   res.status(400).json({ errors });
  //   return;
  // }

  // Step 2: Create the appointment using the service function
  try {
    const appointment = await createAppointment(userId, staffId, availabilitySlotId);
    res.status(201).json(appointment);
  } catch (error) {
    // TypeScript - Narrow the error type to handle it properly
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  }
});

/**
 * Controller to get appointments for a user
 */
export const getUserAppointments = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.id;  // Assuming authentication middleware sets userId

  const appointments = await getAppointmentsForUser(userId);
  res.status(200).json(appointments);
});

/**
 * Controller to update appointment status
 */
export const updateAppointmentStatusHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  if (!Object.values(AppointmentStatus).includes(status)) {
    res.status(400).json({ error: "Invalid appointment status." });
    return;
  }

  const updatedAppointment = await updateAppointmentStatus(appointmentId, status);
  res.status(200).json(updatedAppointment);
});

/**
 * Controller to cancel an appointment
 */
export const cancelAppointmentHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { appointmentId } = req.params;

  const canceledAppointment = await cancelAppointment(appointmentId);
  res.status(200).json(canceledAppointment);
});