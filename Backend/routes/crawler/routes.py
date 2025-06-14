from flask import Blueprint, jsonify
from models import News, ScheduleState

from routes.crawler.schedule import last_run, next_run
from routes.crawler.logic import fetch_and_store_news

routes_bp = Blueprint('routes_bp', __name__)

@routes_bp.route('/crawler/fetch', methods=['POST'])
def fetch_news_api():
    added = fetch_and_store_news()
    return jsonify({'message': f'{added} new items added.'})

@routes_bp.route('/crawler/news', methods=['GET'])
def get_saved_news():
    news = News.query.order_by(News.created_at.desc()).limit(30).all()
    return jsonify([
        {
            'title': n.title,
            'url': n.url,
            'created_at': n.created_at.isoformat()
        }
        for n in news
    ])

@routes_bp.route('/crawler/info', methods=['GET'])
def get_schedule_info():
    state = ScheduleState.query.filter_by(job_name="news_crawler").first()
    return jsonify({
        'last_run': state.last_run.isoformat() if state.last_run else None,
        'next_run': state.next_run.isoformat() if state.next_run else None
    })