import { StallController } from "../controller/StallController";

export class StallRoutes {

    public static stallController: StallController = new StallController();

    public static setRoutes(app, JWT_MIDDLEWARE): void{

        app.route("/stalls")
            .get(JWT_MIDDLEWARE, this.stallController.getStalls)
			.post(JWT_MIDDLEWARE, this.stallController.createStall)

    }
}