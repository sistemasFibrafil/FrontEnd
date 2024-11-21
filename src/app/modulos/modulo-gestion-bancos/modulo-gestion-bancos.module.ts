import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { GestionBancosPrimeNgModule } from './modulo-gestion-bancos-primeng.module';
import { GestionBancosRoutingModule } from './modulo-gestion-bancos-routing.module';

import { CompartidoModule } from '../modulo-compartido/modulo-compartido.module';

import { PanelCobranzaCarteraVencidaByFechaComponent } from './components/panel-reportes/panel-cobranza-cartera-vencida-by-fecha-corte/panel-cobranza-cartera-vencida-by-fecha-corte.component';


@NgModule({
    declarations:
    [
      PanelCobranzaCarteraVencidaByFechaComponent
    ],
    imports:
    [
      CommonModule,
      GestionBancosPrimeNgModule,
      GestionBancosRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      CompartidoModule
    ],
    exports: [],
    providers: [],
})
export class GestionBancosModule {}
