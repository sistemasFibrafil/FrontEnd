import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';
import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';

import { ISedeSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/inventario/sede-sap.interface';
import { IMovimientoStockByFechaSede } from '../../../interfaces/articulo-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { SedeSapService } from 'src/app/modulos/modulo-gestion/services/sap/definiciones/inventario/sede-sap.service';
import { ArticuloSapService } from '../../../services/sap/articulo-sap.service';



interface ITipoMovimiento
{
  codTipoMovimiento: string;
  nomTipoMovimiento: string;
}

@Component({
  selector: 'app-inv-panel-movimiento-stock-by-fecha-sede',
  templateUrl: './panel-movimiento-stock-by-fecha-sede.component.html',
  styleUrls: ['./panel-movimiento-stock-by-fecha-sede.component.css']
})
export class PanelMovimientoStockByFechaSedeComponent implements OnInit, OnDestroy {
  modeloForm: FormGroup;
  subscription: Subscription;

  // Titulo del componente
  titulo = 'Reporte - Movimientos de Stock';
  subtitulo = 'Movimientos de Stock';
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  // Opcion Buscar
  isDisplay: boolean = false;

  sedeList: SelectItem[];
  tipoMovimientoList: SelectItem[];

  sedeSelected: ISedeSap[];
  tipoMovimientoSelected: ITipoMovimiento[];

  lista: ITipoMovimiento[];
  reporteList: IMovimientoStockByFechaSede[];

  params: FilterRequestModel = new FilterRequestModel();

  columnas: any[];

  fecha: string = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
  nombreArchivo: string = 'Movimientos de Stock -' + this.fecha;

  constructor
  (
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    public lenguageService: LanguageService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private sedeSapService: SedeSapService,
    private articuloSapService: ArticuloSapService
  ) {}

  ngOnInit() {

    this.modeloForm = this.fb.group(
      {
        'dat1'              : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
        'dat2'              : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
        'msSede'            : new FormControl('', Validators.compose([Validators.required])),
        'msTipoMovimiento'  : new FormControl('', Validators.compose([Validators.required])),
        'text1'             : new FormControl(''),
      }
    );

    // Iniciamos el acceso a las opciones con la que cuenta el usuario
    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-inv-panel-movimiento-stock-by-fecha-sede');

    this.columnas = [
      { field: 'nomTipoMovimiento', header: 'Tipo de movimiento' },
      { field: 'numeroGuiaSAP', header: 'Número de Guía SAP' },
      { field: 'numeroGuiaSUNAT', header: 'Número de Guía SUNAT' },
      { field: 'docDate', header: 'Fecha de Guía' },
      { field: 'cardCode', header: 'Código de Cliente' },
      { field: 'cardName', header: 'Nombre de Cliente' },
      { field: 'usuario', header: 'Usuario' },
      { field: 'itemCode', header: 'Código de Artículo' },
      { field: 'itemName', header: 'Nombre de Artículo' },
      { field: 'sede', header: 'Sede' },
      { field: 'centroCosto', header: 'Centro de Costo' },
      { field: 'almacenOrigen', header: 'Almacén de Origen' },
      { field: 'almacenDestino', header: 'Almacén de Destino' },
      { field: 'bulto', header: 'Bulto' },
      { field: 'totalKg', header: 'Total Kg' },
      { field: 'unidadMedida', header: 'UM' },
      { field: 'Quantity', header: 'Cantidad' },
      { field: 'numeroPedido', header: 'Número de Pedido' },
      { field: 'fechaPedido', header: 'Fecha de Pedido' },
      { field: 'numeroFacturaSAP', header: 'Número de Factura SAP' },
      { field: 'numeroFacturaSUNAT', header: 'Número de Factura SUNAT' },
      { field: 'nomTransportista', header: 'Nombre de Transportista' },
      { field: 'rucTransportista', header: 'RUC de Transportista' },
      { field: 'placaTransportista', header: 'Placa de Transportista' },
      { field: 'nomConductor', header: 'Nombre de Conductor' },
      { field: 'lincenciaConductor', header: 'Licencia de Conductor' },
    ];

    this.lista =
    [
      {codTipoMovimiento: '01', nomTipoMovimiento: 'Salida x ventas' },
      {codTipoMovimiento: '02', nomTipoMovimiento: 'Salida x inventario' },
      {codTipoMovimiento: '03', nomTipoMovimiento: 'Salida x producción' },
      {codTipoMovimiento: '04', nomTipoMovimiento: 'Entrada x compras' },
      {codTipoMovimiento: '05', nomTipoMovimiento: 'Entrada x inventario' },
      {codTipoMovimiento: '06', nomTipoMovimiento: 'Entrada x producción' },
      {codTipoMovimiento: '07', nomTipoMovimiento: 'Transferencia entre almacenes' }
    ];

    this.getListSede();
    this.getListTipoMovimiento();
  }

  getListSede() {
    const params: any = { text1: '' };
    this.sedeSapService.getListByFiltro(params)
    .subscribe({next:(data: ISedeSap[]) =>{
        this.sedeList = [];
        this.sedeSelected = [];

        for (let item of data) {
          this.sedeSelected.push({ code: item.code, location: item.location });
          this.sedeList.push({ label: item.location, value: { code: item.code, location: item.location } });
        }
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  getListTipoMovimiento() {
    this.tipoMovimientoList = [];
    this.tipoMovimientoSelected = [];

    for (let item of this.lista) {
      this.tipoMovimientoSelected.push({ codTipoMovimiento: item.codTipoMovimiento, nomTipoMovimiento: item.nomTipoMovimiento });
      this.tipoMovimientoList.push({ label: item.nomTipoMovimiento, value: { codTipoMovimiento: item.codTipoMovimiento, nomTipoMovimiento: item.nomTipoMovimiento } });
    }
  }

  onToBuscar() {
    this.onListar();
  }

  onSetParametro()
  {
    this.params = this.modeloForm.getRawValue();
    this.params.cod1 = this.sedeSelected.map(x=> x.code).join(",");;
    this.params.cod2 = this.tipoMovimientoSelected.map(x=> x.codTipoMovimiento).join(",");
  }

  onListar() {
    this.isDisplay = true;
    this.onSetParametro();
    this.articuloSapService.getListMovimientoStockByFechaSede(this.params)
    .subscribe({next:(data: IMovimientoStockByFechaSede[]) =>{
        this.isDisplay = false;
        this.reporteList = data;
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
    this.articuloSapService.getMovimientoStockExcelByFechaSede(this.params)
    .subscribe({next:(response: any) => {
        saveAs(
          new Blob([response],
          {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
          this.nombreArchivo
        );
        this.isDisplay = false;
        this.swaCustomService.swaMsgExito(null);
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
