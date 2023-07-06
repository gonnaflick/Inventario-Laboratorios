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
  qrCode: string = '';
  courses: Course[] = [
    {
      id: '1',
      name: '8HW1 - Circuitos Electronicos',
      professor: 'Jesus Jimenez',
    },
    {
      id: '1',
      name: '6HW1 - Circuitos Logicos II',
      professor: 'Alex Hernandez',
    },
  ];

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
    course: new FormControl('', [
      this.requireMatch(this.courses),
      Validators.required,
    ]),
  });

  secondStepForm = this._formBuilder.group({
    scannedQR: new FormControl('', [
      this.validateScannedLink(this.qrCode),
      Validators.required,
    ]),
  });

  constructor(private _formBuilder: FormBuilder) { }

  requireMatch(courses: Course[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedCourse = control.value.name;

      if (Validators.required(control) && !selectedCourse) {
        return { required: { value: control.value.name } };
      }

      const isValid = courses.some((course) => course.name === selectedCourse);

      return isValid ? null : { pattern: { value: control.value.name } };
    };
  }

  validateScannedLink(scannedQR: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isValid = scannedQR.startsWith('https://verificacion.uach.mx/credencial/');

      return isValid ? null : { invalidLink: true };
    };
  }

}
