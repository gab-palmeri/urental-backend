import { UserRoutes } from "./routes/UserRoutes";
import { VehicleRoutes } from "./routes/VehicleRoutes";
import { StaffRoutes } from "./routes/StaffRoutes";
import { DriverRoutes } from "./routes/DriverRoutes";
import { DrivingLicenseRoutes } from "./routes/DrivingLicenseRoutes";
import { StallRoutes } from "./routes/StallRoutes";

export class Router
{
    public setRoutes(app): void
    {
        UserRoutes.setRoutes(app);
        VehicleRoutes.setRoutes(app);
        StaffRoutes.setRoutes(app);
        DriverRoutes.setRoutes(app);
		DrivingLicenseRoutes.setRoutes(app);
		StallRoutes.setRoutes(app);
    }
}
