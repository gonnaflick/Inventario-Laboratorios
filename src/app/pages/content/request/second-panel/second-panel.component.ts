import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/pages/services/form.service';
import { DataViewLayoutOptions } from 'primeng/dataview';
import { Item } from 'src/app/pages/interface/item.interface';
import { ItemService } from 'src/app/pages/services/item.service';

@Component({
  selector: 'app-second-panel',
  templateUrl: './second-panel.component.html',
  styleUrls: ['./second-panel.component.css'],
})
export class SecondPanelComponent {
  @Output() formValid = new EventEmitter<boolean>();

  layout: string = 'list';

  item!: Item[];

  secondStepForm: FormGroup;

  constructor(formService: FormService, private itemService: ItemService) {
    this.secondStepForm = formService.secondStepForm;
  }

  ngOnInit() {
    this.itemService.getItems().then((data) => (this.item = data.slice(0, 12)));
  }

  getSeverity(item: Item) {
    switch (item.inventoryStatus) {
      case 'En inventario':
        return 'success';

      case 'Queda solo 1':
        return 'warning';

      case 'Agotado':
        return 'danger';

      default:
        return '';
    }
  }

  submitForm() {
    if (this.secondStepForm.valid) {
      this.formValid.emit(true);
      console.log(this.secondStepForm.valid);
    }
  }
}
