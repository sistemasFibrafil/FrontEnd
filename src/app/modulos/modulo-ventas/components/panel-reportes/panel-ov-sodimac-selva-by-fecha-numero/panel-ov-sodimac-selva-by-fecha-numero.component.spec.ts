import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelOrdenVentaSodimacSelvaByFechaNumeroComponent } from './panel-ov-sodimac-selva-by-fecha-numero.component';

describe('PanelOrdenVentaSodimacSelvaByFechaNumeroComponent', () => {
  let component: PanelOrdenVentaSodimacSelvaByFechaNumeroComponent;
  let fixture: ComponentFixture<PanelOrdenVentaSodimacSelvaByFechaNumeroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelOrdenVentaSodimacSelvaByFechaNumeroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelOrdenVentaSodimacSelvaByFechaNumeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
