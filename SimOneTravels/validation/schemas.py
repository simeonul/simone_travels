from marshmallow import Schema, fields

#load_only = True numai cand trimiti request se pune
#dump_only = True numai cand se trimite response se pune
class PlainDescriptionSchema(Schema):
    id = fields.UUID(required=False)
    type = fields.Str(required=True)
    board_options = fields.Str(required=True)
    rating = fields.Float(required=True)
    room_type = fields.Str(required=True)
    transport = fields.Str(required=True)


class PlainOfferSchema(Schema):
    id = fields.UUID(dump_only=True)
    title = fields.String(required=True)
    discount_percentage = fields.Int(required=True)
    valid_from = fields.Date(required=True)
    valid_to = fields.Date(required=True)


class DescriptionUpdateSchema(Schema):
    type = fields.Str(required=True)
    board_options = fields.Str(required=True)
    rating = fields.Float(required=True)
    room_type = fields.Str(required=True)
    transport = fields.Str(required=True)


class OfferUpdateSchema(Schema):
    title = fields.String(required=True)
    discount_percentage = fields.Int(required=True)
    valid_from = fields.Date(required=True)
    valid_to = fields.Date(required=True)


class PlainDestinationSchema(Schema):
    id = fields.UUID(required=False)
    title = fields.Str(required=True)
    location = fields.Str(required=True)
    nightly_rate = fields.Float(required=True)
    capacity = fields.Integer(required=True)


class DescriptionSchema(PlainDescriptionSchema):
    destination_id = fields.UUID(required=True)


class OfferSchema(PlainOfferSchema):
    destination_id = fields.UUID(required=True, load_only=True)
    destination = fields.Nested(PlainDestinationSchema(), dump_only=True)


class PlainBookingSchema(Schema):
    id = fields.UUID(dump_only=True)
    creation_date = fields.Date(required=True)
    start_date = fields.Date(required=True)
    end_date = fields.Date(required=True)
    total_cost = fields.Float(required=True)
    email = fields.String(required=True)


class BookingSchema(PlainBookingSchema):
    destination_id = fields.UUID(required=True, load_only=True)
    destination = fields.Nested(PlainDestinationSchema(), dump_only=True)


class DestinationSchema(PlainDestinationSchema):
    description = fields.Nested(PlainDescriptionSchema(), dump_only=True)
    offers = fields.Nested(PlainOfferSchema(many=True), dump_only=True)
    bookings = fields.Nested(PlainBookingSchema(many=True), dump_only=True)


class UserSchema(Schema):
    id = fields.UUID(dump_only=True)
    role = fields.Str(required=True)
    full_name = fields.Str(required=True)
    email = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)


class LoginSchema(Schema):
    email = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)


