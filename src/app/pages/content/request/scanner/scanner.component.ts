import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css'],
  standalone: true,
  imports: [ZXingScannerModule, NgFor, NgIf],
})
export class ScannerComponent {
  // Atributos relacionados con la cámara
  public qrSignature?: string;
  cameras: MediaDeviceInfo[] = [];
  myDevice!: MediaDeviceInfo;
  scannerEnabled = false;

  // Indica las camaras que se encontraron en el dispositivo
  camerasFoundHandler(cameras: MediaDeviceInfo[]) {
    this.cameras = cameras;
    this.selectCamera(this.cameras[0].label);
  }

  // En el caso que se haya escaneado un codigo exitosamente, ...
  scanSuccessHandler(event: any) {
    this.qrSignature = event;
    console.log(this.qrSignature);
    document.getElementById('qr-scanner')?.setAttribute('class', 'success');
    this.checkSignature();
    setTimeout(function () {
      document.getElementById('qr-scanner')?.setAttribute('class', 'error');
    }, 1000);
  }

  // Abre la opción para seleccionar una camara
  selectCamera(cameraLabel: any) {
    this.cameras.forEach((camera) => {
      if (camera.label.includes(cameraLabel)) {
        this.myDevice = camera;
        this.scannerEnabled = true;
      }
    });
  }

  checkSignature() {}
}
