import express from "express";
import {
  createAvailabilitySlot,
  updateAvailabilitySlot,
  getAvailabilitySlots,
  deleteAvailabilitySlot
} from "./availability.controller";
import { checkRole } from "../common/middlewares/role-auth.middleware"; // Importing the role protection middleware
import loginRequireMiddlware from "../common/middlewares/auth.middleware";

const router = express.Router();

// Routes for availability slots with role protection (STAFF or ADMIN roles only for create, update, delete)
router.post("/create", loginRequireMiddlware, checkRole(["STAFF", "ADMIN"]), createAvailabilitySlot);
router.put("/update", loginRequireMiddlware, checkRole(["STAFF", "ADMIN"]), updateAvailabilitySlot);
router.get("/list", loginRequireMiddlware, getAvailabilitySlots);  // No protection, available for all users
router.delete("/delete/:id", loginRequireMiddlware, checkRole(["STAFF", "ADMIN"]), deleteAvailabilitySlot);

export default router;
