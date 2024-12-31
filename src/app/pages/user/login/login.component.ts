import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabel } from 'primeng/floatlabel';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ ReactiveFormsModule, RouterModule, ButtonModule, InputTextModule, PasswordModule, FloatLabel],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public loginForm = new FormGroup({
    userEmail: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    userPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/)
    ]),
  });

  onSubmit():void {
    if (this.loginForm.valid) {
      console.log({email: this.loginForm.value.userEmail, password: this.loginForm.value.userPassword})
    }
  }

}
