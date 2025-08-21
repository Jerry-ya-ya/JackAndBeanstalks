import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-aboutwebsite',
  standalone: false,
  templateUrl: './aboutwebsite.component.html',
  styleUrl: './aboutwebsite.component.css'
})
export class AboutwebsiteComponent {
  @Input() username: string = 'Jerry-ya-ya';
  @Input() repo: string = 'JackAndBeanstalks';

  repoData: any;
  loading = true;
  error = false;
  markdownText = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRepoData();
    this.http.get('assets/doc/worklog.md', { responseType: 'text' })
      .subscribe(md => {
        this.markdownText = md;
      });
  }

  loadRepoData(): void {
    if (this.username && this.repo) {
      this.loading = true;
      this.error = false;
      
      this.http.get(`https://api.github.com/repos/${this.username}/${this.repo}`)
        .subscribe({
          next: data => {
            this.repoData = data;
            this.loading = false;
          },
          error: err => {
            console.error('Failed to fetch repo data:', err);
            this.error = true;
            this.loading = false;
          }
        });
    }
  }
}
