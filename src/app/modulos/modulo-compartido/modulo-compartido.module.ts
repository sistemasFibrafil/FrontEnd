import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { CompartidoPrimeNgModule } from './modulo-compartido-primeng.module';

import { BtnSalirComponent } from './components/btn-salir/btn-salir.component';
import { PanelObtenerComponent } from './components/panel-obtener/panel-obtener.component';
import { PanelGuardarComponent } from './components/panel-guardar/panel-guardar.component';
import { PanelImportarComponent } from './components/panel-importar/panel-importar.component';
import { PanelCerrarComponent } from './components/panel-cerrar/panel-cerrar.component';
import { PanelEliminarComponent } from './components/panel-eliminar/panel-eliminar.component';
import { PanelCancelarComponent } from './components/panel-cancelar/panel-cancelar.component';
import { ModalVisorPdfComponent } from './components/modal-visor-pdf/modal-visor-pdf.component';

import { ModalFileImportComponent } from './components/web/modal/modal-file-import/modal-file-import.component';
import { BusquedaFormularioComponent } from './components/web/busqueda/busqueda-formulario/busqueda-formulario.component';
import { ModalTipoDocumentoComponent } from './components/web/modal/modal-tipo-documento/modal-tipo-documento.component';
import { ModalSerieDocumentoComponent } from './components/web/modal/modal-serie-documento/modal-serie-documento.component';
import { ModalSodimacOvPendienteComponent } from './components/web/modal/modal-sodimac-ov-pendiente/modal-sodimac-ov-pendiente.component';

import { BusquedaSedeSapComponent } from './components/sap/busqueda/busqueda-sede-sap/busqueda-sede-sap.component';
import { BusquedaAlmacenSapComponent } from './components/sap/busqueda/busqueda-almacen-sap/busqueda-almacen-sap.component';
import { BusquedaArticuloSapComponent } from './components/sap/busqueda/busqueda-articulo-sap/busqueda-articulo-sap.component';
import { BusquedaImpuestoSapComponent } from './components/sap/busqueda/busqueda-impuesto-sap/busqueda-impuesto-sap.component';
import { BusquedaAlmacenStockSapComponent } from './components/sap/busqueda/busqueda-almacen-stock-sap/busqueda-almacen-stock-sap.component';
import { BusquedaTipoOperacionSapComponent } from './components/sap/busqueda/busqueda-tipo-operacion-sap/busqueda-tipo-operacion-sap.component';
import { BusquedaSerieNumeracionSapComponent } from './components/sap/busqueda/busqueda-serie-numeracion-sap/busqueda-serie-numeracion-sap.component';

import { ModalMonedaSapComponent } from './components/sap/modal/modal-moneda-sap/modal-moneda-sap.component';
import { ModalAlmacenSapComponent } from './components/sap/modal/modal-almacen-sap/modal-almacen-sap.component';
import { ModalVehiculoSapComponent } from './components/sap/modal/modal-vehiculo-sap/modal-vehiculo-sap.component';
import { ModalArticuloSapComponent } from './components/sap/modal/modal-articulo-sap/modal-articulo-sap.component';
import { ModalConductorSapComponent } from './components/sap/modal/modal-conductor-sap/modal-conductor-sap.component';
import { ModalCondicionPagSapComponent } from './components/sap/modal/modal-condicion-pago-sap/modal-condicion-pago-sap.component';
import { ModalSocioNegocioSapComponent } from './components/sap/modal/modal-socio-negocio-sap/modal-socio-negocio-sap.component';
import { ModalEmpleadoVentaSapComponent } from './components/sap/modal/modal-empleado-venta-sap/modal-empleado-venta-sap.component';
import { ModalPersonaContactoSapComponent } from './components/sap/modal/modal-persona-contacto-sap/modal-persona-contacto-sap.component';
import { ModalSodimacOvPendienteSapComponent } from './components/sap/modal/modal-sodimac-ov-pendiente-sap/modal-sodimac-ov-pendiente-sap.component';
import { ModalTablaDefinidaUsuarioSapComponent } from './components/sap/modal/modal-tabla-definida-usuario-sap/modal-tabla-definida-usuario-sap.component';
import { ModalDireccionSocioNegocioSapComponent } from './components/sap/modal/modal-socio-negocio-direccion-sap/modal-socio-negocio-direccion-sap.component';



@NgModule({
    declarations: [
      BtnSalirComponent,
      PanelObtenerComponent,
      PanelGuardarComponent,
      PanelImportarComponent,
      PanelCerrarComponent,
      PanelEliminarComponent,
      PanelCancelarComponent,
      ModalVisorPdfComponent,

      ModalFileImportComponent,
      BusquedaFormularioComponent,
      ModalTipoDocumentoComponent,
      ModalSerieDocumentoComponent,
      ModalSodimacOvPendienteComponent,

      BusquedaSedeSapComponent,
      BusquedaAlmacenSapComponent,
      BusquedaArticuloSapComponent,
      BusquedaImpuestoSapComponent,
      BusquedaAlmacenStockSapComponent,
      BusquedaTipoOperacionSapComponent,
      BusquedaSerieNumeracionSapComponent,

      ModalMonedaSapComponent,
      ModalAlmacenSapComponent,
      ModalVehiculoSapComponent,
      ModalArticuloSapComponent,
      ModalConductorSapComponent,
      ModalCondicionPagSapComponent,
      ModalSocioNegocioSapComponent,
      ModalEmpleadoVentaSapComponent,
      ModalPersonaContactoSapComponent,
      ModalSodimacOvPendienteSapComponent,
      ModalTablaDefinidaUsuarioSapComponent,
      ModalDireccionSocioNegocioSapComponent,
    ],
    imports: [
      RouterOutlet,
      CommonModule,
      CompartidoPrimeNgModule,
      FormsModule,
      ReactiveFormsModule,
      NgxDocViewerModule
    ],
    exports: [
      BtnSalirComponent,
      PanelObtenerComponent,
      PanelGuardarComponent,
      PanelImportarComponent,
      PanelCerrarComponent,
      PanelEliminarComponent,
      PanelCancelarComponent,
      ModalVisorPdfComponent,

      ModalFileImportComponent,
      BusquedaFormularioComponent,
      ModalTipoDocumentoComponent,
      ModalSerieDocumentoComponent,
      ModalSodimacOvPendienteComponent,

      BusquedaSedeSapComponent,
      BusquedaAlmacenSapComponent,
      BusquedaArticuloSapComponent,
      BusquedaImpuestoSapComponent,
      BusquedaAlmacenStockSapComponent,
      BusquedaTipoOperacionSapComponent,
      BusquedaSerieNumeracionSapComponent,

      ModalMonedaSapComponent,
      ModalAlmacenSapComponent,
      ModalVehiculoSapComponent,
      ModalArticuloSapComponent,
      ModalConductorSapComponent,
      ModalCondicionPagSapComponent,
      ModalSocioNegocioSapComponent,
      ModalEmpleadoVentaSapComponent,
      ModalPersonaContactoSapComponent,
      ModalSodimacOvPendienteSapComponent,
      ModalTablaDefinidaUsuarioSapComponent,
      ModalDireccionSocioNegocioSapComponent,
    ],
    providers: [ ],
    schemas: [
     CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class CompartidoModule {}
