import { StallController } from "../controller/StallController";

export class StallRoutes {

    public static stallController: StallController = new StallController();

    public static setRoutes(app): void{

        app.route("/stalls")
            .get(this.stallController.getStalls)
			.post(this.stallController.createStall)
    }
}