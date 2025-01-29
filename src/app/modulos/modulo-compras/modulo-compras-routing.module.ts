import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PanelSolicitdCompraListComponent } from './components/panel-solicitud-compra/panel-solicitud-compra-list/panel-solicitud-compra-list.component';
import { PanelSolicitudCompraCreateComponent } from './components/panel-solicitud-compra/panel-solicitud-compra-create/panel-solicitud-compra-create.component';


const ROUTES: Routes =
[
  { path: 'panel-solicitud-compra-list',                                 data: { breadcrumb: 'Lectura' },                                        component: PanelSolicitdCompraListComponent },
  { path: 'panel-solicitud-compra-create',                               data: { breadcrumb: 'Lectura' },                                        component: PanelSolicitudCompraCreateComponent },
];

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class ComprasRoutingModule {}
