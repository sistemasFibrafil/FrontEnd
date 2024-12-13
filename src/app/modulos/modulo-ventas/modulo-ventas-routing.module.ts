import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PanelOrdenVentaCreateComponent } from './components/panel-orden-venta/panel-orden-venta-create/panel-orden-venta-create.component';
import { PanelOrdenVentaListComponent } from './components/panel-orden-venta/panel-orden-venta-list/panel-orden-venta-list.component';

import { PanelSodimacOrdenVentaListComponent } from './components/panel-sodimac/panel-sodimac-ov/panel-sodimac-ov-list/panel-sodimac-ov-list.component';
import { PanelSodimacOrdenVentaCreateComponent } from './components/panel-sodimac/panel-sodimac-ov/panel-sodimac-ov-create/panel-sodimac-ov-create.component';
import { PanelSodimacOrdenVentaViewComponent } from './components/panel-sodimac/panel-sodimac-ov/panel-sodimac-ov-view/panel-sodimac-ov-view.component';

import { PanelSodimacPalletListComponent } from './components/panel-sodimac/panel-sodimac-pallet/panel-sodimac-pallet-list/panel-sodimac-pallet-list.component';
import { PanelSodimacPalletAsignacionComponent } from './components/panel-sodimac/panel-sodimac-pallet/panel-sodimac-pallet-asignacion/panel-sodimac-pallet-asignacion.component';
import { PanelSodimacDetalladoPalletViewComponent } from './components/panel-sodimac/panel-sodimac-pallet/panel-sodimac-detallado-pallet-view/panel-sodimac-detallado-pallet-view.component';
import { PanelSodimacDetalladoEanViewComponent } from './components/panel-sodimac/panel-sodimac-pallet/panel-sodimac-detallado-ean-view/panel-sodimac-detallado-ean-view.component';

import { PanelEntregaListComponent } from './components/panel-entrega/panel-entrega-list/panel-entrega-list.component';
import { PanelEntregaViewComponent } from './components/panel-entrega/panel-entrega-view/panel-entrega-view.component';
import { PanelEntregaCreateComponent } from './components/panel-entrega/panel-entrega-create/panel-entrega-create.component';
import { PanelEntregaUpdateComponent } from './components/panel-entrega/panel-entrega-update/panel-entrega-update.component';

import { PanelForcastListComponent } from './components/panel-forcast/panel-forcast-list/panel-forcast-list.component';
import { PanelForcastCreateComponent } from './components/panel-forcast/panel-forcast-create/panel-forcast-create.component';
import { PanelForcastUpdateComponent } from './components/panel-forcast/panel-forcast-update/panel-forcast-update.component';

import { PanelOrdenVentaProgramcionByFechaComponent } from './components/panel-reportes/panel-ov-programacion-by-fecha/panel-ov-programacion-by-fecha.component';
import { PanelOrdenVentaSeguimientoByFechaComponent } from './components/panel-reportes/panel-ov-seguimiento-by-fecha/panel-ov-seguimiento-by-fecha.component';
import { PanelOrdenVentaSeguimientoDetalladoByFechaComponent } from './components/panel-reportes/panel-ov-seguimiento-detallado-by-fecha/panel-ov-seguimiento-detallado-by-fecha.component';
import { PanelOrdenVentaPendienteStockAlmaProdByFechaComponent } from './components/panel-reportes/panel-ov-pendiente-stock-alma-prod-by-fecha/panel-ov-pendiente-stock-alma-prod-by-fecha.component';

import { PanelOrdenVentaSodimacByFechaNumeroComponent } from './components/panel-reportes/panel-ov-sodimac-by-fecha-numero/panel-ov-sodimac-by-fecha-numero.component';
import { PanelOrdenVentaSodimacOrienteByFechaNumeroComponent } from './components/panel-reportes/panel-ov-sodimac-oriente-by-fecha-numero/panel-ov-sodimac-oriente-by-fecha-numero.component';

import { PanelVentaByFechaComponent } from './components/panel-reportes/panel-venta-by-fecha/panel-venta-by-fecha.component';
import { PanelFacturaVentaByFechaComponent } from './components/panel-reportes/panel-fv-venta-by-fecha/panel-factura-venta-by-fecha.component';
import { PanelVentaResumenByFechaGrupoComponent } from './components/panel-reportes/panel-venta-resumen-by-fecha-grupo/panel-venta-resumen-by-fecha-grupo.component';


const routes: Routes = [
  { path: 'panel-orden-venta-list',                             data: { breadcrumb: 'Órden de Venta' }, component: PanelOrdenVentaListComponent },
  { path: 'panel-orden-venta-create',                           data: { breadcrumb: 'Órden de Venta' }, component: PanelOrdenVentaCreateComponent },

  { path: 'panel-sodimac-ov-list',                              data: { breadcrumb: 'Orden de Venta' }, component: PanelSodimacOrdenVentaListComponent },
  { path: 'panel-sodimac-ov-create',                            data: { breadcrumb: 'Orden de Venta' }, component: PanelSodimacOrdenVentaCreateComponent },
  { path: 'panel-sodimac-ov-view/:id',                          data: { breadcrumb: 'Orden de Venta' }, component: PanelSodimacOrdenVentaViewComponent },

  { path: 'panel-sodimac-pallet-list',                          data: { breadcrumb: 'Pallet' }, component: PanelSodimacPalletListComponent },
  { path: 'panel-sodimac-pallet-asignacion',                    data: { breadcrumb: 'Pallet' }, component: PanelSodimacPalletAsignacionComponent },
  { path: 'panel-sodimac-detallado-pallet-view/:id',            data: { breadcrumb: 'Detallado - Pallet' }, component: PanelSodimacDetalladoPalletViewComponent },
  { path: 'panel-sodimac-detallado-ean-view/:id',               data: { breadcrumb: 'Detallado - Ean' }, component: PanelSodimacDetalladoEanViewComponent },

  { path: 'panel-entrega-list',                                 data: { breadcrumb: 'Entrega' }, component: PanelEntregaListComponent },
  { path: 'panel-entrega-view/:id',                             data: { breadcrumb: 'Entrega' }, component: PanelEntregaViewComponent },
  { path: 'panel-entrega-create/:type/:id',                     data: { breadcrumb: 'Entrega' }, component: PanelEntregaCreateComponent },
  { path: 'panel-entrega-update/:id',                           data: { breadcrumb: 'Entrega' }, component: PanelEntregaUpdateComponent },

  { path: 'panel-forcast-list',                                 data: { breadcrumb: 'Proyección de Venta' }, component: PanelForcastListComponent },
  { path: 'panel-forcast-create',                               data: { breadcrumb: 'Proyección de Venta' }, component: PanelForcastCreateComponent },
  { path: 'panel-forcast-update/:id',                           data: { breadcrumb: 'Proyección de Venta' }, component: PanelForcastUpdateComponent },

  { path: 'panel-ov-seguimiento-by-fecha',                      data: { breadcrumb: 'Reporte - Órdenes de Venta - Seguimiento' }, component: PanelOrdenVentaSeguimientoByFechaComponent },
  { path: 'panel-ov-programacion-by-fecha',                     data: { breadcrumb: 'Reporte - Órdenes de Venta - Programación' }, component: PanelOrdenVentaProgramcionByFechaComponent },
  { path: 'panel-ov-seguimiento-detallado-by-fecha',            data: { breadcrumb: 'Reporte - Órdenes de Venta - Seguimiento Detallado' }, component: PanelOrdenVentaSeguimientoDetalladoByFechaComponent },
  { path: 'panel-ov-pendiente-stock-alma-prod-by-fecha',        data: { breadcrumb: 'Reporte - Órdenes de Venta - Pendientes - Stock de Almacenes de Produccíon' }, component: PanelOrdenVentaPendienteStockAlmaProdByFechaComponent },

  { path: 'panel-ov-sodimac-by-fecha-numero',                   data: { breadcrumb: 'Reporte - Despacho de Sodimac- Fecha - Número' }, component: PanelOrdenVentaSodimacByFechaNumeroComponent },
  { path: 'panel-ov-sodimac-oriente-by-fecha-numero',             data: { breadcrumb: 'Reporte - Despacho de Sodimac Selva- Fecha - Número' }, component: PanelOrdenVentaSodimacOrienteByFechaNumeroComponent },

  { path: 'panel-venta-by-fecha',                               data: { breadcrumb: 'Reporte - Ventas-fecha' }, component: PanelVentaByFechaComponent },
  { path: 'panel-factura-venta-by-fecha',                       data: { breadcrumb: 'Reporte - Facturas de Venta' }, component: PanelFacturaVentaByFechaComponent },
  { path: 'panel-venta-resumen-by-fecha-grupo',                 data: { breadcrumb: 'Reporte - Ventas - Resumido' }, component: PanelVentaResumenByFechaGrupoComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VentasRoutingModule {}
