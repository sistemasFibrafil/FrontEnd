import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PanelLecturaListComponent } from './components/panel-operaciones-stock/panel-lectura/panel-lectura-list/panel-lectura-list.component';
import { PanelLecturaCreateComponent } from './components/panel-operaciones-stock/panel-lectura/panel-lectura-create/panel-lectura-create.component';

import { PanelSolicitdTraladoListComponent } from './components/panel-operaciones-stock/panel-solicitud-traslado/panel-solicitud-traslado-list/panel-solicitud-traslado-list.component';
import { PanelSolicitudTrasladoCreateComponent } from './components/panel-operaciones-stock/panel-solicitud-traslado/panel-solicitud-traslado-create/panel-solicitud-traslado-create.component';
import { PanelSolicitudTrasladoViewComponent } from './components/panel-operaciones-stock/panel-solicitud-traslado/panel-solicitud-traslado-view/panel-solicitud-traslado-view.component';

import { PanelPanelTransferenciaStockListComponent } from './components/panel-operaciones-stock/panel-transferencia-stock/panel-transferencia-stock-list/panel-transferencia-stock-list.component';
import { PanelPanelTransferenciaStockCreateComponent } from './components/panel-operaciones-stock/panel-transferencia-stock/panel-transferencia-stock-create/panel-transferencia-stock-create.component';
import { PanelPanelTransferenciaStockUpdateComponent } from './components/panel-operaciones-stock/panel-transferencia-stock/panel-transferencia-stock-update/panel-transferencia-stock-update.component';

import { PanelStockGeneralByAlmacenComponent } from './components/panel-reportes/panel-stock-general-by-almacen/panel-stock-general-by-almacen.component';
import { PanelMovimientoStockByFechaSedeComponent } from './components/panel-reportes/panel-movimiento-stock-by-fecha-sede/panel-movimiento-stock-by-fecha-sede.component';
import { PanelArticuloByGrupoSubGrupoFiltroComponent } from './components/panel-reportes/panel-articulo-by-grupo-sub-grupo-filtro/panel-articulo-by-grupo-sub-grupo-filtro.component';
import { PanelArticuloVentaByGrupoSubGrupoEstadoComponent } from './components/panel-reportes/panel-articulo-venta-by-grupo-sub-grupo-estado/panel-articulo-venta-by-grupo-sub-grupo-estado.component';
import { PanelStockArticuloVentaByGrupoSubGrupoComponent } from './components/panel-reportes/panel-stock-articulo-venta-by-grupo-sub-grupo/panel-stock-articulo-venta-by-grupo-sub-grupo.component';
import { PanelStockGeneralDetalladoAlmacenByAlmacenComponent } from './components/panel-reportes/panel-stock-general-detallado-almacen-by-almacen/panel-stock-general-detallado-almacen-by-almacen.component';
import { PanelSolicitudTrasladoUpdateComponent } from './components/panel-operaciones-stock/panel-solicitud-traslado/panel-solicitud-traslado-update/panel-solicitud-traslado-update.component';


const ROUTES: Routes =
[
  { path: 'panel-lectura-list',                                 data: { breadcrumb: 'Lectura' },                                        component: PanelLecturaListComponent },
  { path: 'panel-lectura-create',                               data: { breadcrumb: 'Lectura' },                                        component: PanelLecturaCreateComponent },

  { path: 'panel-solicitud-traslado-list',                      data: { breadcrumb: 'Solicitud de Traslado' },                          component: PanelSolicitdTraladoListComponent },
  { path: 'panel-solicitud-traslado-create',                    data: { breadcrumb: 'Solicitud de Traslado' },                          component: PanelSolicitudTrasladoCreateComponent },
  { path: 'panel-solicitud-traslado-update/:id',                data: { breadcrumb: 'Solicitud de Traslado' },                          component: PanelSolicitudTrasladoUpdateComponent },
  { path: 'panel-solicitud-traslado-view/:id',                  data: { breadcrumb: 'Solicitud de Traslado' },                          component: PanelSolicitudTrasladoViewComponent },

  { path: 'panel-transferencia-stock-list',                     data: { breadcrumb: 'Transferencia de Stock' },                         component: PanelPanelTransferenciaStockListComponent },
  { path: 'panel-transferencia-stock-create/:json',             data: { breadcrumb: 'Transferencia de Stock' },                         component: PanelPanelTransferenciaStockCreateComponent },
  { path: 'panel-transferencia-stock-update/:id',               data: { breadcrumb: 'Transferencia de Stock' },                         component: PanelPanelTransferenciaStockUpdateComponent },

  { path: 'panel-stock-general-by-almacen',                     data: { breadcrumb: 'Reporte - Stock General' },                        component: PanelStockGeneralByAlmacenComponent },
  { path: 'panel-movimiento-stock-by-fecha-sede',               data: { breadcrumb: 'Reporte - Movimientos de Stock' },                 component: PanelMovimientoStockByFechaSedeComponent },
  { path: 'panel-articulo-venta-by-grupo-sub-grupo-estado',     data: { breadcrumb: 'Reporte - Artículos de Venta' },                   component: PanelArticuloVentaByGrupoSubGrupoEstadoComponent },
  { path: 'panel-stock-articulo-venta-by-grupo-sub-grupo',      data: { breadcrumb: 'Reporte - Stock de Artículos de Venta' },          component: PanelStockArticuloVentaByGrupoSubGrupoComponent },
  { path: 'panel-articulo-by-grupo-sub-grupo-filtro',           data: { breadcrumb: 'Reporte - Artículos - Grupo - SubGrupo' },         component: PanelArticuloByGrupoSubGrupoFiltroComponent },
  { path: 'panel-stock-general-detallado-almacen-by-almacen',   data: { breadcrumb: 'Reporte - Stock General Detallado por Almacén' },  component: PanelStockGeneralDetalladoAlmacenByAlmacenComponent},
];

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class InventarioRoutingModule {}
