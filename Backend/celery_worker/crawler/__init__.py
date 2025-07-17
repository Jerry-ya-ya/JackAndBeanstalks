from flask import Blueprint

from .crawlerlogger import crawlerlogger_bp
from .logic import logic_bp

crawler_bp = Blueprint('crawler', __name__)

# 註冊各個子藍圖到統一 crawler_bp 底下
crawler_bp.register_blueprint(crawlerlogger_bp)
crawler_bp.register_blueprint(logic_bp)

__all__ = ['crawler_bp']