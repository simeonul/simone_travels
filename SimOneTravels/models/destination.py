from sqlalchemy.dialects.postgresql import UUID
from repository.db import db
import uuid


class DestinationModel(db.Model):
    __tablename__ = 'destinations'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = db.Column(db.String(100), unique=True, nullable=False)
    location = db.Column(db.String(100), unique=False, nullable=False)
    nightly_rate = db.Column(db.Float(precision=2), unique=False, nullable=False)
    capacity = db.Column(db.Integer, unique=False, nullable=False)
    offers = db.relationship("OfferModel", back_populates="destination", lazy="joined", cascade="all, delete")
    description = db.relationship("DescriptionModel", back_populates="destination", lazy="joined", cascade="all, delete", uselist=False)
    bookings = db.relationship("BookingModel", back_populates="destination", lazy="joined", cascade="all, delete")
