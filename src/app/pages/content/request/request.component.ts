import { Component } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/pages/services/form-service.service';

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
})
export class RequestComponent {
  public firstStepForm: FormGroup;

  constructor(private formService: FormService) {
    this.firstStepForm = this.formService.firstStepForm;
  }
}
