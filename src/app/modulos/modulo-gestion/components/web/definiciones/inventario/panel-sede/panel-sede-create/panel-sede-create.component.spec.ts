import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSedeCreateComponent } from './panel-sede-create.component';

describe('PanelSedeCreateComponent', () => {
  let component: PanelSedeCreateComponent;
  let fixture: ComponentFixture<PanelSedeCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelSedeCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelSedeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
