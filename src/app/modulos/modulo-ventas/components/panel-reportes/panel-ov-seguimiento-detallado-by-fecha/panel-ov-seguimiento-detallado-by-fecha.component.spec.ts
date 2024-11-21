import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelOrdenVentaSeguimientoDetalladoByFechaComponent } from './panel-ov-seguimiento-detallado-by-fecha.component';

describe('PanelOrdenVentaSeguimientoDetalladoByFechaComponent', () => {
  let component: PanelOrdenVentaSeguimientoDetalladoByFechaComponent;
  let fixture: ComponentFixture<PanelOrdenVentaSeguimientoDetalladoByFechaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelOrdenVentaSeguimientoDetalladoByFechaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelOrdenVentaSeguimientoDetalladoByFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
