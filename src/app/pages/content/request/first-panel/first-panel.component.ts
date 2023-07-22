import {
  Component,
  EventEmitter,
  ViewChild,
  Output,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormService } from 'src/app/pages/services/form.service';
import { CourseService } from 'src/app/pages/services/course.service';
import { Course } from 'src/app/pages/interface/course.interface';
import { SelectItemGroup } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { Observable, Subject, merge, OperatorFunction } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-first-panel',
  templateUrl: './first-panel.component.html',
  styleUrls: ['./first-panel.component.scss'],
})
export class FirstPanelComponent implements OnDestroy, OnInit {
  @ViewChild('instance', { static: true }) instance: NgbTypeahead | undefined;
  @Output() formValid = new EventEmitter<boolean>();

  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  firstStepForm: FormGroup;
  filteredCourses: SelectItemGroup[] = [];
  courses!: Course[];

  private mediaDevices: MediaDeviceInfo[] = [];
  private cameraLabels: { [deviceId: string]: string } = {};
  private hasDevices: boolean | undefined;

  availableCameras?: MediaDeviceInfo[];
  currentCamera: MediaDeviceInfo | undefined;
  hasPermission: boolean | undefined;

  hasScanned: boolean = false;
  scannerEnabled: boolean = false;
  scanSuccess: boolean = false;

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

  constructor(
    private formService: FormService,
    private courseService: CourseService
  ) {
    this.firstStepForm = this.formService.firstStepForm;
    this.courseService.getCourses().then((data) => (this.courses = data));
  }

  ngOnInit() {
    if (this.firstStepForm.valid) {
      this.hasScanned = true;
      this.scanSuccess = true;
    }
  }

  search: OperatorFunction<
    string,
    readonly { name: string; professor: string }[]
  > = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance?.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      filter((term) => term === '' || term.length >= 2),
      map((term) => {
        if (term === '') {
          return this.courses;
        } else {
          return this.courses
            .filter((course) =>
              course.name.toLowerCase().includes(term.toLowerCase())
            )
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

  ngOnDestroy() {
    this.cleanupCameraDetection();
  }

  private setupCameraDetection() {
    navigator.mediaDevices.addEventListener(
      'devicechange',
      this.updateCameraList.bind(this)
    );
    this.updateCameraList();
  }

  private cleanupCameraDetection() {
    navigator.mediaDevices.removeEventListener(
      'devicechange',
      this.updateCameraList.bind(this)
    );
  }

  updateCameraList() {
    setTimeout(() => {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices: MediaDeviceInfo[]) => {
          this.mediaDevices = devices.filter(
            (device) => device.kind === 'videoinput'
          );
          this.availableCameras = this.mediaDevices;
          this.hasDevices = this.mediaDevices.length > 0;

          const previousLabels = { ...this.cameraLabels };
          this.cameraLabels = {};

          for (const device of this.mediaDevices) {
            if (previousLabels[device.deviceId]) {
              this.cameraLabels[device.deviceId] =
                previousLabels[device.deviceId];
            } else {
              this.cameraLabels[device.deviceId] = device.label;
            }
          }

          if (
            this.currentCamera &&
            !this.mediaDevices.find(
              (device) => device.deviceId === this.currentCamera?.deviceId
            )
          ) {
            this.currentCamera = undefined;
          }
          console.log('Camera list updated.');
        })
        .catch((error: any) => {
          console.error('Failed to update camera list: ', error);
        });
    }, 1000);
  }

  onHasPermission(has: boolean) {
    if (!this.firstStepForm.valid) {
      if (has === false) {
        console.log('DialogPermissionFalse');
      } else if (has === true) {
        this.setupCameraDetection();
        console.log('Escanee el codigo QR de la credencial virtual del alumno');
        this.scannerEnabled = true;
      } else if (has === null && this.hasDevices === null) {
        console.log('DialogPermissionNull');
      }
    } else {
      this.scannerEnabled = false;
    }
    this.hasPermission = has;
  }

  onHasDevices(has: boolean) {
    this.hasDevices = has;
    if (has === false) {
      console.log('DialogDeviceFalse');
    } else if (has == undefined && this.hasPermission === null) {
      console.log('DialogDeviceUndetermined');
    }
  }

  onCameraSelectChange(selected: string) {
    const camera = this.availableCameras?.find((x) => x.deviceId === selected);
    this.currentCamera = camera || undefined;
  }

  getCameraLabel(camera: MediaDeviceInfo): string {
    return this.cameraLabels[camera.deviceId];
  }

  scanSuccessHandler(scannedQR: string): void {
    this.firstStepForm.controls['scannedQR'].setValue(scannedQR);
    this.hasScanned = true;
    if (this.firstStepForm.get('scannedQR')?.valid) {
      this.scanSuccess = true;
      this.scannerEnabled = false;
    }
  }

  openLink() {
    window.open(this.firstStepForm.controls['scannedQR'].value, '_blank');
  }

  submitForm() {
    if (this.firstStepForm.valid) {
      this.formValid.emit(true);
      console.log(this.firstStepForm.valid);
    }
  }
}
