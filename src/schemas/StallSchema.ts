import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

export const stallSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.min': 'Il nome deve essere di almeno 3 caratteri',
            'string.max': 'Il nome non può eccedere i 100 caratteri',
            'string.empty': 'Il nome non può essere vuoto',
            'any.required': 'Il nome è obbligatorio'
        }),

    address: Joi.string()
        .alphanum()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.min': 'Il cognome deve essere di almeno 3 caratteri',
            'string.max': 'Il cognome non può eccedere i 50 caratteri',
            'string.empty': 'Il cognome non può essere vuoto',
            'any.required': 'Il cognome è obbligatorio'
        }),
	city: Joi.string()
		.pattern(new RegExp('^[A-Za-z]{3,}([ ][A-Za-z]{3,})*$'))
		.min(3)
		.max(30)
		.required()
		.messages({
			'string.pattern.base': 'Inserire una città valida',
			'string.min': 'Il cognome deve essere di almeno 3 caratteri',
			'string.max': 'Il cognome non può eccedere i 50 caratteri',
			'string.empty': 'Il cognome non può essere vuoto',
			'any.required': 'Il cognome è obbligatorio'
		}),
	latitude: Joi.string()
		.max(10)
		.required()
		.messages({
			'string.min': 'La latitudine può essere composta da massimo 10 caratteri',
			'string.empty': 'La latitudine non può essere vuota',
			'any.required': 'La latitudine è obbligatoria'
		}),
	longitude: Joi.string()
		.max(11)
		.required()
		.messages({
			'string.max': 'La longitudine può essere composta da massimo 11 caratteri',
			'string.empty': 'La latitudine non può essere vuota',
			'any.required': 'La latitudine è obbligatoria'
		}),

});
