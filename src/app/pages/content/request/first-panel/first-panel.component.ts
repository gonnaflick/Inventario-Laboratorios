import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { GroupSubject } from 'src/app/pages/interface/groupSubject.interface';
import { FormService } from 'src/app/pages/services/form.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-first-panel',
  templateUrl: './first-panel.component.html',
  styleUrls: ['./first-panel.component.scss'],
})
export class FirstPanelComponent implements OnInit {
  @Output() formValid = new EventEmitter<boolean>();

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

  submitForm() {
    if (this.firstStepForm.valid) {
      this.formValid.emit(true); // Emitir evento formValid
    }
  }
}
