import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSolicitudTrasladoUpdateComponent } from './panel-solicitud-traslado-update.component';

describe('PanelSolicitudTrasladoUpdateComponent', () => {
  let component: PanelSolicitudTrasladoUpdateComponent;
  let fixture: ComponentFixture<PanelSolicitudTrasladoUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelSolicitudTrasladoUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelSolicitudTrasladoUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
