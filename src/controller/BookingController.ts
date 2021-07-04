import { Request, Response } from "express";
import createHttpError from "http-errors";



export class BookingController{

    public async createBooking(req: Request, res: Response, next: any){

		

		//Effettua il pagamento (carta di credito)

		//Inserire gli stalli di consegna/ritiro
		//Impostare dati di consegna
		//Impostare dati di ritiro
		//Impostare ore

		//Se ha un driver, assegna un driver a questa prenotazione

    }

	public async checkAvailability(req: Request, res: Response, next: any){

		//Cerca una prenotazione per quel veicolo e per quella data e ora
		//Restituisci una risposta in base all'esito

	}
}

/* 

PAYLOAD RICHIESTA

driver: TRUE/FALSE

deliveryDate
deliveryHour

returnDate
returnHour

hours:

cardNumber
expirationDate
cvv
total

deliveryPlace
returnPlace */