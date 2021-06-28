import { VehicleController } from "../controller/VehicleController";

export class VehicleRoutes
{
    //CONTROLLER UTILIZZATO NELLE ROTTE
    public static vehicleController: VehicleController = new VehicleController();

    //DECIDO QUALE METODO DEL CONTROLLER USARE PER OGNI /PATH
    public static setRoutes(app): void
    {
        app.route('/vehicles/preview')
            .get(this.vehicleController.getPreview)

        app.route('/vehicles/cars')
            .get(this.vehicleController.getCars)
        app.route('/vehicles/motorbikes')
            .get(this.vehicleController.getMotorbikes)
        app.route('/vehicles/bikes')
            .get(this.vehicleController.getBikes)
        app.route('/vehicles/scooters')
            .get(this.vehicleController.getScooters)
    }
}
