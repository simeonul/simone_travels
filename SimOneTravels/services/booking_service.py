import uuid
from sqlalchemy.exc import DataError
from models.booking import BookingModel
from repository.db import db


class BookingService:
    @staticmethod
    def get_all_bookings():
        return BookingModel.query.all()

    @staticmethod
    def create_booking(booking_data):
        booking = BookingModel(**booking_data)
        try:
            db.session.add(booking)
            db.session.commit()
        except DataError:
            raise ValueError("Payload contains invalid values.")
        return booking

    @staticmethod
    def get_bookings_by_destination_id(destination_id):
        return BookingModel.query.filter_by(destination_id=destination_id).all()
