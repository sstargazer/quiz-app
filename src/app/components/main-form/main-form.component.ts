import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-main-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss'],
})
export class MainFormComponent implements OnDestroy {
  public loginForm: any;
  public categories: any;
  public categoryObj: any;
  public submitWasClicked = false;
  private categoriesSubscription: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private userService: UserService,
    private router: Router
  ) {
    this.getCategories();
    this.createForm();
  }

  private getCategories(): void {
    this.categoriesSubscription = this.http
      .getCategories()
      .subscribe((categories) => {
        this.categories = Object.keys(categories);
        this.categoryObj = categories;
      });
  }

  private createForm(): void {
    this.loginForm = this.fb.group({
      category: ['', Validators.required],
    });
  }

  get category(): FormControl {
    return this.loginForm.get('category');
  }

  public onSubmit(): void {
    if (this.loginForm.valid) {
      const selectedCategory = this.category.value;
      this.http.getQuestions(selectedCategory);

      this.userService.userHasSelectedCategory = true;
      this.router.navigate(['/quiz']);
    } else {
      this.submitWasClicked = true;
    }
  }

  ngOnDestroy(): void {
    this.categoriesSubscription.unsubscribe();
  }
}
