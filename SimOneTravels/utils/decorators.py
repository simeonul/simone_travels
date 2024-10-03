from functools import wraps

from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt


def role_required(*required_roles):
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            claims = get_jwt()
            user_role = claims.get('role')
            if user_role not in required_roles:
                return (
                    jsonify(
                        {"msg": "Insufficient permissions.",
                         "error": "unauthorized_access"}
                    ),
                    403
                )
            return fn(*args, **kwargs)
        return decorator
    return wrapper
