import express, { Application, Request, Response } from "express";

import { Router } from "./router";
import { Mailer } from "./mailer";
import { createConnection } from "typeorm";
import cors from "cors";

class App {

    public app: Application;
    public router: Router = new Router();

    constructor()
    {
        //CREO IL SERVER EXPRESS
        this.app = express();

        //FACCIO LA CONNESSIONE AL DATABASE (VEDI ORMCONFIG.JSON)
        createConnection().then(() => {

            //DOPO CHE MI CONNETTO AL DATABASE, CHIAMO IL METODO CONFIG E
            //IMPOSTO LE ROTTE.
            this.config();
            this.router.setRoutes(this.app);

			Mailer.init();

            //METODO PER LA GESTIONE DEGLI ERRORI
            this.app.use(errorHandler);

        }).catch(error => console.log(error));
    }

    private config(): void
    {
        //PERMETTE DI ACCEDERE AI FILE STATICI (IMMAGINI)
        this.app.use('/public', express.static('assets'));

        //IMPOSTAZIONI SERVER: ACCETTA SIA JSON, SIA x-www-form-urlencoded
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json()) // To parse the incoming requests with JSON payloads

        //OPZIONI PER GLI ERRORI CORS
        const options:cors.CorsOptions = {
          allowedHeaders: [
              "Authorization",
              "Origin",
              "X-Requested-With",
              "Content-Type",
              "Accept",
              "Access-Control-Allow-Origin"
          ],
          credentials: true,
          methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
          origin: "*",
          preflightContinue: false
        };

        //CARICAMENTO DELLE OPZIONI CORS
        this.app.use(cors(options));
    }

}

export default new App().app;

function errorHandler(err, req, res, next)
{
    res.status(err.status).send({
        "message": err.message
    });
}
