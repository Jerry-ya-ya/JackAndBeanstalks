from flask import Blueprint
import requests
from bs4 import BeautifulSoup
from models import News, db
from models import ScheduleState

logic_bp = Blueprint('logic_bp', __name__)

def fetch_and_store_news():
    url = 'https://news.ycombinator.com/'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    added = 0

    for item in soup.select('.athing')[:30]:
        title_tag = item.select_one('.titleline a')
        if title_tag:
            title = title_tag.text
            link = title_tag['href']
            # 檢查是否已存在（避免重複）
            if not News.query.filter_by(title=title, url=link).first():
                news = News(title=title, url=link)
                db.session.add(news)
                added += 1

    db.session.commit()
    return added

def init_schedule_state():
    if not ScheduleState.query.filter_by(job_name="news_crawler").first():
        state = ScheduleState(job_name="news_crawler")
        db.session.add(state)
        db.session.commit()
        print("✅ ScheduleState 已初始化")