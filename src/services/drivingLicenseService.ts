import { getRepository } from "typeorm";
import { DrivingLicense } from "../entity/DrivingLicense";

export async function editOrCreate(userId:number,licensePayload:any){

	try{
		var drivingLicense = await getRepository(DrivingLicense).findOne({'where': {'user': userId}})

		if(drivingLicense == undefined)
		{
			drivingLicense = new DrivingLicense();
			drivingLicense.user = userId;
		}

		Object.keys(licensePayload).map(function(k){
			drivingLicense[k] = licensePayload[k]
		});

		await getRepository(DrivingLicense).save(drivingLicense);
		return {httpError: undefined};

	} catch (error) {
		return {httpError: {code:500, message:"Errore interno al server"}};
	}

}

export async function deleteLicense(userId:number){

	try{
		
		await getRepository(DrivingLicense).delete({"user":userId})
		return {httpError: undefined};

	} catch (error) {
		return {httpError: {code:500, message:"Errore interno al server"}};
	}

}