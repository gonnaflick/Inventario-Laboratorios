import { Injectable } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { GroupSubject } from 'src/app/pages/interface/groupSubject.interface';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  groupSubjects: GroupSubject[] = [
    {
      group: '8HW1',
      subjects: ['Como', 'Hola', 'que', 'tal'],
    },
    {
      group: '9HW1',
      subjects: ['seg', 'cal', 'f', 'tmal'],
    },
  ];

  firstStepForm = this._formBuilder.group({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$'
      ),
    ]),
    studentId: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{6,6}$'),
    ]),
    subjectGroup: new FormControl('', [
      this.requireMatch(this.groupSubjects),
      Validators.required,
    ]),
  });

  constructor(private _formBuilder: FormBuilder) {}

  requireMatch(groupSubjects: GroupSubject[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const isValid = groupSubjects.some((group) =>
        group.subjects.includes(value)
      );

      if (Validators.required(control) && !value) {
        return { required: { value: control.value } };
      }

      return isValid ? null : { pattern: { value: control.value } };
    };
  }

  _filter = (opt: string[], value: string): string[] => {
    const filterValue = value.toLowerCase();

    return opt.filter((item) => item.toLowerCase().includes(filterValue));
  };
}
