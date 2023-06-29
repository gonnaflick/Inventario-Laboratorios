import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-second-panel',
  templateUrl: './second-panel.component.html',
  styleUrls: ['./second-panel.component.css'],
})
export class SecondPanelComponent implements OnInit, OnDestroy {
  private qrSignature?: string;
  private mediaDevices: MediaDeviceInfo[] = [];
  private cameraLabels: { [deviceId: string]: string } = {};

  availableCameras?: MediaDeviceInfo[];
  currentCamera: MediaDeviceInfo | undefined;
  hasDevices: boolean | undefined;
  hasPermission: boolean | undefined;

  scannerEnabled = false;

  constructor() {}

  ngOnInit() {
    this.setupCameraDetection();
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
            this.cameraLabels[device.deviceId] =
              device.label ||
              'Camara ' + (Object.keys(this.cameraLabels).length + 1);
          }
        }
        if (
          this.currentCamera &&
          !this.mediaDevices.find(
            (device) => device.deviceId === this.currentCamera?.deviceId
          )
        ) {
          this.currentCamera = undefined;
          this.scannerEnabled = false;
        }

        console.log('Camera list updated.');
      })
      .catch((error: any) => {
        console.error('Failed to update camera list:', error);
      });
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
    if (has === false) {
      console.log('DialogPermissionFalse');
    } else if (has === true) {
      console.log('Escanee el codigo QR de la credencial virtual del alumno');
    } else if (has === null && this.hasDevices === null) {
      console.log('DialogPermissionNull');
    }
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

  checkSignature() {
    console.log(this.qrSignature);
  }

  scanSuccessHandler(event: any) {
    this.qrSignature = event;
    document.getElementById('qr-scanner')?.setAttribute('class', 'success');
    this.checkSignature();
    setTimeout(function () {
      document.getElementById('qr-scanner')?.setAttribute('class', 'error');
    }, 1000);
  }
}
