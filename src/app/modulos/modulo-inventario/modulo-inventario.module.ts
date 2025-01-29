import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { InventarioPrimeNgModule } from './modulo-inventario-primeng.module';
import { InventarioRoutingModule } from './modulo-inventario-routing.module';
import { CompartidoModule } from '../modulo-compartido/modulo-compartido.module';

import { PanelLecturaListComponent } from './components/panel-operaciones-stock/panel-lectura/panel-lectura-list/panel-lectura-list.component';
import { PanelLecturaCreateComponent } from './components/panel-operaciones-stock/panel-lectura/panel-lectura-create/panel-lectura-create.component';

import { PanelSolicitdTraladoListComponent } from './components/panel-operaciones-stock/panel-solicitud-traslado/panel-solicitud-traslado-list/panel-solicitud-traslado-list.component';
import { PanelSolicitudTrasladoCreateComponent } from './components/panel-operaciones-stock/panel-solicitud-traslado/panel-solicitud-traslado-create/panel-solicitud-traslado-create.component';
import { PanelSolicitudTrasladoUpdateComponent } from './components/panel-operaciones-stock/panel-solicitud-traslado/panel-solicitud-traslado-update/panel-solicitud-traslado-update.component';
import { PanelSolicitudTrasladoViewComponent } from './components/panel-operaciones-stock/panel-solicitud-traslado/panel-solicitud-traslado-view/panel-solicitud-traslado-view.component';

import { PanelPanelTransferenciaStockListComponent } from './components/panel-operaciones-stock/panel-transferencia-stock/panel-transferencia-stock-list/panel-transferencia-stock-list.component';
import { PanelPanelTransferenciaStockCreate1Component } from './components/panel-operaciones-stock/panel-transferencia-stock/panel-transferencia-stock-create-1/panel-transferencia-stock-create-1.component';
import { PanelPanelTransferenciaStockCreate2Component } from './components/panel-operaciones-stock/panel-transferencia-stock/panel-transferencia-stock-create-2/panel-transferencia-stock-create-2.component';
import { PanelPanelTransferenciaStockUpdateComponent } from './components/panel-operaciones-stock/panel-transferencia-stock/panel-transferencia-stock-update/panel-transferencia-stock-update.component';

import { PanelStockGeneralByAlmacenComponent } from './components/panel-reportes/panel-stock-general-by-almacen/panel-stock-general-by-almacen.component';
import { PanelMovimientoStockByFechaSedeComponent } from './components/panel-reportes/panel-movimiento-stock-by-fecha-sede/panel-movimiento-stock-by-fecha-sede.component';
import { PanelArticuloByGrupoSubGrupoFiltroComponent } from './components/panel-reportes/panel-articulo-by-grupo-sub-grupo-filtro/panel-articulo-by-grupo-sub-grupo-filtro.component';
import { PanelStockArticuloVentaByGrupoSubGrupoComponent } from './components/panel-reportes/panel-stock-articulo-venta-by-grupo-sub-grupo/panel-stock-articulo-venta-by-grupo-sub-grupo.component';
import { PanelArticuloVentaByGrupoSubGrupoEstadoComponent } from './components/panel-reportes/panel-articulo-venta-by-grupo-sub-grupo-estado/panel-articulo-venta-by-grupo-sub-grupo-estado.component';
import { PanelStockGeneralDetalladoAlmacenByAlmacenComponent } from './components/panel-reportes/panel-stock-general-detallado-almacen-by-almacen/panel-stock-general-detallado-almacen-by-almacen.component';


@NgModule({
    declarations:
    [
      PanelLecturaListComponent,
      PanelLecturaCreateComponent,

      PanelSolicitdTraladoListComponent,
      PanelSolicitudTrasladoCreateComponent,
      PanelSolicitudTrasladoUpdateComponent,
      PanelSolicitudTrasladoViewComponent,

      PanelPanelTransferenciaStockListComponent,
      PanelPanelTransferenciaStockCreate1Component,
      PanelPanelTransferenciaStockCreate2Component,
      PanelPanelTransferenciaStockUpdateComponent,

      PanelStockGeneralByAlmacenComponent,
      PanelMovimientoStockByFechaSedeComponent,
      PanelArticuloByGrupoSubGrupoFiltroComponent,
      PanelStockArticuloVentaByGrupoSubGrupoComponent,
      PanelArticuloVentaByGrupoSubGrupoEstadoComponent,
      PanelStockGeneralDetalladoAlmacenByAlmacenComponent,
    ],
    imports:
    [
      CommonModule,
      InventarioPrimeNgModule,
      InventarioRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      CompartidoModule
    ],
    exports: [],
    providers: [],
})
export class InventarioModule {}
