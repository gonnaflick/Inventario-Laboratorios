import { Injectable } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { Course } from 'src/app/pages/interface/course.interface';
import { CourseService } from 'src/app/pages/services/course.service';

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
    course: this._formBuilder.control('', Validators.required),
    scannedQR: new FormControl('', [
      this.validateScannedLink(),
      Validators.required,
    ]),
  });

  secondStepForm = this._formBuilder.group({});

  thirdStepForm = this._formBuilder.group({});

  fourthStepForm = this._formBuilder.group({});

  constructor(
    private _formBuilder: FormBuilder,
    private courseService: CourseService
  ) {
    this.courseService.getCourses().then((data) => {
      this.courses = data;
      this.firstStepForm
        .get('course')!
        .setValidators([this.requireMatch(this.courses), Validators.required]);
    });
  }

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
