import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourthPanelComponent } from './fourth-panel.component';

describe('FourthPanelComponent', () => {
  let component: FourthPanelComponent;
  let fixture: ComponentFixture<FourthPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourthPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FourthPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
