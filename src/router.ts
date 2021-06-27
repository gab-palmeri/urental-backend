import { UserRoutes } from "./routes/UserRoutes";
import { VehicleRoutes } from "./routes/VehicleRoutes";

export class Router
{
    public setRoutes(app): void
    {
        UserRoutes.setRoutes(app);
        VehicleRoutes.setRoutes(app);
    }
}
