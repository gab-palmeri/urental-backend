import { UserController } from "../controller/UserController";

export class UserRoutes
{
    //CONTROLLER UTILIZZATO NELLE ROTTE
    public static userController: UserController = new UserController();

    //DECIDO QUALE METODO DEL CONTROLLER USARE PER OGNI /PATH
    public static setRoutes(app): void
    {
        app.route('/users/auth')
            .post(this.userController.auth)
        app.route('/users/register')
            .post(this.userController.create)
        app.route('/users/activate')
            .get(this.userController.activate)
        app.route('/users/changePin')
            .put(this.userController.changePin)
    }
}
