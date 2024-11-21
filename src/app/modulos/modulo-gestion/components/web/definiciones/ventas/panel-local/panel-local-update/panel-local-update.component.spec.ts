import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelLocalUpdateComponent } from './panel-local-update.component';

describe('PanelLocalUpdateComponent', () => {
  let component: PanelLocalUpdateComponent;
  let fixture: ComponentFixture<PanelLocalUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelLocalUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelLocalUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
