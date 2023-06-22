import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/pages/services/form.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css'],
})
export class RequestComponent {
  public firstStepForm: FormGroup;
  public isFormValid: boolean = false;

  @ViewChild('stepper') stepper?: MatStepper;

  constructor(private formService: FormService) {
    this.firstStepForm = this.formService.firstStepForm;
  }

  handleFormValid(valid: boolean) {
    this.isFormValid = valid;
    if (valid) {
      this.stepper!.next();
    }
  }
}
