import time
from datetime import datetime

import pymongo
from pymongo import MongoClient

import praw

import yfinance as yf
from dotenv import load_dotenv

import dotenv
import os


def main():
    load_dotenv()

    client = MongoClient(os.environ['DB_URL'])
    collection = client["findMyGME"]["stocks"]

    nasdaq_dict = {}
    nyse_dict = {}
    ticker_dict = {}

    with open("Ticker Symbols/NASDAQ.txt", "r") as nasdaq:
        lines = [line.strip() for line in nasdaq.readlines()]
        for line in lines:
            if len(line.split("\t")) >= 2:
                symbol = line.split("\t")[0]
                name = line.split("\t")[1]
                nasdaq_dict[symbol] = name
                ticker_dict[symbol] = name

    with open("Ticker Symbols/NYSE.txt", "r") as nyse:
        lines = [line.strip() for line in nyse.readlines()]
        for line in lines:
            if len(line.split("\t")) >= 2:
                symbol = line.split("\t")[0]
                name = line.split("\t")[1]
                nyse_dict[symbol] = name
                if symbol not in ticker_dict:
                    ticker_dict[symbol] = name

    reddit = praw.Reddit(client_id = os.environ['client_id'], client_secret = os.environ['client_secret'], user_agent = os.environ['user_agent'])

    hot_posts = reddit.subreddit("wallstreetbets").hot(limit=500)

    def add_to_dict(word_in_post, ticker_dict):
        for word in word_in_post:
            clean_word = word.strip()
            if clean_word in ticker_dict:
                ticker_count.setdefault(clean_word, 0)
                ticker_count[clean_word] += 1

    ticker_count = {}

    for post in hot_posts:
        word_in_title = post.title.split()
        add_to_dict(word_in_title, ticker_dict)
        word_in_content = post.selftext.split()
        add_to_dict(word_in_content, ticker_dict)

    sorted_ticker_count = dict(sorted(ticker_count.items(), key=lambda item: item[1], reverse=True))

    # A list of abbreviations generally do not represent tickers.
    black_list = ["A", "DD", "FOR", "CEO", "ALL", "EV", "OR", "AT", "RH", "ONE", "ARE", "VERY", "ON", "EDIT"]

    clean_sorted_ticker_dict = {}

    for key, value in sorted_ticker_count.items():
        if key not in black_list:
            clean_sorted_ticker_dict[key] = value

    sorted_ticker_list = list(clean_sorted_ticker_dict.keys())

    now = datetime.now()
    for i in range(10):
        output_ticker = sorted_ticker_list[i]
        output_count = clean_sorted_ticker_dict[output_ticker]
        stock_info = yf.Ticker(output_ticker).info
        toDB = {
            "rank": i + 1,
            "ticker": output_ticker,
            "name": ticker_dict[output_ticker],
            "industry": stock_info["industry"],
            "count": output_count,
            "previousClose": stock_info["previousClose"],
            "fiftyDayAverage": stock_info["fiftyDayAverage"],
            "averageDailyVolume10Day": stock_info["averageDailyVolume10Day"],
            "timeStamp": now
        }
        print(toDB)
        collection.insert_one(toDB)


if __name__ == "__main__":
    main()

