import { Injectable } from '@angular/core';

@Injectable()
export class ItemService {
  getItemsData() {
    return [
      {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Multimetro',
        description:
          'Herramienta para medir voltaje, corriente y resistencia eléctrica.',
        image: 'multimeter.png',
        quantity: 4,
        category: ['Dispositivo', 'Medicion', 'Pruebas'],
        inventoryStatus: 'En inventario',
      },
      {
        id: '1001',
        code: 'nvklal433',
        name: 'Fuente de voltaje',
        description:
          'Dispositivo que suministra energía eléctrica con una tensión específica.',
        image: 'psu.png',
        quantity: 0,
        category: ['Dispositivo', 'Suministro', 'Pruebas'],
        inventoryStatus: 'Agotado',
      },
      {
        id: '1002',
        code: 'zz21cz3c1',
        name: 'Osiloscopio',
        description:
          'Dispositivo para visualizar y analizar señales eléctricas en el dominio del tiempo.',
        image: 'oscilloscope.png',
        quantity: 1,
        category: ['Dispositivo', 'Medicion', 'Señales'],
        inventoryStatus: 'Queda solo 1',
      },
    ];
  }

  getItems() {
    return Promise.resolve(this.getItemsData());
  }
}
