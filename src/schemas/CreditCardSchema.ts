import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

export const creditCardSchema = Joi.object({
    cardNumber: Joi.string()
        .creditCard()
        .required()
        .messages({
            'string.creditCard': 'La carta di credito è invalida',
            'any.required': 'La carta di credito è obbligatoria'
        }),

    expirationDate: Joi.date()
        .format('MM/YY')
		.greater('now')
        .required()
        .messages({
			'date.base': "Inserire una data di scadenza valida",
            'date.format': 'La data di scadenza deve essere nel formato MM/YY',
			'date.greater': 'La carta di credito è scaduta',
            'any.required': 'La data di scadenza è obbligatoria'
        }),

    cvv: Joi.string()
        .pattern(new RegExp('^[0-9]{3}$'))
        .required()
        .messages({
            'string.pattern.base': 'Il CVV deve essere composto da tre cifre',
            'string.empty': 'Il CVV non può essere vuoto',
            'any.required': 'Il CVV è obbligatorio'
        }),
});	