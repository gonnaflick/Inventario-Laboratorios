import { Component, OnDestroy, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/pages/services/form.service';

@Component({
  selector: 'app-second-panel',
  templateUrl: './second-panel.component.html',
  styleUrls: ['./second-panel.component.css'],
})
export class SecondPanelComponent implements OnDestroy, OnInit {
  @Output() formValid = new EventEmitter<boolean>();

  private mediaDevices: MediaDeviceInfo[] = [];
  private cameraLabels: { [deviceId: string]: string } = {};
  private hasDevices: boolean | undefined;

  availableCameras?: MediaDeviceInfo[];
  currentCamera: MediaDeviceInfo | undefined;
  hasPermission: boolean | undefined;

  hasScanned: boolean = false;
  scannerEnabled: boolean = false;
  scanSuccess: boolean = false;

  secondStepForm: FormGroup;

  constructor(
    private formService: FormService
  ) {
    this.secondStepForm = this.formService.secondStepForm;
  }

  ngOnInit() {
    if (this.secondStepForm.valid) {
      this.hasScanned = true;
      this.scanSuccess = true;
    }
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
    if (!this.secondStepForm.valid) {
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
    this.secondStepForm.controls['scannedQR'].setValue(scannedQR);
    this.secondStepForm.get('scannedQR')?.setValidators(this.formService.validateScannedLink(scannedQR));
    this.secondStepForm.get('scannedQR')?.updateValueAndValidity();
    this.hasScanned = true; if (this.secondStepForm.get('scannedQR')?.valid) {
      this.scanSuccess = true;
      this.scannerEnabled = false;
    }
  }

  openLink() {
    window.open(this.secondStepForm.controls['scannedQR'].value, '_blank');
  }

  submitForm() {
    if (this.secondStepForm.valid) {
      this.formValid.emit(true);
      console.log(this.secondStepForm.valid);
    }
  }
}
@Component({
  selector: 'permission-null-dialog',
  templateUrl: './dialog/permission-null.html',
  standalone: true,
})
export class DialogPermissionNull { }

@Component({
  selector: 'permission-false-dialog',
  templateUrl: './dialog/permission-false.html',
  standalone: true,
})
export class DialogPermissionFalse { }

@Component({
  selector: 'permission-null-dialog',
  templateUrl: './dialog/device-undetermined.html',
  standalone: true,
})
export class DialogDeviceUndetermined { }

@Component({
  selector: 'permission-null-dialog',
  templateUrl: './dialog/device-false.html',
  standalone: true,
})
export class DialogDeviceFalse { }