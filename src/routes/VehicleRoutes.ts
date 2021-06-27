import { VehicleController } from "../controller/VehicleController";

export class VehicleRoutes
{
    //CONTROLLER UTILIZZATO NELLE ROTTE
    public static vehicleController: VehicleController = new VehicleController();

    //DECIDO QUALE METODO DEL CONTROLLER USARE PER OGNI /PATH
    public static setRoutes(app): void
    {
        app.route('/vehicles')
            .get(this.vehicleController.index)

        app.route('/vehicles/:brand/:model')
            .get(this.vehicleController.ddddd)
    }
}
