import { StatusController } from "../controller/StatusController";

export class StatusRoutes{

    public static statusController: StatusController = new StatusController();

    public static setRoutes(app, JWT_MIDDLEWARE): void{

        app.route("/status")
            .post(JWT_MIDDLEWARE, this.statusController.editOrCreate)

    }
}