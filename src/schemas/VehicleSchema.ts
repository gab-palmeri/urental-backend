import Joi from "joi";

export const vehicleSchema = Joi.object({

    brand: Joi.string()
        .max(20)
        .required()
        .messages({
           "string.max" : "Il brand non può eccedere i 20 caratteri",
           "any.required": "Il brand è obbligatorio"
        }),

    model: Joi.string()
        .max(20)
        .required()
        .messages({
            "string.max" : "Il model non può eccedere i 20 caratteri",
            "any.required": "Il model è obbligatorio"
        }),


    serialNumber: Joi.string()
        .max(16)
        .required()
        .messages({
            "string.max" : "Il serialNumber non può eccedere i 16 caratteri",
            "any.required": "Il serialNumber è obbligatorio"
        }),


    type: Joi.number()
        .min(0)
        .max(5)
        .required()
        .messages({
            "number.min" : "Il type non può essere minore di 0",
            "number.max" : "Il type non può essere maggiore di 5",
            "any.required": "Il type è obbligatorio"
        }),


    main_image: Joi.string()
        .max(32)
        .required()
        .messages({
            "string.max" : "Il main_image non può eccedere i 32 caratteri",
            "any.required" : "Il main_image è obbligatorio"
        }),
})