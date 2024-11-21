import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FacturacionElectronicaPrimeNgModule } from './modulo-facturacion-electronica-primeng.module';
import { FacturacionElectronicaRoutingModule } from './modulo-facturacion-electronica-routing.module';

import { CompartidoModule } from '../modulo-compartido/modulo-compartido.module';

import { PanelGuiaListComponent } from './components/panel-guia/panel-guia-list/panel-guia-list.component';
import { PanelGuiaInternaListComponent } from './components/panel-guía-interna/panel-guía-interna-list/panel-guia-interna-list.component';

@NgModule({
    declarations:
    [
      PanelGuiaListComponent,
      PanelGuiaInternaListComponent
    ],
    imports:
    [
      CommonModule,
      FacturacionElectronicaPrimeNgModule,
      FacturacionElectronicaRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      CompartidoModule
    ],
    exports: [],
    providers: [],
})
export class FacturacionElectronicaModule {}
