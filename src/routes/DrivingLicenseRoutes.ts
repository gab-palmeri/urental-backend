import { DrivingLicenseController } from "../controller/DrivingLicenseController";

export class DrivingLicenseRoutes{

    public static drivingLicenseController: DrivingLicenseController = new DrivingLicenseController();

    public static setRoutes(app): void{

        app.route("/driving-license")
            .post(this.drivingLicenseController.editOrCreate)
			.delete(this.drivingLicenseController.delete)

    }
}