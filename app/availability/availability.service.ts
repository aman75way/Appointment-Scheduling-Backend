import { PrismaClient } from "@prisma/client";
import { AvailabilitySlotDTO } from "./availability.dto";

const prisma = new PrismaClient();


/**
 * Creates a new availability slot for a staff member.
 *
 * This function inserts a new availability slot record into the database
 * using the provided staff ID, start time, and end time. It returns the
 * created slot as an AvailabilitySlotDTO.
 *
 * @param staffId - The unique identifier of the staff member.
 * @param startTime - The start time for the availability slot.
 * @param endTime - The end time for the availability slot.
 * @returns A promise that resolves to an AvailabilitySlotDTO object
 * representing the newly created availability slot.
 */
export const createAvailabilitySlot = async (
  staffId: string,
  startTime: Date,
  endTime: Date
): Promise<AvailabilitySlotDTO> => {
  const availabilitySlot = await prisma.availabilitySlot.create({
    data: {
      staffId,
      startTime,
      endTime,
    },
  });

  return mapToDTO(availabilitySlot);
};


/**
 * Updates an existing availability slot with new start and end times.
 *
 * This function takes the ID of an existing availability slot and updates
 * its start and end times in the database. It returns the updated slot
 * in the form of an AvailabilitySlotDTO.
 *
 * @param id - The unique identifier of the availability slot to be updated.
 * @param startTime - The new start time for the availability slot.
 * @param endTime - The new end time for the availability slot.
 * @returns A promise that resolves to an AvailabilitySlotDTO object
 * representing the updated availability slot.
 * @throws Error if the availability slot with the specified ID does not exist.
 */
export const updateAvailabilitySlot = async (
  id: string,
  startTime: Date,
  endTime: Date
): Promise<AvailabilitySlotDTO> => {
  const updatedAvailabilitySlot = await prisma.availabilitySlot.update({
    where: { id },
    data: {
      startTime,
      endTime,
    },
  });

  return mapToDTO(updatedAvailabilitySlot);
};


/**
 * Retrieves a list of availability slots for a specific staff member.
 *
 * This function queries the database to find all availability slots
 * associated with the provided staff ID and returns them in a DTO format.
 *
 * @param staffId - The unique identifier of the staff member whose
 * availability slots are to be retrieved.
 * @returns A promise that resolves to an array of AvailabilitySlotDTO
 * objects, each representing an availability slot of the specified
 * staff member.
 */
export const getAvailabilitySlots = async (staffId: string): Promise<AvailabilitySlotDTO[]> => {
  const availabilitySlots = await prisma.availabilitySlot.findMany({
    where: { staffId },
  });

  return availabilitySlots.map(mapToDTO);
};


/**
 * Deletes an availability slot by ID.
 *
 * Returns the deleted availability slot in a DTO format, or `null` if the slot was not found.
 *
 * @param id - The ID of the availability slot to delete
 * @returns The deleted availability slot as a DTO or `null` if the slot was not found
 * @throws {Error} If the slot was not found
 */
export const deleteAvailabilitySlot = async (id: string): Promise<AvailabilitySlotDTO | null> => {
  try {
    const deletedSlot = await prisma.availabilitySlot.delete({
      where: { id },
    });

    return mapToDTO(deletedSlot);
  } catch (error) {
    console.error("Error deleting availability slot:", error);
    throw new Error("Availability slot not found");
  }
};


/**
 * Maps a raw availability slot object from the database to a DTO for client consumption.
 *
 * This function takes a raw availability slot object from the database and returns a new
 * object with the same properties, but with the `startTime`, `endTime`, `createdAt`, and
 * `updatedAt` properties converted to ISO strings.
 */
const mapToDTO = (slot: any): AvailabilitySlotDTO => {
  return {
    ...slot,
    startTime: slot.startTime.toISOString(),
    endTime: slot.endTime.toISOString(),
    createdAt: slot.createdAt.toISOString(),
    updatedAt: slot.updatedAt.toISOString(),
  };
};
