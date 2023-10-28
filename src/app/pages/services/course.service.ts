import { Injectable } from '@angular/core';
import { Course } from '../interface/course.interface';

@Injectable()
export class CourseService {
  private coursesData: Course[] = [
    {
      id: '1',
      group: '7HW1',
      class: 'Circuitos Electronicos',
      professor: 'Jesus Jimenez',
    },
    {
      id: '2',
      group: '9HW2',
      class: 'Circuitos Logicos II',
      professor: 'Jesus Jimenez',
    },
    {
      id: '3',
      group: '8HW1',
      class: 'Calculo Avanzado',
      professor: 'Pepe Joel',
    },
    {
      id: '4',
      group: '8HW1',
      class: 'Calculo Avanzado',
      professor: 'Pepe Joel',
    },
    {
      id: '5',
      group: '8HW1',
      class: 'Calculo Avanzado',
      professor: 'Pepe Joel',
    },
  ];

  getCourses() {
    return Promise.resolve(this.coursesData);
  }
}
