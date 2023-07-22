import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/pages/services/form.service';

@Component({
  selector: 'app-third-panel',
  templateUrl: './third-panel.component.html',
  styleUrls: ['./third-panel.component.css'],
})
export class ThirdPanelComponent {
  @Output() formValid = new EventEmitter<boolean>();

  thirdStepForm: FormGroup;

  constructor(formService: FormService) {
    this.thirdStepForm = formService.thirdStepForm;
  }

  submitForm() {
    if (this.thirdStepForm.valid) {
      this.formValid.emit(true);
      console.log(this.thirdStepForm.valid);
    }
  }
}
