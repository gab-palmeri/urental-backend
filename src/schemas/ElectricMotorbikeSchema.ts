import Joi from "joi";

export const electricMotorbikeSchema = Joi.object({

    features: Joi.object().required().keys({

        licensePlate: Joi.string()
            .pattern(new RegExp("^[A-Z]{2}[0-9]{5}$"))
            .max(20)
            .required()
            .messages({
                'string.pattern.base': 'Inserire una targa valida',
                "string.max" : "La licensePlate non può eccedere i 20 caratteri",
                "any.required" : "La licensePlate è obbligatoria"
            }),

        kilowatt: Joi.number()
            .required()
            .messages({
                "any.required" : "Il kilowatt è obbligatorio"
            }),

        category: Joi.string()
            .max(20)
            .required()
            .messages({
                "string.max" : "La category non può eccedere i 20 caratteri",
                "any.required" : "La category è obbligatoria"
            }),

        consumption: Joi.string()
            .max(20)
            .required()
            .messages({
                "string.max" : "La consumption non può eccedere i 20 caratteri",
                "any.required" : "La consumption è obbligatoria"
            }),

        batteryCapacity: Joi.string()
            .max(10)
            .required()
            .messages({
                "string.max" : "La batteryCapacity non può eccedere i 10 caratteri",
                "any.required" : "La batteryCapacity è obbligatoria"
            }),

        chargeDuration: Joi.string()
            .max(3)
            .required()
            .messages({
                "string.max" : "La chargeDuration non può eccedere i 3 caratteri",
                "any.required" : "La chargeDuration è obbligatoria"
            }),


    }).messages({
        "any.required" : "Le features sono obbligatorie"
    }),
})