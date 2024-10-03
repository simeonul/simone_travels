from flask.views import MethodView
from flask_smorest import Blueprint, abort
from validation.schemas import UserSchema, LoginSchema
from services.user_service import UserService
from utils.decorators import role_required

blp = Blueprint("users", __name__, description="Operations on users and authentication/authorization")


@blp.route("/register")
class UserRegister(MethodView):
    @blp.arguments(UserSchema)
    @blp.response(201, UserSchema)
    def post(self, user_data):
        try:
            user = UserService.register(user_data)
            return user
        except ValueError as e:
            abort(409, message=str(e))


@blp.route("/login")
class UserLogin(MethodView):
    @blp.arguments(LoginSchema)
    def post(self, login_data):
        try:
            access_token = UserService.login(login_data)
            return access_token
        except ValueError as e:
            abort(401, message=str(e))


@blp.route("/users")
class UsersList(MethodView):
    @role_required('Agent', 'Client')
    @blp.response(200, UserSchema(many=True))
    def get(self):
        users = UserService.get_all_users()
        return users


@blp.route("/users/<string:user_id>")
class User(MethodView):
    @role_required('Agent', 'Client')
    @blp.response(200, UserSchema)
    def get(self, user_id):
        user = UserService.get_user_by_id(user_id)
        return user

    @role_required('Agent')
    def delete(self, user_id):
        UserService.delete_user(user_id)
        return {"message": f"User with id {user_id} has been deleted"}