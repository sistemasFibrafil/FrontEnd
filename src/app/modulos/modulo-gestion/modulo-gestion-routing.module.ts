import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PanelLocalListComponent } from './components/web/definiciones/ventas/panel-local/panel-local-list/panel-local-list.component';
import { PanelLocalUpdateComponent } from './components/web/definiciones/ventas/panel-local/panel-local-update/panel-local-update.component';
import { PanelLocalViewComponent } from './components/web/definiciones/ventas/panel-local/panel-local-view/panel-local-view.component';
import { PanelLocalCreateComponent } from './components/web/definiciones/ventas/panel-local/panel-local-create/panel-local-create.component';
import { PanelSedeCreateComponent } from './components/web/definiciones/inventario/panel-sede/panel-sede-create/panel-sede-create.component';
import { PanelSerieNumeracionCreateComponent } from './components/web/inicializacion-sistema/panel-serie-numeracion/panel-serie-numeracion-create/panel-serie-numeracion-create.component';

const ROUTES: Routes =
[
  { path: 'panel-local-list',       data: { breadcrumb: 'Local' }, component: PanelLocalListComponent },
  { path: 'panel-local-create',     data: { breadcrumb: 'Local' }, component: PanelLocalCreateComponent },
  { path: 'panel-local-update/:id', data: { breadcrumb: 'Local' }, component: PanelLocalUpdateComponent },
  { path: 'panel-local-view/:id',   data: { breadcrumb: 'Local' }, component: PanelLocalViewComponent },

  { path: 'panel-serie-numeracion-create',      data: { breadcrumb: 'Serie - Numeración' }, component: PanelSerieNumeracionCreateComponent },
  { path: 'panel-sede-create',                  data: { breadcrumb: 'Sede' }, component: PanelSedeCreateComponent },
];

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class GestionRoutingModule {}
