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


    mainImage: Joi.string()
        .required()
        .messages({
            "any.required" : "Il main_image è obbligatorio"
        }),


    photos: Joi.array()
        .items(
            Joi.string()
                .messages({
                    "string.base" : "URL devono essere delle stringhe"
                })
        )
        .min(2)
        .required()
        .messages({
            "array.min" : "photos devono essere almeno 2",
            "any.required" : "photos è obbligatorio"
        })
})