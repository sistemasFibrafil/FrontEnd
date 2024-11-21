import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';

import { IVentaByFecha } from 'src/app/modulos/modulo-ventas/interfaces/factura-venta.interface';
import { IEmpleadoVentaSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/general/empleado-venta.interface';
import { EmpleadoVentaSapService } from 'src/app/modulos/modulo-gestion/services/sap/definiciones/general/empleado-venta-sap.service';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { FacturaVentaService } from '../../../services/sap/factura-venta-sap.service';



@Component({
  selector: 'app-ven-panel-venta-by-fecha',
  templateUrl: './panel-venta-by-fecha.component.html',
  styleUrls: ['./panel-venta-by-fecha.component.css']
})
export class PanelVentaByFechaComponent implements OnInit, OnDestroy {
  modeloForm: FormGroup;
  subscription: Subscription;

  // Titulo del componente
  titulo = 'Reporte - Ventas';
  subtitulo = 'Ventas';
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  // Opcion Buscar
  isDisplay: boolean = false;

  empleadoVentaList: SelectItem[];
  empleadoVentaSelected: IEmpleadoVentaSap[];
  reporteList: IVentaByFecha[];
  findModel: FilterRequestModel = new FilterRequestModel();

  fecha: string = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
  nombreArchivo: string = 'Ventas - ' + this.fecha;


  constructor
  (
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    public lenguageService: LanguageService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private facturaVentaService: FacturaVentaService,
    private empleadoVentaSapService: EmpleadoVentaSapService
  ) {}

  ngOnInit() {
    this.modeloForm = this.fb.group(
      {
        'dat1'                : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
        'dat2'                : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
        'msEmpleadoVentaSap'  : new FormControl('', Validators.compose([Validators.required])),
        'text1'               : new FormControl(''),
      });

    // Iniciamos el acceso a las opciones con la que cuenta el usuario
    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-ven-panel-venta-by-fecha');

    this.getListEmpleadoVenta();
  }

  getListEmpleadoVenta() {
    this.empleadoVentaSapService.getList()
    .subscribe({next:(data: IEmpleadoVentaSap[]) =>{
        this.empleadoVentaList = [];
        this.empleadoVentaSelected = [];

        for (let item of data) {
          this.empleadoVentaSelected.push({ slpCode: item.slpCode, slpName: item.slpName });
          this.empleadoVentaList.push({ label: item.slpName, value: { slpCode: item.slpCode, slpName: item.slpName } });
        }
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onToBuscar() {
    this.onListar();
  }

  onSetParametro()
  {
    this.findModel = this.modeloForm.getRawValue();
    this.findModel.cod1 = this.empleadoVentaSelected.map(x=> x.slpCode).join(",");;
  }

  onListar() {
    this.isDisplay = true;
    this.reporteList = [];
    this.onSetParametro();
    this.facturaVentaService.getListVentaByFechaAndSlpCode(this.findModel)
    .subscribe({next:(data: IVentaByFecha[]) =>{
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
    this.facturaVentaService.getListVentaExcelByFechaAndSlpCode(this.findModel)
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
