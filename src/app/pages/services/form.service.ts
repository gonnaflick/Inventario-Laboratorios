import { Injectable } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { Course } from 'src/app/pages/interface/course.interface';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  courses!: Course[];

  firstStepForm = this._formBuilder.group({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$'
      ),
    ]),
    lastname: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$'
      ),
    ]),
    studentId: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{6,6}$'),
    ]),
    group: this._formBuilder.control('', Validators.required),
    class: this._formBuilder.control('', Validators.required),
    professor: this._formBuilder.control('', Validators.required),
    scannedQR: new FormControl('', [
      this.validateScannedLink(),
      Validators.required,
    ]),
  });

  secondStepForm = this._formBuilder.group({});

  thirdStepForm = this._formBuilder.group({});

  fourthStepForm = this._formBuilder.group({});

  constructor(private _formBuilder: FormBuilder) {}

  validateScannedLink(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const scannedQR = control.value;
      const isValid = scannedQR.startsWith(
        'https://verificacion.uach.mx/credencial/'
      );

      return isValid ? null : { invalidLink: true };
    };
  }
}
