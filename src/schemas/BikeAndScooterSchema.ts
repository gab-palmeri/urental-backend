import Joi from "joi";

export const bikeAndScooterSchema = Joi.object({

    features: Joi.object().required().keys({

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