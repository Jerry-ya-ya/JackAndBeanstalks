from flask import Blueprint, current_app
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from routes.crawler.logic import fetch_and_store_news
import pytz
from flask import Flask
from models import ScheduleState, db

from routes.crawler.crawlerlogger import crawler_logger

last_run = None
next_run = None
scheduler = None
app = None

schedule_bp = Blueprint('schedule_bp', __name__)

def start_scheduler(flask_app: Flask):
    global next_run, scheduler, app
    app = flask_app # 將外部傳入的 Flask 應用設定給全域變數 app，讓其他函數能用它的 app_context
    if scheduler is None: # 避免重複啟動排程器，只啟動一次。
        try:
            scheduler = BackgroundScheduler(timezone='Asia/Taipei') # 設定時區為台北時間

            scheduler.add_job(scheduled_task, 'interval', minutes=15) # 設定排程器，每 15 分鐘執行一次

            tz = pytz.timezone('Asia/Taipei')
            next_run = datetime.now(tz) + timedelta(minutes=15) #  記錄「下一次執行時間」變數，供前端查詢用

            scheduler.start()# 啟動排程器

            scheduled_task() # 立即執行一次，啟動後不用等 15 分鐘
            crawler_logger.info("Scheduler started successfully")
        except Exception as e:
            crawler_logger.info(f"Error starting scheduler: {e}")

def scheduled_task():
    global last_run, next_run
    crawler_logger.info("🟡 scheduled_task 被呼叫")
    try: # Flask 的資料庫操作需要有「應用上下文」，這句是必要的包裝！
        with app.app_context():
            added = fetch_and_store_news() # 執行你自定義的爬蟲邏輯，並回傳新增了幾筆資料

            tz = pytz.timezone('Asia/Taipei')
            now = datetime.now(tz)
            future = now + timedelta(minutes=15) # 記錄上次與下次執行時間（給前端 info 顯示）

            state = ScheduleState.query.filter_by(job_name="news_crawler").first()
            state.last_run = now
            state.next_run = future
            db.session.commit()

            crawler_logger.info(f"🟢 爬蟲成功新增 {added} 筆資料")
    except Exception as e:
        crawler_logger.info(f"🔴 爬蟲排程錯誤: {e}")