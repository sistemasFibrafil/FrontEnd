import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelGuiaInternaListComponent } from './panel-guia-interna-list.component';

describe('PanelGuiaInternaListComponent', () => {
  let component: PanelGuiaInternaListComponent;
  let fixture: ComponentFixture<PanelGuiaInternaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelGuiaInternaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelGuiaInternaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
