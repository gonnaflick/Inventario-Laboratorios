import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstPanelComponent } from './first-panel.component';

describe('FirstPanelComponent', () => {
  let component: FirstPanelComponent;
  let fixture: ComponentFixture<FirstPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FirstPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FirstPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
