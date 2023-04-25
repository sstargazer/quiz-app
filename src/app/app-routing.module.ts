import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainFormComponent } from './components/main-form/main-form.component';
import { QuestionComponent } from './components/test-question/test-question.component';
import { QuizRouteGuard } from './guard/quiz-route-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: MainFormComponent,
  },
  {
    path: 'quiz',
    component: QuestionComponent,
    canActivate: [QuizRouteGuard],
  },
  {
    path: '**',
    component: MainFormComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
