import { BookingController } from "../controller/BookingController";

export class BookingRoutes{

    public static bookingController: BookingController = new BookingController();

    public static setRoutes(app): void{

        app.route("/booking/availability")
            .get(this.bookingController.checkAvailability)
    }
}