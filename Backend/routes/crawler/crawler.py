from flask import Blueprint, jsonify
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from models import News, ScheduleState

from celery_worker.crawler.logic import fetch_and_store_news
from celery_worker.task import hello
from flask_jwt_extended import jwt_required

crawler_bp = Blueprint('crawler_bp', __name__)

@crawler_bp.route('/crawler/fetch', methods=['POST'])
def fetch_news_api():
    added = fetch_and_store_news()
    return jsonify({'message': f'{added} new items added.'})

@crawler_bp.route('/crawler/news', methods=['GET'])
@jwt_required()
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

@crawler_bp.route('/crawler/info', methods=['GET'])
def get_schedule_info():
    state = ScheduleState.query.filter_by(job_name="news_crawler").first()
    return jsonify({
        'last_run': state.last_run.isoformat() if state.last_run else None,
        'next_run': state.next_run.isoformat() if state.next_run else None
    })

@crawler_bp.route('/crawler/test', methods=['GET'])
def test_crawler():
    hello.delay()
    return jsonify({'message': 'Crawler is working!'})