import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelOrdenVentaSeguimientoByFechaComponent } from './panel-ov-seguimiento-by-fecha.component';

describe('PanelOrdenVentaSeguimientoByFechaComponent', () => {
  let component: PanelOrdenVentaSeguimientoByFechaComponent;
  let fixture: ComponentFixture<PanelOrdenVentaSeguimientoByFechaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelOrdenVentaSeguimientoByFechaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelOrdenVentaSeguimientoByFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
