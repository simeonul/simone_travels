import uuid
from sqlalchemy.exc import IntegrityError, DataError
from models import DescriptionModel
from repository.db import db


class DescriptionService:
    @staticmethod
    def get_all_descriptions():
        return DescriptionModel.query.all()

    @staticmethod
    def create_description(description_data):
        description = DescriptionModel(**description_data)
        try:
            db.session.add(description)
            db.session.commit()
        except IntegrityError:
            raise ValueError(
                f"Description for destination with id {description_data['destination_id']} already exists.")
        except DataError:
            raise ValueError("Payload contains invalid values.")
        return description

    @staticmethod
    def get_description_by_id(description_id):
        return DescriptionModel.query.get_or_404(uuid.UUID(description_id))

    @staticmethod
    def get_description_by_destination_id(destination_id):
        return DescriptionModel.query.filter_by(destination_id=destination_id).first_or_404()

    @staticmethod
    def update_description(description_data, description_id):
        description = DescriptionModel.query.get_or_404(uuid.UUID(description_id))
        description.type = description_data["type"]
        description.board_options = description_data["board_options"]
        description.room_type = description_data["room_type"]
        description.transport = description_data["transport"]
        try:
            db.session.add(description)
            db.session.commit()
        except IntegrityError:
            raise ValueError(
                f"Description for destination with id {description_data['destination_id']} already exists."
            )
        except DataError:
            raise ValueError("Payload contains invalid values.")
        return description
