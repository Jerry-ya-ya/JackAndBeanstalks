from flask import Blueprint, request

health_bp = Blueprint('health', __name__)

@health_bp.route("/healthz", methods=["GET"])
def healthz():
    return "ok", 200