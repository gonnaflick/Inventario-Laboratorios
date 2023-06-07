import { Component, ViewChild, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarModule,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

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
import { NgIf } from '@angular/common';

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
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgIf,
    MatSelectModule,
    MatSnackBarModule,
  ],
})
export class RequestComponent implements OnInit {
  firstStepForm = this._formBuilder.group({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
    student_id: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]*'),
    ]),
    qr_signature: new FormControl('', Validators.required),
    subjectGroup: new FormControl('', Validators.required),
  });

  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  panels: { id: number; nombre: string; cantidad: number }[] = [
    { id: 1, nombre: '', cantidad: 0 },
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  getErrorMessage(errorType: String) {
    /*--------------------*/
    /*Validacion nombre*/
    /*--------------------*/

    if (
      this.firstStepForm.controls['name'].hasError('required') &&
      errorType === 'name'
    ) {
      return 'Nombre obligatorio.';
    }

    if (
      this.firstStepForm.controls['name'].hasError('pattern') &&
      errorType === 'name'
    ) {
      return 'Nombre no valido.';
    }

    /*--------------------*/
    /*Validacion matricula*/
    /*--------------------*/

    if (
      this.firstStepForm.controls['student_id'].hasError('required') &&
      errorType === 'student_id'
    ) {
      return 'Matricula obligatoria.';
    }

    if (
      this.firstStepForm.controls['student_id'].hasError('pattern') &&
      errorType === 'student_id'
    ) {
      return 'Matricula no valida.';
    }

    /*------------------*/
    /*Validacion materia*/
    /*------------------*/

    if (
      this.firstStepForm.controls['subjectGroup'].hasError('required') &&
      errorType === 'subjectGroup'
    ) {
      return 'Materia obligatoria.';
    }
    return '';
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

  agregarPanel() {
    const nuevoPanel = { id: this.panels.length + 1, nombre: '', cantidad: 0 };
    this.panels.push(nuevoPanel);
  }

  eliminarPanel(panel: { id: number; nombre: string; cantidad: number }) {
    const index = this.panels.indexOf(panel);
    if (index > -1 && this.panels.length > 1) {
      const panel_cpy = panel;
      this.panels.splice(index, 1);

      this.panels.forEach((panel, i) => {
        panel.id = i + 1;
      });

      const snackBarRef = this._snackBar.open(
        `Panel ${panel.id} eliminado`,
        'Deshacer',
        { duration: 5000 }
      );
      snackBarRef.onAction().subscribe(() => {
        this.panels.splice(index, 0, panel);

        this.panels.forEach((panel, i) => {
          panel.id = i + 1;
        });
      });
    }
  }
}
