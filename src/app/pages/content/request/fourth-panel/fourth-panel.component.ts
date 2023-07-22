import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/pages/services/form.service';

@Component({
  selector: 'app-fourth-panel',
  templateUrl: './fourth-panel.component.html',
  styleUrls: ['./fourth-panel.component.css'],
})
export class FourthPanelComponent {
  @Output() formValid = new EventEmitter<boolean>();

  fourthStepForm: FormGroup;

  constructor(formService: FormService) {
    this.fourthStepForm = formService.fourthStepForm;
  }

  submitForm() {
    if (this.fourthStepForm.valid) {
      this.formValid.emit(true);
      console.log(this.fourthStepForm.valid);
    }
  }
}
