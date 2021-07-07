import multer from "multer";
import createHttpError from "http-errors";

import * as fs from "fs";

import { promisify } from "util";
import stream from "stream";

import { StaffController } from "../controller/StaffController";

export class StaffRoutes{

    public static staffController: StaffController = new StaffController();

    public static setRoutes(app, JWT_MIDDLEWARE): void{

        app.route("/staffs/auth")
            .post(this.staffController.auth)

        app.route("/staffs/register")
            .post(JWT_MIDDLEWARE, this.staffController.create)

        app.route("/staffs/createDriver")
            .post(JWT_MIDDLEWARE, this.staffController.createDriver)

        addNewVehicleRoute(app, StaffRoutes.staffController, JWT_MIDDLEWARE);
    }
}

let addNewVehicleRoute = (app, staffController, JWT_MIDDLEWARE) => {

    const upload = multer().fields([
        { name: "mainImage"},
        { name: "photos"}
    ]);
    const pipeline = promisify(stream.pipeline);

    app.post("/staffs/addNewVehicle", JWT_MIDDLEWARE, upload, validationPhoto, generationDirPath, staffController.addNewVehicle, async (req, res, next) => {

        if(!["4", "5"].includes(req.body.type) && !fs.existsSync(res.locals.dirPath)){

            fs.mkdirSync(res.locals.dirPath, { recursive: true});

            await pipeline(
                req.files.mainImage[0].stream,
                fs.createWriteStream(res.locals.destionationPaths[0])
            )

            await pipeline(
                req.files.photos[0].stream,
                fs.createWriteStream(res.locals.destionationPaths[1])
            )

            await pipeline(
                req.files.photos[1].stream,
                fs.createWriteStream(res.locals.destionationPaths[2])
            )
        }

        res.status(200).send();
    })
}

let validationPhoto = function(req, res, next){

    console.log(req.files);

    if(["4", "5"].includes(req.body.type))
        next();
    else{
        if(req.files.mainImage.length == 0)
            return next(createHttpError(400, "la mainImage è obbligatoria"));

        if(req.files.mainImage.length != 1)
            return next(createHttpError(400, "la mainImage deve essere solo una"));

        if(req.files.photos.length == 0)
            return next(createHttpError(400, "photos sono obbligatorie"));

        if(req.files.photos.length != 2)
            return next(createHttpError(400, "photos devono essere 2"));

        next();
    }
}

let generationDirPath = function(req, res, next){

    if(["4", "5"].includes(req.body.type))
        next();
    else{
        res.locals.destionationPaths = [
            "." + req.files.mainImage[0].originalName.split(".")[1],
            "." + req.files.photos[0].originalName.split(".")[1],
            "." + req.files.photos[1].originalName.split(".")[1]
        ];

        next();
    }
}