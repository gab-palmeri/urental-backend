import Joi from "joi";
import {Column} from "typeorm";

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

    hourlyPrice: Joi.number()
        .min(0)
        .required()
        .messages({
            "number.min" : "Il hourlyPrice non può essere minore di 0",
            "any.required": "Il hourlyPrice è obbligatorio"
        }),

    dailyPrice: Joi.number()
        .min(0)
        .required()
        .messages({
            "number.min" : "Il dailyPrice non può essere minore di 0",
            "any.required": "Il dailyPrice è obbligatorio"
        }),

    driverPrice: Joi.number()
        .min(0)
        .messages({
            "number.min" : "Il driverPrice non può essere minore di 0",
            "any.required": "Il driverPrice è obbligatorio"
        }),
})