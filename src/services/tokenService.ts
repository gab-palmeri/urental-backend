import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

export function decodeToken(token:any) {

	var publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');
	return jwt.verify(token, publicKEY);

}

export function getIDBy(token:any) {

	return decodeToken['id'];

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
