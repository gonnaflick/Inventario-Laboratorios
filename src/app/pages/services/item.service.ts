import { Injectable } from '@angular/core';

@Injectable()
export class ItemService {
  getItemsData() {
    return [
      {
        id: '1000',
        brand: 'LANIX',
        folio: '1',
        name: 'Multimetro',
        description:
          'Herramienta para medir voltaje, corriente y resistencia eléctrica.',
        image: 'multimeter.png',
        quantity: 4,
        category: 'Medicion',
        inventoryStatus: 'En inventario',
      },
      {
        id: '1001',
        brand: 'HP',
        folio: '1',
        name: 'Fuente de voltaje',
        description:
          'Dispositivo que suministra energía eléctrica con una tensión específica.',
        image: 'psu.png',
        quantity: 0,
        category: 'Suministro',
        inventoryStatus: 'Agotado',
      },
      {
        id: '1002',
        brand: 'ACER',
        folio: '2',
        name: 'Osiloscopio',
        description:
          'Dispositivo para visualizar y analizar señales eléctricas en el dominio del tiempo.',
        image: 'oscilloscope.png',
        quantity: 1,
        category: 'Medicion',
        inventoryStatus: 'Queda solo 1',
      },
    ];
  }

  getItems() {
    return Promise.resolve(this.getItemsData());
  }
}
