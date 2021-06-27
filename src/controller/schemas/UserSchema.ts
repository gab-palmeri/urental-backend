import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

export const userSchema = Joi.object({
    name: Joi.string()
        .pattern(new RegExp('^[A-Za-z]{2,}([ ][A-Za-z]{2,})*$'))
        .min(3)
        .max(20)
        .required()
        .messages({
            'string.pattern.base': 'Inserire un nome valido',
            'string.min': 'Il nome deve essere di almeno 3 caratteri',
            'string.max': 'Il nome non può eccedere i 20 caratteri',
            'any.required': 'Il nome è obbligatorio'
        }),

    surname: Joi.string()
        .pattern(new RegExp('^[A-Z][a-z]+([ ][A-Z][a-z]+)*$'))
        .min(3)
        .max(20)
        .required()
        .messages({
            'string.pattern.base': 'Inserire un cognome valido',
            'string.min': 'Il cognome deve essere di almeno 3 caratteri',
            'string.max': 'Il cognome non può eccedere i 20 caratteri',
            'any.required': 'Il cognome è obbligatorio'
        }),

    fiscalCode: Joi.string()
        .alphanum()
        .length(16)
        .required()
        .messages({
            'string.length': 'Il codice fiscale deve essere composto da 16 caratteri',
            'any.required': 'Il codice fiscale è obbligatorio'
        }),

    birthDate: Joi.date()
        .format('YYYY-MM-DD')
        .less('now')
        .required()
        .messages({
            'date.format': 'La data di nascita deve essere nel formato YYYY-MM-DD',
            'date.less': 'La data di nascita non può essere superiore a quella attuale',
            'any.required': 'La data di nascita è obbligatoria'
        }),

    birthPlace: Joi.string()
        .pattern(new RegExp('^[A-Z][a-z]{2,}([ ][A-Z][a-z]{2,})*$'))
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.pattern.base': 'Inserire un luogo di nascita valido',
            'string.min': 'Il luogo di nascita deve essere di almeno 3 caratteri',
            'string.max': 'Il luogo di nascita non può eccedere i 30 caratteri',
            'any.required': 'Il luogo di nascita è obbligatorio'
        }),

    password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'))
        .required()
        .messages({
            'string.pattern.base': 'La password deve contenere almeno 8 caratteri di cui almeno una maiuscola e minuscola, un numero e un carattere speciale',
            'any.required': 'La password è obbligatoria'
        }),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'it'] } })
        .required()
        .messages({
            'string.email': `L'email non è in un formato valido`,
            'any.required': `L'email è obbligatoria`
        }),
    pin: Joi.string()
        .pattern(new RegExp('[0-9]{4}'))
        .required()
        .messages({
            'string.pattern.base': `Il pin deve essere di 4 cifre`,
            'any.required': `Il pin è obbligatorio`
        })
});
