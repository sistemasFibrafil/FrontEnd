import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelLecturaCreateComponent } from './panel-lectura-create.component';

describe('PanelLecturaCreateComponent', () => {
  let component: PanelLecturaCreateComponent;
  let fixture: ComponentFixture<PanelLecturaCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelLecturaCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelLecturaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
