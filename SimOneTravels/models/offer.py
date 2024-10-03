from sqlalchemy.dialects.postgresql import UUID
from repository.db import db
import uuid


class OfferModel(db.Model):
    __tablename__ = 'offers'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = db.Column(db.String(100), unique=False, nullable=False)
    discount_percentage = db.Column(db.Integer, unique=False, nullable=False)
    valid_from = db.Column(db.Date, unique=False, nullable=False)
    valid_to = db.Column(db.Date, unique=False, nullable=False)
    destination_id = db.Column(db.UUID, db.ForeignKey("destinations.id"), unique=False, nullable=False)
    destination = db.relationship("DestinationModel", back_populates="offers")
