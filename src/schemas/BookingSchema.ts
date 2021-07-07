import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

export const bookingSchema = Joi.object({

    pickUpDateTime: Joi.date()
		.utc()
		.min('now')
        .messages({
            'date.base': 'La data di ritiro non è valida',
			'date.min': 'La data di ritiro deve essere almeno quella odierna',
            'any.required': 'La data di ritiro è obbligatoria'
        }),

	deliveryDateTime: Joi.date()
		.utc()
		.min('now')
		.messages({
            'date.base': 'La data di consegna non è valida',
			'date.min': 'La data di consegna deve essere almeno quella odierna',
            'any.required': 'La data di consegna è obbligatoria'
        }),
	
	pickUpStall: Joi.number()
		.messages({
			'number.base': "L'ID dello stallo di ritiro deve essere un numero valido",
			'any.required': 'La carta di credito è obbligatorio'
		}),

	deliveryStall: Joi.number()
		.messages({
			'number.base': "L'ID dello stallo di consegna deve essere un numero valido",
			'any.required': 'La carta di credito è obbligatorio'
		}),

    driver: Joi.boolean()
		.required()
		.messages({
			'boolean.base': "Specificare la presenza o assenza dell'autista",
			'any.required': "Specificare la presenza o assenza dell'autista"
		}),

	serialNumber: Joi.string()
        .max(16)
        .required()
        .messages({
            "string.max" : "Il serialNumber non può eccedere i 16 caratteri",
            "any.required": "Il serialNumber è obbligatorio"
        }),

	total: Joi.number()
		.required()
		.messages({
			'number.base': "Il totale deve essere un numero valido",
			'any.required': 'Il totale è obbligatorio'
		}),
});	