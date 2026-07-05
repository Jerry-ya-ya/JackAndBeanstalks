from flask_jwt_extended import get_jwt_identity
from models import User


def get_current_user_from_token():
    identity = get_jwt_identity()
    if not identity:
        return None

    identity_text = str(identity)
    if identity_text.isdigit():
        return User.query.get(int(identity_text))

    # Backward compatibility for tokens issued before user id identities.
    return User.query.filter_by(username=identity_text).first()
