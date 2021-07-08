import { DrivingLicenseController } from "../controller/DrivingLicenseController";

export class DrivingLicenseRoutes{

    public static drivingLicenseController: DrivingLicenseController = new DrivingLicenseController();

    public static setRoutes(app, JWT_MIDDLEWARE): void{

        app.route("/driving-license")
            .post(JWT_MIDDLEWARE, this.drivingLicenseController.editOrCreate)
			.delete(JWT_MIDDLEWARE, this.drivingLicenseController.delete)

    }
}