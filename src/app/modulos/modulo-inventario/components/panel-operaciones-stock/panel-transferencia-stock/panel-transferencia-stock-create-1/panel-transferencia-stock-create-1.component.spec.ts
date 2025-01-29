import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelPanelTransferenciaStockCreate1Component } from './panel-transferencia-stock-create-1.component';

describe('PanelPanelTransferenciaStockCreate1Component', () => {
  let component: PanelPanelTransferenciaStockCreate1Component;
  let fixture: ComponentFixture<PanelPanelTransferenciaStockCreate1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelPanelTransferenciaStockCreate1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelPanelTransferenciaStockCreate1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
