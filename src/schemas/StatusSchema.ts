import Joi from "joi";


export const statusSchema = Joi.object({

    description: Joi.string()
        .required()
        .messages({
            "any.required": "La description è obbligatoria"
        }),

    /*staffPickup: Joi.number()
        .required()
        .messages({
            "any.required": "Lo staffPickup è obbligatorio"
        }),

    staffDelivery: Joi.number()*/
})

export const statusUpdateSchema = Joi.object({

    description: Joi.string(),

    /*staffPickup: Joi.number(),

    staffDelivery: Joi.number()
        .required()
        .messages({
            "any.required": "Lo staffDelivery è obbligatorio"
        }),*/
});