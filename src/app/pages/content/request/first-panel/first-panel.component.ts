import { Component, EventEmitter, Output } from '@angular/core';
import { FormService } from 'src/app/pages/services/form.service';
import { FilterService, SelectItemGroup } from 'primeng/api';
import { FormGroup } from '@angular/forms';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-first-panel',
  templateUrl: './first-panel.component.html',
  styleUrls: ['./first-panel.component.scss'],
})
export class FirstPanelComponent {
  @Output() formValid = new EventEmitter<boolean>();

  firstStepForm: FormGroup;
  filteredGroups: SelectItemGroup[] = [];

  constructor(
    private formService: FormService,
    private filterService: FilterService
  ) {
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

  showError(controlName: string, errorType: string): boolean {
    const controlErrors = this.firstStepForm.get(controlName)?.errors;
    return controlErrors && controlErrors[errorType];
  }

  filterGroup(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    const filteredGroups: SelectItemGroup[] = [];

    for (const group of this.formService.groupSubjects) {
      const filteredSubOptions = this.filterService.filter(
        group.subjects.map((subject) => ({ label: subject, value: subject })),
        ['label'],
        query,
        'contains'
      );

      if (filteredSubOptions && filteredSubOptions.length) {
        filteredGroups.push({
          label: group.group,
          items: filteredSubOptions,
        });
      } else if (group.group.toLowerCase().includes(query)) {
        filteredGroups.push({
          label: group.group,
          items: group.subjects.map((subject) => ({
            label: subject,
            value: subject,
          })),
        });
      }
    }

    this.filteredGroups = filteredGroups;
  }

  submitForm() {
    if (this.firstStepForm.valid) {
      this.formValid.emit(true);
      console.log(this.firstStepForm.valid);
    }
  }
}
