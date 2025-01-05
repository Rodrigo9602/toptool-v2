import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabel } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';

import { RecaptchaService } from '../../../services/security/recaptcha.service';
import { environment } from '../../../../environments/environment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FloatLabel,
    ToastModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  private readonly isBrowser: boolean = false;
  private grecaptcha: any;

  public isSubmitting = false;

  public loginForm = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    userPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/
      ),
    ]),
  });

  constructor(
    private _router:Router,
    private recaptchaService: RecaptchaService,
    private messageService: MessageService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.loadRecaptchaScript();
    }
  }

  private loadRecaptchaScript() {
    // Cargar el script de reCAPTCHA
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${environment.recaptcha.siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // @ts-ignore
      this.grecaptcha = window.grecaptcha;
    };

    document.head.appendChild(script);
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      try {
        const token = await this.recaptchaService.executeRecaptcha(
          this.grecaptcha
        );
        const isVerified = this.recaptchaService
          .verifyToken(token)
          .subscribe((data) => {
            return data.success && data.score > 0.5;
          });

        if (!isVerified) {
          console.error('Verificación de reCAPTCHA fallida');
          return;
        }

        console.log({
          email: this.loginForm.get('userEmail')!.value,
          password: this.loginForm.get('userPassword')!.value,
        });
        // Alerta de exito
       this.messageService.add({severity: 'success', summary: 'Sesión Iniciada', detail: 'Bienvenido de vuelta!'});
       setTimeout(()=>{
        this._router.navigate(['/dashboard'])
       }, 2000)
      } catch (error) {
        console.error('Error al verificar reCAPTCHA', error);
        // Alerta de error
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error en registro: ${(error as any).message}` });
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
