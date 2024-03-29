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
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Item } from 'src/app/pages/interface/item.interface';
import { ItemService } from 'src/app/pages/services/item.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-first-panel',
  templateUrl: './first-panel.component.html',
  styleUrls: ['./first-panel.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class FirstPanelComponent implements OnDestroy, OnInit {
  @ViewChild('instance', { static: true }) instance: NgbTypeahead | undefined;
  @ViewChild('dt') table: Table | undefined; // Reference to the Table component
  @Output() formValid = new EventEmitter<boolean>();

  private mediaDevices: MediaDeviceInfo[] = [];
  private cameraLabels: { [deviceId: string]: string } = {};
  private hasDevices: boolean | undefined;

  firstStepForm: FormGroup;
  courses!: Course[];

  availableCameras?: MediaDeviceInfo[];
  currentCamera: MediaDeviceInfo | undefined;
  hasPermission: boolean | undefined;

  hasScanned: boolean = false;
  scannerEnabled: boolean = false;
  scanSuccess: boolean = false;

  itemDialog: boolean = false;
  items!: Item[];
  item!: Item;
  selectedItem!: Item[] | null;
  submitted: boolean = false;
  statuses!: any[];

  selectedGroup: any; // Initialize this variable to null or undefined initially
  selectedClass: any;
  selectedProfessor: any;

  loading: boolean = false;
  activityValues: number[] = [0, 100];

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
    private courseService: CourseService,
    private itemService: ItemService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.firstStepForm = this.formService.firstStepForm;

    this.courseService.getCourses().then((courses) => {
      this.courses = courses;
    });
  }

  ngOnInit() {
    if (this.firstStepForm.valid) {
      this.hasScanned = true;
      this.scanSuccess = true;
    }

    this.itemService.getItems().then((data) => (this.items = data));

    this.statuses = [
      { label: 'INSTOCK', value: 'instock' },
      { label: 'LOWSTOCK', value: 'lowstock' },
      { label: 'OUTOFSTOCK', value: 'outofstock' },
    ];
  }

  clear(table: Table) {
    table.clear();
  }

  onGroupSelect(selectedGroup: any) {
    this.selectedGroup = selectedGroup;
    this.selectedClass = null; // Reset the value of selectedClass when group changes
    this.selectedProfessor = null; // Reset the value of selectedProfessor when group changes
    this.firstStepForm.get('class')?.reset(); // Reset the value of the class form control
    this.firstStepForm.get('professor')?.reset(); // Reset the value of the professor form control
  }

  onClassSelect(selectedClass: any) {
    this.selectedClass = selectedClass;
    this.selectedProfessor = null; // Reset the value of selectedProfessor when class changes
    this.firstStepForm.get('professor')?.reset(); // Reset the value of the professor form control
  }

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

  openNew() {
    this.item = {};
    this.submitted = false;
    this.itemDialog = true;
  }

  deleteSelectedItem() {
    if (this.selectedItem!.length > 1) {
      this.confirmationService.confirm({
        message:
          'Seguro que desea eliminar los ' +
          this.selectedItem?.length +
          ' equipos de la lista de solicitud?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.items = this.items.filter(
            (val) => !this.selectedItem?.includes(val)
          );
          this.selectedItem = null;
          this.messageService.add({
            severity: 'success',
            summary: 'Completado',
            detail: 'Equipos eliminados',
            life: 3000,
          });
        },
      });
    } else {
      this.deleteItem(this.selectedItem![0]);
    }
  }

  editItem(item: Item) {
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteItem(item: Item) {
    this.confirmationService.confirm({
      message:
        'Seguro que deseas eliminar el equipo "' +
        item.name +
        '" de la lista de solicitud?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.items = this.items.filter((val) => val.id !== item.id);
        this.item = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Completado',
          detail: 'Equipo eliminado',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.itemDialog = false;
    this.submitted = false;
  }

  saveItem() {
    this.submitted = true;

    if (this.item.name?.trim()) {
      if (this.item.id) {
        this.items[this.findIndexById(this.item.id)] = this.item;
        this.messageService.add({
          severity: 'success',
          summary: 'Completado',
          detail: 'Equipo actualizado',
          life: 3000,
        });
      } else {
        this.item.id = this.createId();
        this.item.image = 'item-placeholder.svg';
        this.items.push(this.item);
        this.messageService.add({
          severity: 'success',
          summary: 'Completado',
          detail: 'Equipo agregado a la lista',
          life: 3000,
        });
      }

      this.items = [...this.items];
      this.itemDialog = false;
      this.item = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
    }
    return '';
  }

  clearSelection() {
    this.selectedItem = null;
  }

  goToPreviousPage(): void {
    if (this.table!.first > 0) {
      this.table!.first -= this.table!.rows;
    }
  }

  resetTable(): void {
    this.table!.first = 0;
  }

  goToNextPage(): void {
    const totalPages = Math.ceil(this.table!.totalRecords / this.table!.rows);
    if (this.table!.first + this.table!.rows < this.table!.totalRecords) {
      this.table!.first += this.table!.rows;
    }
  }
}
