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
		})

});
