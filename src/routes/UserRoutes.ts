import { UserController } from "../controller/UserController";

export class UserRoutes
{
    //CONTROLLER UTILIZZATO NELLE ROTTE
    public static userController: UserController = new UserController();

    //DECIDO QUALE METODO DEL CONTROLLER USARE PER OGNI /PATH
    public static setRoutes(app, JWT_MIDDLEWARE): void
    {

        app.route('/users/auth')
            .post(this.userController.auth)
        app.route('/users/register')
            .post(this.userController.create)
        app.route('/users/activate')
            .post(this.userController.activate)
        app.route('/users/changePin')
            .put(JWT_MIDDLEWARE, this.userController.changePin)
		app.route('/users/profile')
			.get(JWT_MIDDLEWARE, this.userController.getProfile)
    }
}
