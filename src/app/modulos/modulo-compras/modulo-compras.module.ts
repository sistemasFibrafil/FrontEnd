import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ComprasPrimeNgModule } from './modulo-compras-primeng.module';
import { ComprasRoutingModule } from './modulo-compras-routing.module';
import { CompartidoModule } from '../modulo-compartido/modulo-compartido.module';

import { PanelSolicitdCompraListComponent } from './components/panel-solicitud-compra/panel-solicitud-compra-list/panel-solicitud-compra-list.component';
import { PanelSolicitudCompraCreateComponent } from './components/panel-solicitud-compra/panel-solicitud-compra-create/panel-solicitud-compra-create.component';


@NgModule({
    declarations:
    [
      PanelSolicitdCompraListComponent,
      PanelSolicitudCompraCreateComponent
    ],
    imports:
    [
      CommonModule,
      ComprasRoutingModule,
      ComprasPrimeNgModule,
      FormsModule,
      ReactiveFormsModule,
      CompartidoModule
    ],
    exports: [],
    providers: [],
})
export class ComprasModule {}
