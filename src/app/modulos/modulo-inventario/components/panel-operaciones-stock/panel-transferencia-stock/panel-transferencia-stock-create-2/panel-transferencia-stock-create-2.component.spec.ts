import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelPanelTransferenciaStockCreate2Component } from './panel-transferencia-stock-create-2.component';

describe('PanelPanelTransferenciaStockCreate2Component', () => {
  let component: PanelPanelTransferenciaStockCreate2Component;
  let fixture: ComponentFixture<PanelPanelTransferenciaStockCreate2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelPanelTransferenciaStockCreate2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelPanelTransferenciaStockCreate2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
