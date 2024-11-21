import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelLecturaListComponent } from './panel-lectura-list.component';

describe('PanelLecturaListComponent', () => {
  let component: PanelLecturaListComponent;
  let fixture: ComponentFixture<PanelLecturaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelLecturaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelLecturaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
