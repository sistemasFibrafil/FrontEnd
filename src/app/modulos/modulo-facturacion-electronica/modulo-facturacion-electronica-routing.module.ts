import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PanelGuiaListComponent } from './components/panel-guia/panel-guia-list/panel-guia-list.component';
import { PanelGuiaInternaListComponent } from './components/panel-guía-interna/panel-guía-interna-list/panel-guia-interna-list.component';

const ROUTES: Routes = [
    { path: 'panel-guia-list', data: { breadcrumb: 'Lista de guías' }, component: PanelGuiaListComponent },
    { path: 'panel-guia-interna-list', data: { breadcrumb: 'Lista de guías internas' }, component: PanelGuiaInternaListComponent },
];

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class FacturacionElectronicaRoutingModule {}
