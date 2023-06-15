import { Component, OnInit } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { GroupSubject } from 'src/app/pages/interface/groupSubject.interface';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormService } from 'src/app/pages/services/form-service.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-first-panel',
  templateUrl: './first-panel.component.html',
  styleUrls: ['./first-panel.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class FirstPanelComponent implements OnInit {
  public firstStepForm: FormGroup;
  filteredOptions: any;

  constructor(private formService: FormService) {
    this.firstStepForm = this.formService.firstStepForm;
  }

  public errorMessage = {
    nameControl: [
      { type: 'pattern', message: 'Nombre no válido' },
      { type: 'required', message: 'Nombre obligatorio' },
    ],
    studentIdControl: [
      { type: 'pattern', message: 'Matrícula no válida' },
      { type: 'required', message: 'Matrícula obligatoria' },
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
      return this.formService.groupSubjects
        .map((group) => ({
          group: group.group,
          subjects: this.formService._filter(group.subjects, value),
        }))
        .filter((group) => group.subjects.length > 0);
    }

    return this.formService.groupSubjects;
  }
}
