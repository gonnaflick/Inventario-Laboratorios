import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css'],
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

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private _snackBar: MatSnackBar, public dialog: MatDialog) {}

  openDialog(htmlDialog: any) {
    const dialogRef = this.dialog.open(htmlDialog);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
    this.setupCameraDetection();
  }

  ngOnDestroy() {
    this.cleanupCameraDetection();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
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
      this.openDialog(DialogPermissionFalse);
    } else if (has === true) {
      this.openSnackBar(
        'Escanee el codigo QR de la credencial virtual del alumno',
        'Cerrar'
      );
    } else if (has === null && this.hasDevices === null) {
      this.openDialog(DialogPermissionNull);
    }
  }

  onHasDevices(has: boolean) {
    this.hasDevices = has;
    if (has === false) {
      this.openDialog(DialogDeviceFalse);
    } else if (has == undefined && this.hasPermission === null) {
      this.openDialog(DialogDeviceUndetermined);
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

@Component({
  selector: 'permission-null-dialog',
  templateUrl: './dialog/permission-null.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogPermissionNull {}

@Component({
  selector: 'permission-false-dialog',
  templateUrl: './dialog/permission-false.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogPermissionFalse {}

@Component({
  selector: 'permission-null-dialog',
  templateUrl: './dialog/device-undetermined.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogDeviceUndetermined {}

@Component({
  selector: 'permission-null-dialog',
  templateUrl: './dialog/device-false.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogDeviceFalse {}
