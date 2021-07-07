import { BookingController } from "../controller/BookingController";

export class BookingRoutes{

    public static bookingController: BookingController = new BookingController();

    public static setRoutes(app, JWT_MIDDLEWARE): void{

        app.route("/booking/availability")
            .get(JWT_MIDDLEWARE, this.bookingController.checkAvailability)
		
		app.route("/booking")
			.post(JWT_MIDDLEWARE, this.bookingController.createBooking)
    }
}