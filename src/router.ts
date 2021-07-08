import { UserRoutes } from "./routes/UserRoutes";
import { VehicleRoutes } from "./routes/VehicleRoutes";
import { StaffRoutes } from "./routes/StaffRoutes";
import { DriverRoutes } from "./routes/DriverRoutes";
import { DrivingLicenseRoutes } from "./routes/DrivingLicenseRoutes";
import { StallRoutes } from "./routes/StallRoutes";
import { BookingRoutes } from "./routes/BookingRoutes";

import jwt from "express-jwt";
import fs from 'fs';

export class Router
{
    public setRoutes(app): void
    {
		const RSA_PUBLIC_KEY = fs.readFileSync('./keys/public.key');
		const JWT_MIDDLEWARE = jwt({secret: RSA_PUBLIC_KEY, algorithms: ["RS256"]});

        UserRoutes.setRoutes(app, JWT_MIDDLEWARE);
        VehicleRoutes.setRoutes(app, JWT_MIDDLEWARE);
        StaffRoutes.setRoutes(app, JWT_MIDDLEWARE);
        DriverRoutes.setRoutes(app);
		DrivingLicenseRoutes.setRoutes(app, JWT_MIDDLEWARE);
		StallRoutes.setRoutes(app, JWT_MIDDLEWARE);
		BookingRoutes.setRoutes(app, JWT_MIDDLEWARE);
    }
}
