import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import {jwtSettings} from "../jwtsettings";

export function decodeToken(token:any) {

	var publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');
	return jwt.verify(token, publicKEY);
}

export function getTokenUser(userID){

	let privateKEY;

	try {
		privateKEY = fs.readFileSync("./keys/private.key", "utf-8");
	} catch (error) {
		return {httpError: {code: 500, message: "Errore interno al server"}, token: undefined};
	}

	return {httpError: undefined, token: jwt.sign({
			"id": userID,
			'role': 0
		}, privateKEY, jwtSettings)};
}

export function getTokenDriver(driverID){
	let privateKEY;

	try {
		privateKEY = fs.readFileSync("./keys/private.key", "utf-8");
	} catch (error) {
		return {httpError: {code: 500, message: "Errore interno al server"}, token: undefined};
	}

	return {httpError: undefined, token: jwt.sign({
			"id": driverID,
			'role': 1
		}, privateKEY, jwtSettings)};
}

export function getTokenStaff(staffID){
	let privateKEY;

	try {
		privateKEY = fs.readFileSync("./keys/private.key", "utf-8");
	} catch (error) {
		return {httpError: {code: 500, message: "Errore interno al server"}, token: undefined};
	}

	return {httpError: undefined, token: jwt.sign({
			"id": staffID,
			'role': 2
		}, privateKEY, jwtSettings)};
}

export function getIDBy(token:any) {
	return decodeToken(token)["id"]
}

export function isStaff(token:any) {

	var publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');
	const decoded = jwt.verify(token, publicKEY);

	return decoded['role'] == 2;
}

export function isUser(token:any) {

	var publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');
	const decoded = jwt.verify(token, publicKEY);

	return decoded['role'] == 0;
}
