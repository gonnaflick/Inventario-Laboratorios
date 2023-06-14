import { Component, ViewChild, OnInit } from '@angular/core';
import { NgFor, AsyncPipe, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { GroupSubject } from 'src/app/pages/interface/groupSubject.interface';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ScannerComponent } from 'src/app/pages/content/request/scanner/scanner.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { Inject } from '@angular/core';

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter((item) => item.toLowerCase().includes(filterValue));
};

export function RequireMatch(groupSubjects: GroupSubject[]): ValidatorFn {
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
    ZXingScannerModule,
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
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgIf,
    ScannerComponent,
  ],
})
export class RequestComponent implements OnInit {
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
    date: new FormControl('', [Validators.required]),
    subjectGroup: new FormControl('', [
      RequireMatch(this.groupSubjects),
      Validators.required,
    ]),
    qrSignature: new FormControl('', Validators.required),
  });

  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor(private _formBuilder: FormBuilder) {}

  public errorMessage = {
    nameControl: [
      { type: 'pattern', message: 'Nombre no valido' },
      { type: 'required', message: 'Nombre obligatorio' },
    ],
    studentIdControl: [
      { type: 'pattern', message: 'Matricula no valida' },
      { type: 'required', message: 'Matricula obligatoria' },
    ],
    subjectGroupControl: [
      { type: 'pattern', message: 'Materia no reconocida' },
      { type: 'required', message: 'Materia obligatoria' },
    ],
  };

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
    this.firstStepForm.get('qrSignature')?.setValue('true');
    console.log('true');
  }

  showError(controlName: string, errorType: string): boolean {
    const controlErrors = this.firstStepForm.get(controlName)?.errors;
    return controlErrors && controlErrors[errorType];
  }

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
