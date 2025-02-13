import { Request, Response } from "express";
import {
  createAvailabilitySlot as createAvailabilitySlotService,
  updateAvailabilitySlot as updateAvailabilitySlotService,
  getAvailabilitySlots as getAvailabilitySlotsService,
  deleteAvailabilitySlot as deleteAvailabilitySlotService
} from "./availability.service";


export const createAvailabilitySlot = async (req: Request, res: Response) => {
  try {
    const { startTime, endTime } = req.body;
    const staffId = req.user.id; 
    const newAvailabilitySlot = await createAvailabilitySlotService(staffId, new Date(startTime), new Date(endTime));
    res.status(201).json(newAvailabilitySlot);
  } catch (error) {
    console.error("Error creating availability slot:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateAvailabilitySlot = async (req: Request, res: Response) => {
  try {
    const { id, startTime, endTime } = req.body;
    const updatedAvailabilitySlot = await updateAvailabilitySlotService(id, new Date(startTime), new Date(endTime));
    res.status(200).json(updatedAvailabilitySlot);
  } catch (error) {
    console.error("Error updating availability slot:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getAvailabilitySlots = async (req: Request, res: Response) => {
  try {
    const { staffId } = req.body;
    const availabilitySlots = await getAvailabilitySlotsService(String(staffId));
    res.status(200).json(availabilitySlots);
  } catch (error) {
    console.error("Error fetching availability slots:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const deleteAvailabilitySlot = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedSlot = await deleteAvailabilitySlotService(id);
    if (deletedSlot) {
      return res.status(200).json({ message: "Availability slot deleted successfully", deletedSlot });
    } else {
      return res.status(404).json({ error: "Availability slot not found" });
    }
  } catch (error) {
    console.error("Error deleting availability slot:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
