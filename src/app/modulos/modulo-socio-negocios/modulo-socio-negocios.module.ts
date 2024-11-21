import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SocioNegociosRoutingNgModule } from './modulo-socio-negocios-routing.module';
import { SocioNegociosPrimeNgModule } from './modulo-socio-negocios-primeng.module';

import { CompartidoModule } from '../modulo-compartido/modulo-compartido.module';

import { PanelClienteBySectorEstadoComponent } from './components/panel-reportes/panel-cliente-by-sector-estado/panel-cliente-by-sector-estado.component';


@NgModule({
    declarations:
    [
      PanelClienteBySectorEstadoComponent,
    ],
    imports:
    [
      CommonModule,
      SocioNegociosPrimeNgModule,
      SocioNegociosRoutingNgModule,
      FormsModule,
      ReactiveFormsModule,
      CompartidoModule
    ],
    exports: [],
    providers: [],
})
export class SocioNegociosModule {}
