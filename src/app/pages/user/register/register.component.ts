import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { RecaptchaService } from '../../../services/security/recaptcha.service';
import { CountryService } from '../../../services/utils/country.service';
import { MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabel } from 'primeng/floatlabel';
import { StepperModule } from 'primeng/stepper';
import { Router, RouterModule } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';

import { Country } from '../../../interfaces/country';
import { userRegister } from '../../../interfaces/user';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FloatLabel,
    StepperModule,
    SelectModule,
    ToastModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [MessageService],
})
export class RegisterComponent implements OnInit {
  public currentStep: number = 1;
  public countries: Country[] = [];
  public filteredCountries: Country[] = [];
  public isLoadingCountries = true;
  public loadingError = false;
  public isSubmitting = false;

  private readonly isBrowser: boolean = false;
  private grecaptcha: any;

  public registerForm = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[a-zA-Záéíóúñ\s]+$/),
    ]),
    userLastName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[a-zA-Záéíóúñ\s]+$/),
    ]),
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    userPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/
      ),
    ]),
    userPasswordConfirm: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/
      ),
    ]),
    userPhone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]+$/),
    ]),
    countryCode: new FormControl<Country | null>(null, [Validators.required]),
    userAddress: new FormControl(''),
  });

  constructor(
    private countryService: CountryService,
    private recaptchaService: RecaptchaService,
    private messageService: MessageService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.loadCountries();

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

  /**
   * Carga la lista de países desde el servicio
   * Maneja estados de carga y error
   */
  private loadCountries(): void {
    this.isLoadingCountries = true;
    this.loadingError = false;

    this.countryService
      .getCountries()
      .pipe(finalize(() => (this.isLoadingCountries = false)))
      .subscribe({
        next: (countries) => {
          this.countries = countries;
        },
        error: () => {
          this.loadingError = true;
        },
      });
  }

  filterCountry(event: { query: string }) {
    const filtered = this.countries.filter(
      (country) =>
        country.name.toLowerCase().includes(event.query.toLowerCase()) ||
        country.dialCode.includes(event.query)
    );
    this.filteredCountries = filtered;
  }

  isStepValid(step: number) {
    switch (step) {
      case 1:
        return (
          this.registerForm.get('userName')?.valid &&
          this.registerForm.get('userLastName')?.valid
        );
      case 2:
        return (
          this.registerForm.get('userEmail')?.valid &&
          this.registerForm.get('userPassword')?.valid &&
          this.registerForm.get('userPasswordConfirm')?.valid &&
          this.registerForm.value.userPassword ===
            this.registerForm.value.userPasswordConfirm
        );
      case 3:
        return (
          this.registerForm.get('userPhone')?.valid &&
          this.registerForm.get('countryCode')?.valid &&
          this.registerForm.get('userAddress')?.valid
        );
      default:
        return false;
    }
  }

  onStepChange(nextStep: number): void {
    if (this.isStepValid(this.currentStep)) {
      this.currentStep = nextStep;
    }
  }

  async onSubmit() {
    if (
      this.registerForm.valid &&
      this.registerForm.value.userPassword ===
        this.registerForm.value.userPasswordConfirm
    ) {
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

        const newUser: userRegister = {
          name: this.registerForm.value.userName!,
          lastname: this.registerForm.value.userLastName!,
          email: this.registerForm.value.userEmail!,
          password: this.registerForm.value.userPassword!,
          phone: `${this.registerForm.value.countryCode?.dialCode}${this.registerForm.value.userPhone}`,
          address: this.registerForm.value.userAddress!,          
        };

        // Aquí tu lógica de registro
        console.log(newUser);
        // Alerta de exito
       this.messageService.add({severity: 'success', summary: 'Registro exitoso', detail: 'Usuario registrado correctamente'});
       setTimeout(() => {
        this.router.navigate(['/login']);
       }, 2000);
      } catch (error) {
        console.error('Error en el proceso de registro:', error);
        // Alerta de error
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error en registro: ${(error as any).message}` });
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
