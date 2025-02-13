import Joi from "joi";

// Validation schema for Availability Slot
const availabilitySlotSchema = Joi.object({
  startTime: Joi.date().iso().required().messages({
    "date.base": `"startTime" should be a valid date`,
    "any.required": `"startTime" is required`,
  }),
  endTime: Joi.date().iso().greater(Joi.ref("startTime")).required().messages({
    "date.base": `"endTime" should be a valid date`,
    "any.required": `"endTime" is required`,
    "date.greater": `"endTime" must be later than "startTime"`,
  }),
});

/**
 * Function to validate availability slot data
 * @param data - The data to be validated
 * @returns {Object} Validation result
 */
export const validateAvailabilitySlot = (data: any) => {
  const { error, value } = availabilitySlotSchema.validate(data, {
    abortEarly: false, // Return all errors
    allowUnknown: true, // Allow unknown keys
  });

  if (error) {
    return {
      valid: false,
      errors: error.details.map((err) => err.message), // Return all error messages
    };
  }

  return { valid: true, value }; // Return validated value if valid
};
