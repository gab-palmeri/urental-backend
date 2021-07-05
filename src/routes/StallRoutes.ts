import { StallController } from "../controller/StallController";

import jwt from "express-jwt";
import fs from 'fs';

export class StallRoutes {

    public static stallController: StallController = new StallController();

    public static setRoutes(app): void{

		const RSA_PUBLIC_KEY = fs.readFileSync('./keys/public.key');

        app.route("/stalls")
            .get(this.stallController.getStalls)
			.post(jwt({secret: RSA_PUBLIC_KEY, algorithms: ["RS256"]}), this.stallController.createStall)

    }
}