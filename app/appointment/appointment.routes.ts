import { Router } from "express";
import {
  createAppointmentHandler,
  getUserAppointments,
  updateAppointmentStatusHandler,
  cancelAppointmentHandler,
} from "./appointment.controller";
import loginRequireMiddlware from "../common/middlewares/auth.middleware" ; // Assuming authentication middleware exists
import { checkRole } from "../common/middlewares/role-auth.middleware";

const router = Router();

router.post("/create", loginRequireMiddlware,checkRole(["USER"]) , createAppointmentHandler); // Create an appointment
router.get("/", loginRequireMiddlware, getUserAppointments); // Get appointments for the logged-in user
router.patch("/:appointmentId", loginRequireMiddlware, checkRole(["STAFF", "ADMIN"]), updateAppointmentStatusHandler); // Update appointment status
router.delete("/:appointmentId", loginRequireMiddlware, cancelAppointmentHandler); // Cancel an appointment

export default router;
