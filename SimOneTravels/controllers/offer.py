from flask.views import MethodView
from flask_smorest import Blueprint, abort

from services.offer_service import OfferService
from validation.schemas import OfferSchema, OfferUpdateSchema
from utils.decorators import role_required

blp = Blueprint("offers", __name__, description="Operations on the offers of the destinations")


@blp.route("/offers")
class OffersList(MethodView):
    @role_required('Agent', 'Client')
    @blp.response(200, OfferSchema(many=True))
    def get(self):
        offers = OfferService.get_all_offers()
        return offers

    @role_required('Agent')
    @blp.arguments(OfferSchema)
    @blp.response(201, OfferSchema)
    def post(self, offer_data):
        try:
            offer = OfferService.create_offer(offer_data)
            return offer
        except ValueError as e:
            abort(500, message=str(e))


@blp.route("/offers/<string:offer_id>")
class Offer(MethodView):
    @role_required('Agent', 'Client')
    @blp.response(200, OfferSchema)
    def get(self, offer_id):
        offer = OfferService.get_offer_by_id(offer_id)
        return offer

    @role_required('Agent')
    def delete(self, offer_id):
        OfferService.delete_offer(offer_id)
        return {"message": f"Offer with id {offer_id} has been deleted"}

    @role_required('Agent')
    @blp.arguments(OfferUpdateSchema)
    @blp.response(200, OfferSchema)
    def put(self, offer_data, offer_id):
        try:
            offer = OfferService.update_offer(offer_data, offer_id)
            return offer
        except ValueError as e:
            abort(400, message=str(e))


@blp.route("/offers/destination/<string:destination_id>")
class OfferByDestination(MethodView):
    @role_required('Agent', 'Client')
    @blp.response(200, OfferSchema)
    def get(self, destination_id):
        offer = OfferService.get_offers_by_destination_id(destination_id)
        return offer
