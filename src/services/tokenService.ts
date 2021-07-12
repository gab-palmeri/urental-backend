import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import {jwtSettings} from "../jwtsettings";

export function decodeToken(token:any) {

	let publicKEY;

	try{
		publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');
		return {httpError: undefined, token: jwt.verify(token, publicKEY)};
	}catch(error){
		return {httpError: {code: 500, message: "Errore interno al server"}, token: undefined};
	}
}

export function getTokenUser(userID){

	let privateKEY;

	try {
		privateKEY = fs.readFileSync("./keys/private.key", "utf-8");

		return {httpError: undefined, token: jwt.sign({
				"id": userID,
				'role': 0
			}, privateKEY, jwtSettings)};

	} catch (error) {
		return {httpError: {code: 500, message: "Errore interno al server"}, token: undefined};
	}
}

export function getTokenDriver(driverID){
	let privateKEY;

	try {
		privateKEY = fs.readFileSync("./keys/private.key", "utf-8");

		return {httpError: undefined, token: jwt.sign({
				"id": driverID,
				'role': 1
			}, privateKEY, jwtSettings)};

	} catch (error) {
		return {httpError: {code: 500, message: "Errore interno al server"}, token: undefined};
	}
}

export function getTokenStaff(staffID){
	let privateKEY;

	try {
		privateKEY = fs.readFileSync("./keys/private.key", "utf-8");

		return {httpError: undefined, token: jwt.sign({
				"id": staffID,
				'role': 2
			}, privateKEY, jwtSettings)};

	} catch (error) {
		return {httpError: {code: 500, message: "Errore interno al server"}, token: undefined};
	}
}

export function getIDBy(token:any) {

	let value = decodeToken(token);

	try{
		return {httpError: undefined, id: value.token["id"]};
	}catch (error){
		return {httpError: {code: 500, message: "Errore interno al server"}, id: undefined};
	}

}

export function isStaff(token:any) {

	let value = decodeToken(token);

	try{
		return {httpError: undefined, isStaff: (value.token["role"] == 2)}
	}catch (error){
		return {httpError: {code: 500, message: "Errore interno al server"}, isStaff: undefined};
	}
}
