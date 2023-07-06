import { Component, EventEmitter, ViewChild, Output } from '@angular/core';
import { FormService } from 'src/app/pages/services/form.service';
import { SelectItemGroup } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { Observable, Subject, merge, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-first-panel',
  templateUrl: './first-panel.component.html',
  styleUrls: ['./first-panel.component.scss'],
})
export class FirstPanelComponent {
  @ViewChild('instance', { static: true }) instance: NgbTypeahead | undefined;
  @Output() formValid = new EventEmitter<boolean>();

  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  firstStepForm: FormGroup;
  filteredCourses: SelectItemGroup[] = [];

  constructor(
    private formService: FormService
  ) {
    this.firstStepForm = this.formService.firstStepForm;
  }

  public errorMessage = {
    nameControl: [
      { type: 'pattern', message: 'Nombre no válido' },
      { type: 'required', message: 'Nombre obligatorio' },
    ],
    lastnameControl: [
      { type: 'pattern', message: 'Apellido no válido' },
      { type: 'required', message: 'Apellido obligatorio' },
    ],
    studentIdControl: [
      { type: 'pattern', message: 'Matrícula no válida' },
      { type: 'required', message: 'Matrícula obligatoria' },
    ],
    courseControl: [
      { type: 'pattern', message: 'Materia no reconocida' },
      { type: 'required', message: 'Materia obligatoria' },
    ],
  };

  search: OperatorFunction<string, readonly { name: string, professor: string }[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance?.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      filter(term => term === '' || term.length >= 2),
      map(term => {
        if (term === '') {
          return this.formService.courses;
        } else {
          return this.formService.courses
            .filter(course => course.name.toLowerCase().includes(term.toLowerCase()))
            .slice(0, 10);
        }
      })
    );
  };

  formatter = (x: { name: string }) => x.name;

  showError(controlName: string, errorType: string): boolean {
    const controlErrors = this.firstStepForm.get(controlName)?.errors;
    return controlErrors && controlErrors[errorType];
  }

  submitForm() {
    if (this.firstStepForm.valid) {
      this.formValid.emit(true);
      console.log(this.firstStepForm.valid);
    }
  }
}
