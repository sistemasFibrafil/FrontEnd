import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelVentaByFechaComponent } from './panel-venta-by-fecha.component';

describe('PanelVentaByFechaComponent', () => {
  let component: PanelVentaByFechaComponent;
  let fixture: ComponentFixture<PanelVentaByFechaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelVentaByFechaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelVentaByFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
