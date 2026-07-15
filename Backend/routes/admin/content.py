from flask import Blueprint, jsonify, request

from models import db, HomeNewsItem
from routes.admin.decorators import admin_required

content_bp = Blueprint('content', __name__)

VALID_THEMES = {'cmen', 'eden'}

DEFAULT_HOME_NEWS = {
    'cmen': [
        {
            'title': 'Prototype Lab Opens',
            'summary': 'A small corner for gameplay sketches, tiny tools, and strange experiments.',
            'tag': 'Studio',
        },
        {
            'title': 'Player Notes Wanted',
            'summary': 'Collecting first impressions before the next round of game-facing polish.',
            'tag': 'Community',
        },
        {
            'title': 'Devlog Queue',
            'summary': 'Future posts will track builds, experiments, and useful lessons from production.',
            'tag': 'Devlog',
        },
    ],
    'eden': [
        {
            'title': 'Knowledge Node Online',
            'summary': 'EDEN prepares a shared space for questions, references, and learning trails.',
            'tag': 'Network',
        },
        {
            'title': 'Learning Routes Drafted',
            'summary': 'Encode, Develop, Enlighten, and Nexus will shape the first content channels.',
            'tag': 'Roadmap',
        },
        {
            'title': 'Admin News Tools Planned',
            'summary': 'Community news cards are placeholders until editable publishing is unlocked.',
            'tag': 'System',
        },
    ],
}


def serialize_home_news(item):
    return {
        'id': item.id,
        'theme': item.theme,
        'title': item.title,
        'summary': item.summary,
        'tag': item.tag,
        'sort_order': item.sort_order,
        'created_at': item.created_at.isoformat() if item.created_at else None,
        'updated_at': item.updated_at.isoformat() if item.updated_at else None,
    }


def serialize_defaults():
    return {
        theme: [
            {
                **item,
                'id': None,
                'theme': theme,
                'sort_order': index,
                'created_at': None,
                'updated_at': None,
            }
            for index, item in enumerate(items)
        ]
        for theme, items in DEFAULT_HOME_NEWS.items()
    }


def grouped_home_news():
    items = HomeNewsItem.query.order_by(HomeNewsItem.theme.asc(), HomeNewsItem.sort_order.asc(), HomeNewsItem.id.asc()).all()
    if not items:
        return serialize_defaults()

    grouped = {'cmen': [], 'eden': []}
    for item in items:
        if item.theme in grouped:
            grouped[item.theme].append(serialize_home_news(item))

    return grouped


def read_item_payload(data, default_theme=None, default_order=0):
    if not isinstance(data, dict):
        return None, ('news item must be an object', 400)

    theme = (data.get('theme') or default_theme or '').strip()
    title = (data.get('title') or '').strip()
    summary = (data.get('summary') or '').strip()
    tag = (data.get('tag') or '').strip()
    sort_order = data.get('sort_order', default_order)

    if theme not in VALID_THEMES:
        return None, ('theme must be cmen or eden', 400)
    if not title:
        return None, ('title is required', 400)
    if not summary:
        return None, ('summary is required', 400)
    if not tag:
        return None, ('tag is required', 400)

    try:
        sort_order = int(sort_order)
    except (TypeError, ValueError):
        return None, ('sort_order must be a number', 400)

    return {
        'theme': theme,
        'title': title[:120],
        'summary': summary,
        'tag': tag[:40],
        'sort_order': sort_order,
    }, None


@content_bp.route('/content/home-news', methods=['GET'])
def public_home_news():
    return jsonify(grouped_home_news())


@content_bp.route('/admin/content/home-news', methods=['GET'])
@admin_required
def admin_home_news():
    return jsonify(grouped_home_news())


@content_bp.route('/admin/content/home-news', methods=['PUT'])
@admin_required
def replace_home_news():
    data = request.get_json(silent=True) or {}
    next_items = []

    for theme in ['cmen', 'eden']:
        raw_items = data.get(theme, [])
        if not isinstance(raw_items, list):
            return jsonify({'error': f'{theme} must be a list'}), 400

        for index, raw_item in enumerate(raw_items):
            payload, error = read_item_payload(raw_item, default_theme=theme, default_order=index)
            if error:
                message, status = error
                return jsonify({'error': message}), status
            next_items.append(HomeNewsItem(**payload))

    HomeNewsItem.query.delete()
    db.session.add_all(next_items)
    db.session.commit()

    return jsonify(grouped_home_news())


@content_bp.route('/admin/content/home-news/items', methods=['POST'])
@admin_required
def create_home_news_item():
    data = request.get_json(silent=True) or {}
    payload, error = read_item_payload(data)
    if error:
        message, status = error
        return jsonify({'error': message}), status

    item = HomeNewsItem(**payload)
    db.session.add(item)
    db.session.commit()

    return jsonify(serialize_home_news(item)), 201


@content_bp.route('/admin/content/home-news/items/<int:item_id>', methods=['PUT'])
@admin_required
def update_home_news_item(item_id):
    item = HomeNewsItem.query.get_or_404(item_id)
    data = request.get_json(silent=True) or {}
    payload, error = read_item_payload(data, default_theme=item.theme, default_order=item.sort_order)
    if error:
        message, status = error
        return jsonify({'error': message}), status

    for key, value in payload.items():
        setattr(item, key, value)
    db.session.commit()

    return jsonify(serialize_home_news(item))


@content_bp.route('/admin/content/home-news/items/<int:item_id>', methods=['DELETE'])
@admin_required
def delete_home_news_item(item_id):
    item = HomeNewsItem.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()

    return jsonify({'message': 'home news item deleted', 'id': item_id})
