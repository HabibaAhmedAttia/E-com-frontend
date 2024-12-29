import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,

  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage: string | null = null;

  constructor(private formBuilder: FormBuilder, private authService: AuthService,private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    this.submitted = true;
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      return; 
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        alert('Login successful!');
        console.log('JWT Token:', response.token);
        this.router.navigate(['/profile', email]);
      },
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password.';
        } else {
          console.error('Login failed:', error);
          this.errorMessage = 'An unexpected error occurred.';
        }
      },
    });
  }
}
