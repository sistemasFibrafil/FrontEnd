import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSolicitdTraladoListComponent } from './panel-solicitud-traslado-list.component';

describe('PanelSolicitdTraladoListComponent', () => {
  let component: PanelSolicitdTraladoListComponent;
  let fixture: ComponentFixture<PanelSolicitdTraladoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelSolicitdTraladoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelSolicitdTraladoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
