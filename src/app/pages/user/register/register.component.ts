import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { StepperModule } from 'primeng/stepper';
import { RouterModule } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { Country } from '../../../interfaces/country';
import { CountryService } from '../../../services/utils/country.service';
import { finalize } from 'rxjs/operators';

import { userRegister } from '../../../interfaces/user';

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
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  public currentStep:number = 1;
  public countries: Country[] = [];
  public filteredCountries: Country[] = [];
  public isLoadingCountries = true;
  public loadingError = false; 


  public registerForm = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[a-zA-Záéíóúñ]+$/),
    ]),
    userLastName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[a-zA-Záéíóúñ]+$/),
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

  constructor(private countryService: CountryService) {}

  ngOnInit() {
    this.loadCountries();
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

  onStepChange(step:number): void {
    console.log(step)   
    this.currentStep = step;
  }

  onSubmit(): void {    
    if (
      this.registerForm.valid &&
      this.registerForm.value.userPassword ===
        this.registerForm.value.userPasswordConfirm
    ) {
      const newUser: userRegister = {
        name: this.registerForm.value.userName!,
        lastname: this.registerForm.value.userLastName!,
        email: this.registerForm.value.userEmail!,
        password: this.registerForm.value.userPassword!,
        phone: `${this.registerForm.value.countryCode?.dialCode}${this.registerForm.value.userPhone}`,
        address: this.registerForm.value.userAddress!,
      };

      console.log(newUser);
    }
  }
}
