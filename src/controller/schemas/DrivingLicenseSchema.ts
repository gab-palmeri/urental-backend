import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

export const drivingLicenseSchema = Joi.object({
    licenseNumber: Joi.string()
        .alphanum()
        .length(10)
        .required()
        .messages({
            'string.length': 'Il numero della patente deve essere di 10 caratteri',
            'any.required': 'Il numero della patente è obbligatorio'
        }),

    releaseDate: Joi.date()
        .format('YYYY-MM-DD')
        .less('now')
        .required()
        .messages({
            'date.format': 'La data di rilascio deve essere nel formato YYYY-MM-DD',
            'date.less': 'La data di rilascio non può essere superiore a quella attuale',
            'any.required': 'La data di rilascio è obbligatoria'
        }),

    expiryDate: Joi.date()
        .format('YYYY-MM-DD')
        .greater('now')
        .required()
        .messages({
            'date.format': 'La data di scadenza deve essere nel formato YYYY-MM-DD',
            'date.greater': 'La data di scadenza non può essere inferiore a quella attuale',
            'any.required': 'La data di scadenza è obbligatoria'
        }),

    releasedFrom: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.min': `L'ente di rilascio deve essere di almeno 3 caratteri`,
            'string.max': `L'ente di rilascio non può eccedere i 30 caratteri`,
            'any.required': `L'ente di rilascio è obbligatorio`
        }),

    licenseCategory: Joi.string()
        .alphanum()
        .max(3)
        .required()
        .messages({
            'string.max': `La categoria della patente deve essere di massimo 3 caratteri`,
            'any.required': `La categoria della patente è obbligatoria`
        }),
});
