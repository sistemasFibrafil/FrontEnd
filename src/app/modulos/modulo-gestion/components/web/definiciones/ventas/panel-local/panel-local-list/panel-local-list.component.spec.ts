import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelLocalListComponent } from './panel-local-list.component';

describe('PanelLocalListComponent', () => {
  let component: PanelLocalListComponent;
  let fixture: ComponentFixture<PanelLocalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelLocalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelLocalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
