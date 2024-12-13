import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelPanelTransferenciaStockUpdateComponent } from './panel-transferencia-stock-update.component';

describe('PanelPanelTransferenciaStockUpdateComponent', () => {
  let component: PanelPanelTransferenciaStockUpdateComponent;
  let fixture: ComponentFixture<PanelPanelTransferenciaStockUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelPanelTransferenciaStockUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelPanelTransferenciaStockUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
