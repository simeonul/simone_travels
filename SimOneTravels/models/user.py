from sqlalchemy.dialects.postgresql import UUID
from repository.db import db
import uuid
from sqlalchemy import Enum


class UserModel(db.Model):
    __tablename__ = 'users'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role = db.Column(Enum('Client', 'Agent', name = 'user_role_enum'), unique=False, nullable=False)
    full_name = db.Column(db.String(100), unique=False, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), unique=False, nullable=False)
