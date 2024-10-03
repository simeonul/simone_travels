from sqlalchemy.dialects.postgresql import UUID
from repository.db import db
import uuid
from sqlalchemy import Enum


class DescriptionModel(db.Model):
    __tablename__ = 'descriptions'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = db.Column(db.String(100), unique=False, nullable=False)
    board_options = db.Column(Enum('All Inclusive', 'Half Board', 'Bed & Breakfast', 'Self Catering', 'Room Only',
                                   name='board_options_enum'), unique=False, nullable=False)
    rating = db.Column(db.Float(precision=1), unique=False, nullable=True)
    room_type = db.Column(Enum('Double Room', 'Twin Room', 'Single Room', 'Cabin', 'Penthouse', 'Family Room', 'Triple Room',
                               name='room_type_enum'), unique=False, nullable=False)
    transport = db.Column(Enum('Airplane', 'Bus', 'Not Included',
                               name='transport_enum'), unique=False, nullable=False)
    destination_id = db.Column(db.UUID, db.ForeignKey("destinations.id"), unique=True, nullable=False)
    destination = db.relationship("DestinationModel", back_populates="description")
