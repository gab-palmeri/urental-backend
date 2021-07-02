import { StaffController } from "../controller/StaffController";

export class StaffRoutes{

    public static staffController: StaffController = new StaffController();

    public static setRoutes(app): void{

        app.route("/staffs/auth")
            .post(this.staffController.auth)

        app.route("/staffs/register")
            .post(this.staffController.create)

        app.route("/staffs/createDriver")
            .post(this.staffController.createDriver)

        app.route("/staffs/addNewVehicle")
            .post(this.staffController.addNewVehicle);
    }
}