import { DriverController } from "../controller/DriverController";

export class DriverRoutes{

    public static driverController: DriverController = new DriverController();

    public static setRoutes(app, JWT_MIDDLEWARE): void{

        app.route("/drivers/auth")
            .post(this.driverController.auth)

		app.route("/drivers")
            .post(JWT_MIDDLEWARE, this.driverController.create)
    }
}
