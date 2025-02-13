import { Router } from "express";
import userRoutes from "./user/user.routes";
import appointmentRoutes from "./appointment/appointment.routes";
import availabilityRoutes from "./availability/availability.routes";

const router = Router();

// Define routes for each feature
router.use('/user', userRoutes);  // User-related routes
router.use('/appointment', appointmentRoutes);  // Appointment-related routes
router.use('/availability', availabilityRoutes);  // Availability-related routes

export default router;
