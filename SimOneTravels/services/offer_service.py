import uuid
from sqlalchemy.exc import SQLAlchemyError
from models import OfferModel
from repository.db import db


class OfferService:
    @staticmethod
    def get_all_offers():
        return OfferModel.query.all()

    @staticmethod
    def create_offer(offer_data):
        offer = OfferModel(**offer_data)
        try:
            db.session.add(offer)
            db.session.commit()
        except SQLAlchemyError:
            raise ValueError(f"An error occured while inserting the offer.")
        return offer

    @staticmethod
    def get_offer_by_id(offer_id):
        return OfferModel.query.get_or_404(uuid.UUID(offer_id))

    @staticmethod
    def get_offers_by_destination_id(destination_id):
        return OfferModel.query.filter_by(destination_id=destination_id).all()

    @staticmethod
    def delete_offer(offer_id):
        offer = OfferModel.query.get_or_404(offer_id)
        db.session.delete(offer)
        db.session.commit()

    @staticmethod
    def update_offer(offer_data, offer_id):
        offer = OfferModel.query.get_or_404(uuid.UUID(offer_id))
        offer.title = offer_data["title"]
        offer.discount_percentage = offer_data["discount_percentage"]
        offer.valid_from = offer_data["valid_from"]
        offer.valid_to = offer_data["valid_to"]
        try:
            db.session.add(offer)
            db.session.commit()
        except SQLAlchemyError:
            raise ValueError(f"An error occured while updating the offer.")
        return offer
