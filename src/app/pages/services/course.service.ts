import { Injectable } from '@angular/core';

@Injectable()
export class CourseService {
  getCoursesData() {
    return [
      {
        id: '1',
        name: '8HW1 - Circuitos Electronicos',
        professor: 'Jesus Jimenez',
      },
      {
        id: '2',
        name: '6HW1 - Circuitos Logicos II',
        professor: 'Alex Hernandez',
      },
    ];
  }

  getCourses() {
    return Promise.resolve(this.getCoursesData());
  }
}
