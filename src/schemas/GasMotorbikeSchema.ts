import Joi from "joi";

export const gasMotorbikeSchema = Joi.object({

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

        capacity: Joi.number()
            .required()
            .messages({
                "any.required" : "La capacity è obbligatorio"
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

        shift: Joi.boolean()
            .required()
            .messages({
                "any.required" : "La shift è obbligatoria"
            }),

        euro: Joi.number()
            .required()
            .messages({
                "any.required" : "L'euro è obbligatorio"
            }),

        fuel: Joi.string()
            .max(16)
            .required()
            .messages({
                "string.max" : "La fuel non può eccedere i 16 caratteri",
                "any.required" : "La fuel è obbligatoria"
            }),


    }).messages({
        "any.required" : "Le features sono obbligatorie"
    }),
})