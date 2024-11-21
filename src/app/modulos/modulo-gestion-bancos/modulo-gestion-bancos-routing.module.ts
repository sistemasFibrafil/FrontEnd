import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PanelCobranzaCarteraVencidaByFechaComponent } from './components/panel-reportes/panel-cobranza-cartera-vencida-by-fecha-corte/panel-cobranza-cartera-vencida-by-fecha-corte.component';


const ROUTES: Routes = [
  { path: 'panel-cobranza-cartera-vencida-by-fecha-corte', data: { breadcrumb: 'Reporte - Cobranza de Carteras Vencidas' }, component: PanelCobranzaCarteraVencidaByFechaComponent },
];

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class GestionBancosRoutingModule {}
