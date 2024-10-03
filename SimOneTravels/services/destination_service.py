import uuid
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from models import DestinationModel
from repository.db import db


class DestinationService:
    @staticmethod
    def get_all_destinations():
        return DestinationModel.query.all()

    @staticmethod
    def create_destination(destination_data):
        destination = DestinationModel(**destination_data)
        try:
            db.session.add(destination)
            db.session.commit()
        except IntegrityError:
            raise ValueError(f"Destination with title {destination_data['title']} already exists.")
        except SQLAlchemyError:
            raise ValueError("An error occurred while inserting the destination.")
        return destination

    @staticmethod
    def get_destination_by_id(destination_id):
        return DestinationModel.query.get_or_404(uuid.UUID(destination_id))

    @staticmethod
    def delete_destination(destination_id):
        destination = DestinationModel.query.get_or_404(destination_id)
        db.session.delete(destination)
        db.session.commit()

    @staticmethod
    def update_destination(destination_data, destination_id):
        destination = DestinationModel.query.get_or_404(uuid.UUID(destination_id))
        destination.title = destination_data["title"]
        destination.location = destination_data["location"]
        destination.nightly_rate = destination_data["nightly_rate"]
        destination.capacity = destination_data["capacity"]
        try:
            db.session.add(destination)
            db.session.commit()
        except IntegrityError:
            raise ValueError(f"Destination with title {destination_data['title']} already exists.")
        except SQLAlchemyError:
            raise ValueError("An error occurred while updating the destination.")
        return destination

    @staticmethod
    def get_destinations_with_offers():
        destinations = DestinationModel.query.filter(DestinationModel.offers.any()).all()
        return destinations

    @staticmethod
    def get_filtered_destinations(query_string):
        pattern = f"%{query_string}%"
        destinations = DestinationModel.query.filter(
            (DestinationModel.title.ilike(pattern)) |
            (DestinationModel.location.ilike(pattern))
        ).all()
        return destinations
