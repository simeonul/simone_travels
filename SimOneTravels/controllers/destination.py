from flask.views import MethodView
from flask_smorest import Blueprint, abort

from utils.decorators import role_required
from validation.schemas import DestinationSchema
from services.destination_service import DestinationService

blp = Blueprint("destinations", __name__, description="Operations on destinations")


@blp.route("/destinations")
class DestinationsList(MethodView):
    @role_required('Agent', 'Client')
    @blp.response(200, DestinationSchema(many=True))
    def get(self):
        destinations = DestinationService.get_all_destinations()
        return destinations

    @role_required('Agent')
    @blp.arguments(DestinationSchema)
    @blp.response(201, DestinationSchema)
    def post(self, destination_data):
        try:
            destination = DestinationService.create_destination(destination_data)
            return destination
        except ValueError as e:
            abort(500, message=str(e))


@blp.route("/destinations/<string:destination_id>")
class Destination(MethodView):
    @role_required('Agent', 'Client')
    @blp.response(200, DestinationSchema)
    def get(self, destination_id):
        destination = DestinationService.get_destination_by_id(destination_id)
        return destination

    @role_required('Agent')
    def delete(self, destination_id):
        DestinationService.delete_destination(destination_id)
        return {"message": f"Destination with id {destination_id} has been deleted"}

    @role_required('Agent')
    @blp.arguments(DestinationSchema)
    @blp.response(200, DestinationSchema)
    def put(self, destination_data, destination_id):
        try:
            destination = DestinationService.update_destination(destination_data, destination_id)
            return destination
        except ValueError as e:
            abort(400, message=str(e))


@blp.route("/destinations/hasOffers")
class DestinationsWithOffers(MethodView):
    @role_required('Agent', 'Client')
    @blp.response(200, DestinationSchema(many=True))
    def get(self):
        destinations_with_offers = DestinationService.get_destinations_with_offers()
        return destinations_with_offers


@blp.route("/destinations/filter/<string:query_string>")
class DestinationsFiltered(MethodView):
    @role_required('Agent', 'Client')
    @blp.response(200, DestinationSchema(many=True))
    def get(self, query_string):
        destinations_filtered = DestinationService.get_filtered_destinations(query_string)
        return destinations_filtered
