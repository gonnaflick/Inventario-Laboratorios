import { Component } from '@angular/core';

interface Step {
  label: string;
  icon: string;
  completed: boolean;
  originalIcon: string;
  animationClass: string;
}

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css'],
})
export class RequestComponent {
  steps: Step[] = [
    {
      label: 'Datos del solicitante',
      icon: 'person',
      completed: false,
      originalIcon: 'person',
      animationClass: '',
    },
    {
      label: 'Escaneo de QR',
      icon: 'qr_code_scanner',
      completed: false,
      originalIcon: 'qr_code_scanner',
      animationClass: '',
    },
    {
      label: 'Seleccion de equipo',
      icon: 'shelves',
      completed: false,
      originalIcon: 'shelves',
      animationClass: '',
    },
    {
      label: 'Resumen y confirmacion',
      icon: 'content_paste_search',
      completed: false,
      originalIcon: 'content_paste_search',
      animationClass: '',
    },
  ];

  selectedIndex: number = 0;
  isFormValid: boolean = false;
  prevSelectedIndex: number = 0;

  setStep(index: number) {
    if (index === 0 || this.steps[index - 1].completed) {
      this.prevSelectedIndex = this.selectedIndex;
      this.selectedIndex = index;
      this.updateStepIcons();
    }
  }

  handleFormValid(valid: boolean) {
    this.isFormValid = valid;
    if (valid) {
      this.steps[this.selectedIndex].completed = true;
      this.prevSelectedIndex = this.selectedIndex;
      this.selectedIndex++;
      this.updateStepIcons();
    }
  }

  updateStepIcons() {
    this.steps.forEach((step, index) => {
      if (index < this.prevSelectedIndex && step.completed) {
        step.icon = 'arrow_forward';
        step.animationClass = 'icon-modify-animation';
      } else if (index === this.selectedIndex && !step.completed) {
        step.icon = step.originalIcon;
        step.animationClass = 'icon-select-animation';
      } else if (step.completed) {
        step.icon = 'done';
        step.animationClass = 'icon-complete-animation';
      } else {
        step.icon = step.originalIcon;
        step.animationClass = '';
      }
    });
  }
}
