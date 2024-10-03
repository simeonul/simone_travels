import uuid
from datetime import timedelta

from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from models import UserModel
from repository.db import db
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import create_access_token

class UserService:
    @staticmethod
    def register(user_data):
        user = UserModel(
            role=user_data["role"][:1].upper() + user_data["role"][1:].lower(),
            full_name=user_data["full_name"],
            email=user_data["email"],
            password=pbkdf2_sha256.hash(user_data["password"])
        )
        try:
            db.session.add(user)
            db.session.commit()
        except IntegrityError:
            raise ValueError(f"User with email {user_data['email']} is already registered.")
        except SQLAlchemyError:
            raise ValueError(f"Invalid value in payload.")
        return user


    @staticmethod
    def login(login_data):
        user = UserModel.query.filter(
            UserModel.email == login_data["email"]
        ).first()

        if user and pbkdf2_sha256.verify(login_data["password"], user.password):
            additional_claims = {
                'role': user.role,
                'email': user.email
            }
            access_token = create_access_token(identity=user.id, additional_claims=additional_claims, expires_delta=timedelta(hours=1))
            return {"access_token": access_token}

        raise ValueError(f"Invalid credentials.")



    @staticmethod
    def get_all_users():
        return UserModel.query.all()

    @staticmethod
    def get_user_by_id(user_id):
        return UserModel.query.get_or_404(uuid.UUID(user_id))

    @staticmethod
    def delete_user(user_id):
        destination = UserModel.query.get_or_404(user_id)
        db.session.delete(destination)
        db.session.commit()