import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { 
    // 在服務初始化時顯示當前的 API URL
    console.log('🌐 當前 API URL:', this.baseUrl);
    console.log('🔧 環境配置:', environment);
  }

  // 獲取當前 API URL（用於測試）
  getCurrentApiUrl(): string {
    return this.baseUrl;
  }

  // 通用 GET 請求
  get<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { headers });
  }

  // 通用 POST 請求
  post<T>(endpoint: string, data: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, { headers });
  }

  // 通用 PUT 請求
  put<T>(endpoint: string, data: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, { headers });
  }

  // 通用 DELETE 請求
  delete<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, { headers });
  }

  // 創建帶有認證 token 的 headers
  createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
