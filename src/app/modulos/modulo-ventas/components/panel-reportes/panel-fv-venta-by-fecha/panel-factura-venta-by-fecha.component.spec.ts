import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelFacturaVentaByFechaComponent } from './panel-factura-venta-by-fecha.component';

describe('PanelFacturaVentaByFechaComponent', () => {
  let component: PanelFacturaVentaByFechaComponent;
  let fixture: ComponentFixture<PanelFacturaVentaByFechaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelFacturaVentaByFechaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelFacturaVentaByFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
