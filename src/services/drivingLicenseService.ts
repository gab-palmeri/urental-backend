import { User } from "../entity/User";
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

	} catch (error) {
		return {code:500, message:"Errore interno al server"};
	}

}

export async function deleteLicense(userId:number){

	try{
		
		await getRepository(DrivingLicense).delete({"user":userId})

	} catch (error) {
		return {code:500, message:"Errore interno al server"};
	}

}