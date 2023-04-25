import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { take, tap, timer } from 'rxjs';
import { IQuestion } from 'src/app/models/question.model';
import { HttpService } from '../../services/http.service';
import { ResultsPageComponent } from '../results-page/results-page.component';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, ResultsPageComponent, LoadingComponent],
  templateUrl: './test-question.component.html',
  styleUrls: ['./test-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionComponent implements OnDestroy {
  test: IQuestion = {
    count: 0,
    question: '',
    correctAnswer: '',
    incorrectAnswers: [],
  };
  isLoading: boolean = true;
  quizIsOver: boolean = false;

  selectedQuestions$: any;
  questions: any;
  selectedOption: string = '';

  score: any = 0;

  submitted = false;

  answers: string[] = [];
  public displayingRightAnswer: boolean = false;

  constructor(private httpService: HttpService, private cd: ChangeDetectorRef) {
    this.getQuestions();
  }

  private getQuestions() {
    this.selectedQuestions$ = this.httpService.selectedQuestions.subscribe(
      (res: any) => {
        this.questions = res;
        this.prepQuestion(0);
        this.cd.detectChanges();
      },
      () => {
        alert(`Please Try Again!`);
      }
    );
  }

  public submitAnswer(answer: string) {
    if (this.displayingRightAnswer) return;

    this.selectedOption = answer;

    if (answer === this.test.correctAnswer) {
      this.score++;
    }

    this.displayingRightAnswer = true;
    this.cd.detectChanges();

    // delay the code execution for 2 seconds
    timer(2000)
      .pipe(
        take(1),
        tap(() => {
          if (!this.questions[this.test.count]) {
            this.score = String(this.score).split('');
            this.quizIsOver = true;
            this.cd.detectChanges();
            return;
          }
          this.displayingRightAnswer = false;
          this.prepQuestion(this.test.count);
        })
      )
      .subscribe();
  }

  private prepQuestion(index: number) {
    this.test.question = this.questions[index].question;
    this.test.correctAnswer = this.questions[index].correctAnswer;

    this.test.count++;

    this.isLoading = false;

    this.randomizeAnswers([
      this.questions[index].correctAnswer,
      ...this.questions[index].incorrectAnswers,
    ]);
  }

  private randomizeAnswers(answers: string[]) {
    const randomIndex = Math.floor(Math.random() * 4);
    [answers[randomIndex], answers[0]] = [answers[0], answers[randomIndex]];

    this.answers = answers;

    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.selectedQuestions$.unsubscribe();
  }
}
