import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

const drivingLicenseFields = {
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

    expirationDate: Joi.date()
        .format('YYYY-MM-DD')
        .greater('now')
        .required()
        .messages({
            'date.format': 'La data di scadenza deve essere nel formato YYYY-MM-DD',
            'date.greater': 'La data di scadenza non può essere inferiore a quella attuale',
            'any.required': 'La data di scadenza è obbligatoria'
        }),

    releasedFrom: Joi.string()
        .pattern(new RegExp('^MC-[A-Z]{2}$'))
        .required()
        .messages({
            'string.pattern.base': `L'ente di rilascio deve essere nel formato MC-XX`,
            'any.required': `L'ente di rilascio è obbligatorio`
        }),
	
	A1: Joi.boolean()
		.required()
		.messages({
            'any.required': `Specificare se l'utente ha la patente A1`
        }),
	
	A2: Joi.boolean()
		.required()
		.messages({
            'any.required': `Specificare se l'utente ha la patente A2`
        }),
	
	A3: Joi.boolean()
		.required()
		.messages({
            'any.required': `Specificare se l'utente ha la patente A3`
        }),

	B: Joi.boolean()
		.required()
		.messages({
            'any.required': `Specificare se l'utente ha la patente B`
        }),
}


export const drivingLicenseSchema = Joi.object({
  ...drivingLicenseFields,
})

export const drivingLicenseUpdateSchema = Joi.object({
  ...drivingLicenseFields
}).fork(Object.keys(drivingLicenseFields), (schema) => schema.optional())

