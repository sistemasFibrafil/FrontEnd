import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaCarteraVencidaByFechaComponent } from './cobranza-cartera-vencida-by-fecha-corte.component';

describe('CobranzaCarteraVencidaByFechaComponent', () => {
  let component: CobranzaCarteraVencidaByFechaComponent;
  let fixture: ComponentFixture<CobranzaCarteraVencidaByFechaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaCarteraVencidaByFechaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaCarteraVencidaByFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
