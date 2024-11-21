import { saveAs } from 'file-saver';
import { SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';

import { IGrupoSocioNegocioSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/socio-negocios/grupo-socio-negocio.interface';
import { IOrdenVentaSeguimientoDetalladoByFecha } from '../../../interfaces/orden-venta-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { GrupoSocionegocioSapService } from 'src/app/modulos/modulo-gestion/services/sap/definiciones/socio-negocios/grupo-socio-negocio-sap.service';
import { OrdenVentaSapService } from '../../../services/sap/orden-venta-sap.service';



interface ITipoDocumento {
  codTipDocumento: string;
  nomTipDocumento: string;
}

interface IStatus {
  codStatus: string;
  nomStatus: string;
}


@Component({
  selector: 'app-ven-panel-ov-seguimiento-detallado-by-fecha',
  templateUrl: './panel-ov-seguimiento-detallado-by-fecha.component.html',
  styleUrls: ['./panel-ov-seguimiento-detallado-by-fecha.component.css']
})
export class PanelOrdenVentaSeguimientoDetalladoByFechaComponent implements OnInit {
  modeloForm: FormGroup;

  // Titulo del componente
  titulo = 'Reporte - Órdenes de Venta - Seguimiento Detallado';
  subtitulo = 'Órdenes de Venta - Seguimiento Detallado';
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  // Opcion Buscar
  isDisplay: boolean = false;
  tipDocumentoList: SelectItem[];
  grupoClienteSapList: SelectItem[];
  grupoClienteSelected: IGrupoSocioNegocioSap[];
  tipDocumentoItem: ITipoDocumento[];
  tipDocumentoSelected: ITipoDocumento[];
  statusItem: IStatus[];
  statusList: SelectItem[];
  statusSelected: IStatus[];
  reporteList: IOrdenVentaSeguimientoDetalladoByFecha[];
  params: FilterRequestModel = new FilterRequestModel();

  fecha: string = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
  nombreArchivo: string = 'Órdenes de Venta - Seguimiento Detallado - ' + this.fecha;

  constructor
  (
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    public lenguageService: LanguageService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private ordenVentaSapService: OrdenVentaSapService,
    private grupoSocionegocioSapService: GrupoSocionegocioSapService
  ) {}

  ngOnInit() {
    this.onBuildForm();
    this.getListGrupoAll();
    this.getTipoDocumento();
    this.getStatus();
  }

  onBuildForm() {
    this.modeloForm = this.fb.group(
    {
        'dat1'            : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
        'dat2'            : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
        'msGrupoCliente'  : new FormControl('', Validators.compose([Validators.required])),
        'msTipDocumento'  : new FormControl('', Validators.compose([Validators.required])),
        'msStatus'        : new FormControl('', Validators.compose([Validators.required])),
        'text1'           : new FormControl(''),
    });

    // Iniciamos el acceso a las opciones con la que cuenta el usuario
    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-ven-panel-ov-seguimiento-detallado-by-fecha');
  }

  getListGrupoAll() {
    const param: any = { cod1: 'C' };
    this.grupoSocionegocioSapService.getListByGroupType(param)
    .subscribe({next:(data: IGrupoSocioNegocioSap[]) =>{
        this.grupoClienteSapList = [];
        this.grupoClienteSelected = [];

        for (let item of data) {
          this.grupoClienteSelected.push({ groupCode: item.groupCode, groupName: item.groupName });
          this.grupoClienteSapList.push({ label: item.groupName, value: { groupCode: item.groupCode, groupName: item.groupName } });
        }
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  getTipoDocumento()
  {
    this.tipDocumentoItem =
    [
      { codTipDocumento: '01', nomTipDocumento: 'Órden de Venta' },
      { codTipDocumento: '02', nomTipDocumento: 'Factura de Reserva' },
    ];

    this.tipDocumentoList = [];
    this.tipDocumentoSelected = [];

    for (let item of this.tipDocumentoItem) {
      this.tipDocumentoSelected.push({ codTipDocumento: item.codTipDocumento, nomTipDocumento: item.nomTipDocumento });
      this.tipDocumentoList.push({ label: item.nomTipDocumento, value: { codTipDocumento: item.codTipDocumento, nomTipDocumento: item.nomTipDocumento } });
    }
  }

  getStatus()
  {
    this.statusItem =
    [
      { codStatus: '01', nomStatus: 'Pendiente' },
      { codStatus: '02', nomStatus: 'Cerrado' },
    ];

    this.statusList = [];
    this.statusSelected = [];

    for (let item of this.statusItem) {
      this.statusSelected.push({ codStatus: item.codStatus, nomStatus: item.nomStatus });
      this.statusList.push({ label: item.nomStatus, value: { codStatus: item.codStatus, nomStatus: item.nomStatus } });
    }
  }

  onToBuscar() {
    this.onListar();
  }

  onSetParametro()
  {
    this.params = this.modeloForm.getRawValue();
    this.params.cod1 = this.grupoClienteSelected.map(x=> x.groupCode).join(",");
    this.params.cod2 = this.tipDocumentoSelected.map(x=> x.codTipDocumento).join(",");
    this.params.cod3 = this.statusSelected.map(x=> x.codStatus).join(",");
  }

  onListar() {
    this.isDisplay = true;
    this.onSetParametro();
    this.ordenVentaSapService.getListOrdenVentaSeguimientoDetalladoByFecha(this.params)
    .subscribe({ next: (resp: IOrdenVentaSeguimientoDetalladoByFecha[])=>{
        this.isDisplay = false;
        this.reporteList = resp;
      },
      error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onToExcel() {
    this.isDisplay = true;
    this.onSetParametro();
    this.ordenVentaSapService.getOrdenVentaSeguimientoDetalladoExcelByFecha(this.params)
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
}
