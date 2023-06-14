import { Component, OnInit, OnDestroy } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css'],
  standalone: true,
  imports: [
    ZXingScannerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    CommonModule,
  ],
})
export class ScannerComponent implements OnInit, OnDestroy {
  private qrSignature?: string;
  private mediaDevices: MediaDeviceInfo[] = [];
  private cameraLabels: { [deviceId: string]: string } = {};

  availableCameras?: MediaDeviceInfo[];
  currentCamera: MediaDeviceInfo | undefined;
  hasDevices: boolean | undefined;
  hasPermission: boolean | undefined;

  scannerEnabled = false;

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
    console.log(has);
  }

  camerasNotFoundHandler() {
    console.log('No cameras found.');
  }

  onCameraSelectChange(selected: string) {
    const camera = this.availableCameras?.find((x) => x.deviceId === selected);
    this.currentCamera = camera || undefined;
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

  getCameraLabel(camera: MediaDeviceInfo): string {
    return this.cameraLabels[camera.deviceId];
  }
}
