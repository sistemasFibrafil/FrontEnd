import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelLocalCreateComponent } from './panel-local-create.component';

describe('PanelLocalCreateComponent', () => {
  let component: PanelLocalCreateComponent;
  let fixture: ComponentFixture<PanelLocalCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelLocalCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelLocalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
