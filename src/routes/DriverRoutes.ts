import { DriverController } from "../controller/DriverController";

export class DriverRoutes{

    public static staffController: DriverController = new DriverController();

    public static setRoutes(app): void{

        app.route("/drivers/auth")
            .post(this.staffController.auth)
    }
}
