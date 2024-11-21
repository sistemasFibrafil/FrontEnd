import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSerieNumeracionCreateComponent } from './panel-serie-numeracion-create.component';

describe('PanelSerieNumeracionCreateComponent', () => {
  let component: PanelSerieNumeracionCreateComponent;
  let fixture: ComponentFixture<PanelSerieNumeracionCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelSerieNumeracionCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelSerieNumeracionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
