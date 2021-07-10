import Joi from "joi";

export const gasCarSchema = Joi.object({

    features: Joi.object().required().keys({

        licensePlate: Joi.string()
            .pattern(new RegExp("^[A-Z]{2}[0-9]{3}[A-Z]{2}$"))
            .max(20)
            .required()
            .messages({
                'string.pattern.base': 'Inserire una targa valida',
                "string.max" : "La licensePlate non può eccedere i 20 caratteri",
                "any.required" : "La licensePlate è obbligatoria"
            }),

        displacement: Joi.number()
            .required()
            .messages({
                "any.required" : "Il displacement è obbligatorio"
            }),

        kilowatt: Joi.number()
            .required()
            .messages({
                "any.required" : "Il kilowatt è obbligatorio"
            }),

        seats: Joi.number()
            .required()
            .messages({
                "any.required" : "Il seats è obbligatorio"
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

        trunkSize: Joi.string()
            .max(10)
            .required()
            .messages({
                "string.max" : "La trunkSize non può eccedere i 10 caratteri",
                "any.required" : "La trunkSize è obbligatoria"
            }),

        shift: Joi.number()
            .min(0)
            .max(1)
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