import { Component } from '@angular/core';

export interface Step {
  completed: boolean;
}
@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent {
  selectedIndex: number = 0;
  isFormValid: boolean = false;
  prevSelectedIndex: number = 0;

  steps: Step[] = [
    {
      completed: false,
    },
    {
      completed: false,
    },
    {
      completed: false,
    },
    {
      completed: false,
    },
  ];

  setStep(index: number) {
    if (index === this.selectedIndex) {
      return;
    }
    if (index === 0 || this.steps[index - 1].completed) {
      this.prevSelectedIndex = this.selectedIndex;
      this.selectedIndex = index;
    }
  }

  handleFormValid(valid: boolean) {
    this.isFormValid = valid;
    if (valid) {
      this.steps[this.selectedIndex].completed = true;
      this.prevSelectedIndex = this.selectedIndex;
      this.selectedIndex++;
    }
  }
}
