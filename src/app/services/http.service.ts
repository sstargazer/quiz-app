import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  public selectedQuestions = new Subject();

  constructor(private http: HttpClient) {}

  public getCategories() {
    return this.http.get('https://the-trivia-api.com/api/categories');
  }

  public getQuestions(selected: string) {
    return this.http
      .get(
        `https://the-trivia-api.com/api/questions?limit=10&categories=${selected}`
      )
      .subscribe((res: any) => {
        this.selectedQuestions.next(res);
      });
  }
}
