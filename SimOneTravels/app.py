import os

from flask import Flask, jsonify
from flask_smorest import Api
from controllers.description import blp as DescriptionBlueprint
from controllers.destination import blp as DestinationBlueprint
from controllers.offer import blp as OfferBlueprint
from controllers.booking import blp as BookingBlueprint
from controllers.user import blp as UserBlueprint
from repository.db import db
from flask_jwt_extended import JWTManager
from flask_cors import CORS


def create_app(db_url=None):
    app = Flask(__name__)
    CORS(app)

    app.config["PROPAGATE_EXCEPTIONS"] = True
    app.config["API_TITLE"] = "SimOne Travel Agency REST API"
    app.config["API_VERSION"] = "v1.0"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url or os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost/daw")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)

    api = Api(app)

    app.config["JWT_SECRET_KEY"] = "simeonul"
    jwt = JWTManager(app)

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return (
            jsonify(
                {"message": "Token signature validation failed.",
                 "error": "invalid_token"}
            ),
            401
        )

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return (
            jsonify(
                {"message": "Request does not contain an access token.",
                 "error": "authorization_required"}
            ),
            401
        )

    with app.app_context():
        db.create_all()

    api.register_blueprint(DescriptionBlueprint)
    api.register_blueprint(DestinationBlueprint)
    api.register_blueprint(OfferBlueprint)
    api.register_blueprint(BookingBlueprint)
    api.register_blueprint(UserBlueprint)

    return app
