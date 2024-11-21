import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CompartidoModule } from '../modulo-compartido/modulo-compartido.module';
import { GestionPrimeNgModule } from './modulo-gestion-primeng.module';
import { GestionRoutingModule } from './modulo-gestion-routing.module';

import { PanelLocalListComponent } from './components/web/definiciones/ventas/panel-local/panel-local-list/panel-local-list.component';
import { PanelLocalCreateComponent } from './components/web/definiciones/ventas/panel-local/panel-local-create/panel-local-create.component';
import { PanelLocalUpdateComponent } from './components/web/definiciones/ventas/panel-local/panel-local-update/panel-local-update.component';
import { PanelLocalViewComponent } from './components/web/definiciones/ventas/panel-local/panel-local-view/panel-local-view.component';
import { PanelSedeCreateComponent } from './components/web/definiciones/inventario/panel-sede/panel-sede-create/panel-sede-create.component';
import { PanelSerieNumeracionCreateComponent } from './components/web/inicializacion-sistema/panel-serie-numeracion/panel-serie-numeracion-create/panel-serie-numeracion-create.component';

@NgModule({
    declarations:
    [
      PanelLocalListComponent,
      PanelLocalCreateComponent,
      PanelLocalUpdateComponent,
      PanelLocalViewComponent,

      PanelSedeCreateComponent,
      PanelSerieNumeracionCreateComponent
    ],
    imports:
    [
      CommonModule,
      GestionPrimeNgModule,
      GestionRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      CompartidoModule
    ],
    exports: [],
    providers: [],
})
export class GestionModule {}
