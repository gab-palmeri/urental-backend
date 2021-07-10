import Joi from "joi";


export const statusSchema = Joi.object({

    description: Joi.string()
        .required()
        .messages({
            "any.required": "La description è obbligatoria"
        }),
})

export const statusUpdateSchema = Joi.object({

    description: Joi.string(),

});