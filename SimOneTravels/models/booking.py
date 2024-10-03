from sqlalchemy.dialects.postgresql import UUID
from repository.db import db
import uuid


class BookingModel(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    creation_date = db.Column(db.Date, unique=False, nullable=False)
    start_date = db.Column(db.Date, unique=False, nullable=False)
    end_date = db.Column(db.Date, unique=False, nullable=False)
    total_cost = db.Column(db.Float, unique=False, nullable=False)
    destination_id = db.Column(db.UUID, db.ForeignKey("destinations.id"), unique=False, nullable=False)
    destination = db.relationship("DestinationModel", back_populates="bookings")
    email = db.Column(db.String, unique=False, nullable=False)
