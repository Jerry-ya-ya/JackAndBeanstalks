from flask import Blueprint
import logging
import os

crawlerlogger_bp = Blueprint('crawlerlogger_bp', __name__)

crawler_logger = logging.getLogger('crawler') # To get the logger
crawler_logger.setLevel(logging.INFO) # To set the log level

if not crawler_logger.hasHandlers(): # To check if the logger has handlers
    log_dir = 'logs' # To set the log directory
    os.makedirs(log_dir, exist_ok=True) # To create the log directory if it doesn't exist

    file_handler = logging.FileHandler(os.path.join(log_dir, 'crawler.log')) # To set the log file
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s') # To set the log format
    file_handler.setFormatter(formatter) # To set the log format
    force=True # To force the log to be written to the file

crawler_logger.addHandler(file_handler) # To add the file handler to the logger