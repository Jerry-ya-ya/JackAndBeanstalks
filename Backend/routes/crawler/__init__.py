from flask import Blueprint

from routes.crawler.logic import logic_bp
from routes.crawler.routes import routes_bp
from routes.crawler.schedule import schedule_bp

crawler_bp = Blueprint('crawler', __name__)

# 註冊各個子藍圖到統一 crawler_bp 底下
crawler_bp.register_blueprint(logic_bp)
crawler_bp.register_blueprint(routes_bp)
crawler_bp.register_blueprint(schedule_bp)