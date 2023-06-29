import { Component } from '@angular/core';
import { Step } from '../../interface/step.interface';

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
      label: 'Datos del solicitante',
      originalIcon: 'person',
      icon: 'person',
      completed: false,
    },
    {
      label: 'Escanear código QR',
      originalIcon: 'qr_code_scanner',
      icon: 'qr_code_scanner',
      completed: false,
    },
    {
      label: 'Selección de equipo',
      originalIcon: 'shelves',
      icon: 'shelves',
      completed: false,
    },
    {
      label: 'Confirmar solicitud',
      originalIcon: 'assignment',
      icon: 'assignment',
      completed: false,
    },
  ];

  stepStatusMessages: { [key: string]: string } = {
    success: 'Completado',
    edit: 'En edición',
    'in-progress': 'En progreso',
    pending: 'Pendiente',
    waiting: 'En espera',
  };

  setStep(index: number) {
    if (index === this.selectedIndex) {
      return;
    }
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
        step.icon = 'edit';
      } else if (index === this.selectedIndex && !step.completed) {
        step.icon = step.originalIcon;
      } else if (step.completed) {
        step.icon = 'done';
      } else {
        step.icon = step.originalIcon;
      }
    });
  }

  getStepStatus(step: Step): string {
    if (step.completed) {
      if (this.steps.indexOf(step) < this.prevSelectedIndex && step.completed) {
        return 'edit';
      } else if (step.completed) {
        return 'success';
      }
    } else {
      if (this.selectedIndex === this.steps.indexOf(step)) {
        return 'in-progress';
      } else if (this.prevSelectedIndex < this.steps.indexOf(step)) {
        return 'pending';
      } else {
        return 'waiting';
      }
    }
    return '';
  }

  getStepClass(step: Step, type: string): string {
    const stepStatus = this.getStepStatus(step);
    return stepStatus !== '' ? `step-${type} ${stepStatus}` : `step-${type}`;
  }
}
