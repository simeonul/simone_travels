from flask.views import MethodView
from flask_smorest import Blueprint, abort

from services.booking_service import BookingService
from validation.schemas import BookingSchema
from utils.decorators import role_required

blp = Blueprint("bookings", __name__, description="Operations on bookings")


@blp.route("/bookings")
class BookingsList(MethodView):
    @role_required('Agent', 'Client')
    @blp.response(200, BookingSchema(many=True))
    def get(self):
        bookings = BookingService.get_all_bookings()
        return bookings

    @role_required('Agent', 'Client')
    @blp.arguments(BookingSchema)
    @blp.response(201, BookingSchema)
    def post(self, booking_data):
        try:
            booking = BookingService.create_booking(booking_data)
            return booking
        except ValueError as e:
            abort(500, message=str(e))


@blp.route("/bookings/destination/<string:destination_id>")
class BookingsByDestination(MethodView):
    @role_required('Agent', 'Client')
    @blp.response(200, BookingSchema(many=True))
    def get(self, destination_id):
        offer = BookingService.get_bookings_by_destination_id(destination_id)
        return offer
