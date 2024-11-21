import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';

import { IFacturaVentaByFecha } from 'src/app/modulos/modulo-ventas/interfaces/factura-venta.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { FacturaVentaService } from '../../../services/sap/factura-venta-sap.service';



@Component({
  selector: 'app-ven-panel-factura-venta-by-fecha',
  templateUrl: './panel-factura-venta-by-fecha.component.html',
  styleUrls: ['./panel-factura-venta-by-fecha.component.css']
})
export class PanelFacturaVentaByFechaComponent implements OnInit, OnDestroy {
  modeloForm: FormGroup;
  subscription: Subscription;

  // Titulo del componente
  titulo = 'Reporte - Facturas de Venta';
  subtitulo = 'Facturas de Venta';
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  // Opcion Buscar
  columnas: any[];
  isDisplay: boolean = false;
  reporteList: IFacturaVentaByFecha[];
  params: FilterRequestModel = new FilterRequestModel();

  fecha: string = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
  nombreArchivo: string = 'Facturas de Venta -';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    public lenguageService: LanguageService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private facturaVentaService: FacturaVentaService) {}

  ngOnInit() {
    this.modeloForm = this.fb.group(
    {
      'dat1'      : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'dat2'      : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'text1'     : new FormControl(''),
    });

    this.columnas = [
      { field: 'cardName', header: 'Nombre de Cliente' },
      { field: 'fecContabilizacion', header: 'Fecha de Contabilización' },
      { field: 'fecVencimiento', header: 'Fecha de Vencimiento' },
      { field: 'diaVencido', header: 'Días Vencidas' },
      { field: 'numeroDocumento', header: 'Número de Factura' },
      { field: 'nomVendedor', header: 'Vendedor' },
      { field: 'codMoneda', header: 'Moneda' },
      { field: 'total', header: 'Total' },
      { field: 'cobrado', header: 'Cobrado' },
      { field: 'saldo', header: 'Saldo' },
    ];

    // Iniciamos el acceso a las opciones con la que cuenta el usuario
    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-ven-panel-factura-venta-by-fecha');
  }

  onToBuscar() {
    this.onListar();
  }

  onSetParametro()
  {
    this.params = this.modeloForm.getRawValue();
  }

  onListar() {
    this.isDisplay = true;
    this.reporteList = [];
    this.onSetParametro();
    this.subscription = new Subscription();
    this.subscription = this.facturaVentaService.getListFacturaVentaByFecha(this.params)
    .subscribe({next:(data: IFacturaVentaByFecha[]) =>{
      if(data)
      {
        this.isDisplay = false;
        this.reporteList = data;
      }
      this.isDisplay = false;
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onToExcel() {
    this.isDisplay = true;
    this.onSetParametro();
    this.subscription = new Subscription();
    this.subscription = this.facturaVentaService.getListFacturaVentaExcelByFecha(this.params)
    .subscribe((response: any) => {
      saveAs(
        new Blob([response],
        {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
        this.nombreArchivo + this.fecha
      );
      this.isDisplay = false;
      this.swaCustomService.swaMsgExito(null);
    },
    (error) => {
      this.isDisplay = false;
      this.swaCustomService.swaMsgError(error.error.resultadoDescripcion);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
