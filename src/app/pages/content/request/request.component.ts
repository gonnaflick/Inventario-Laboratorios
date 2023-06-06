import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

export interface GroupSubject {
  group: string;
  subjects: string[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter((item) => item.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  standalone: true,
  imports: [
    MatAutocompleteModule,
    NgFor,
    AsyncPipe,
    MatIconModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class RequestComponent implements OnInit {
  firstStepForm = this._formBuilder.group({
    name: ['', Validators.required],
    student_id: ['', Validators.required],
    qr_signature: ['', Validators.required],
    subjectGroup: ['', Validators.required],
  });

  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor(private _formBuilder: FormBuilder) {}

  getErrorMessage() {
    if (this.firstStepForm.name.hasError('required')) {
      return 'You must enter a value';
    }

    return this.name.hasError('email') ? 'Not a valid email' : '';
  }
  ngOnInit() {
    this.filteredOptions = this.firstStepForm
      .get('subjectGroup')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filterGroup(value || ''))
      );
  }

  submitSignature(): void {
    /*TEMPORAL, DEBE INCLUIR EL ESCANEO QR Y GUARDAR EL LINK DEL USUARIO, ESTO ES LO QUE SE VALIDA*/
    this.firstStepForm.get('qr_signature')?.setValue('true');
    console.log('true');
  }

  /*-----------------------*/
  /*FILTRO Y AUTOCOMPLETADO*/
  /*-----------------------*/

  filteredOptions?: Observable<GroupSubject[]>;

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

  private _filterGroup(value: string): GroupSubject[] {
    if (value) {
      return this.groupSubjects
        .map((group) => ({
          group: group.group,
          subjects: _filter(group.subjects, value),
        }))
        .filter((group) => group.subjects.length > 0);
    }

    return this.groupSubjects;
  }
}
