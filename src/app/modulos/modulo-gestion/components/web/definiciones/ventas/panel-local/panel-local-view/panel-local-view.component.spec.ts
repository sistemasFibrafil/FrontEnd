import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelLocalViewComponent } from './panel-local-view.component';

describe('PanelLocalViewComponent', () => {
  let component: PanelLocalViewComponent;
  let fixture: ComponentFixture<PanelLocalViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelLocalViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelLocalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
