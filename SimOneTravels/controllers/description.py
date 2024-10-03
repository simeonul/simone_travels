from flask.views import MethodView
from flask_smorest import Blueprint, abort
from validation.schemas import DescriptionSchema, DescriptionUpdateSchema
from services.description_service import DescriptionService
from utils.decorators import role_required

blp = Blueprint("descriptions", __name__, description="Operations on the descriptions of the destinations")


@blp.route("/descriptions")
class DescriptionsList(MethodView):
    @role_required('Agent', 'Client')
    @blp.response(200, DescriptionSchema(many=True))
    def get(self):
        descriptions = DescriptionService.get_all_descriptions()
        return descriptions

    @role_required('Agent')
    @blp.arguments(DescriptionSchema)
    @blp.response(201, DescriptionSchema)
    def post(self, description_data):
        try:
            description = DescriptionService.create_description(description_data)
            return description
        except ValueError as e:
            abort(500, message=str(e))


@blp.route("/descriptions/<string:description_id>")
class Description(MethodView):
    @role_required('Agent', 'Client')
    @blp.response(200, DescriptionSchema)
    def get(self, description_id):
        description = DescriptionService.get_description_by_id(description_id)
        return description

    @role_required('Agent')
    @blp.arguments(DescriptionSchema)
    @blp.response(200, DescriptionSchema)
    def put(self, description_data, description_id):
        try:
            description = DescriptionService.update_description(description_data, description_id)
            return description
        except ValueError as e:
            abort(400, message=str(e))


@blp.route("/descriptions/destination/<string:destination_id>")
class DescriptionByDestination(MethodView):
    @role_required('Agent', 'Client')
    @blp.response(200, DescriptionSchema)
    def get(self, destination_id):
        description = DescriptionService.get_description_by_destination_id(destination_id)
        return description
