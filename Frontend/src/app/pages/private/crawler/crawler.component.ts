import { Component } from '@angular/core';
import { OnDestroy, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-crawler',
  standalone: false,
  templateUrl: './crawler.component.html',
  styleUrl: './crawler.component.css'
})
export class CrawlerComponent implements OnInit, OnDestroy {
  news: any[] = [];
  scheduleInfo: any = null;
  private updateSubscription: Subscription;
  constructor(private http: HttpClient) {
    // 每900秒更新一次時間資訊
    this.updateSubscription = interval(900000).subscribe(() => {
      this.updateScheduleInfo();
    });
  }

  ngOnInit(): void {
    this.loadNews();
    this.updateScheduleInfo();
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  loadNews() {
    this.http.get<any>('http://localhost:5000/api/crawler/news').subscribe({
      next: (data) => {
        this.news = data;
      },
      error: (error) => {
        console.error('Error loading news:', error);
      }
    });
  }

  updateScheduleInfo() {
    this.http.get<any>('http://localhost:5000/api/crawler/info').subscribe({
      next: (info) => {
        this.scheduleInfo = info;
      },
      error: (error) => {
        console.error('Error updating schedule info:', error);
      }
    });
  }

  fetchNews() {
    this.http.post('http://localhost:5000/api/crawler/fetch', {}).subscribe({
      next: () => {
        this.loadNews();
        this.updateScheduleInfo();
      },
      error: (error) => {
        console.error('Error fetching news:', error);
        alert('爬蟲失敗');
      }
    });
  }
}