import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';
import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';

import { ISocioNegocio } from '../../../interfaces/socio-segocio.interface';
import { ISectorSocioNegocioSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/socio-negocios/sector-socio-negocio-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { SectorSapService } from 'src/app/modulos/modulo-gestion/services/sap/definiciones/socio-negocios/sector-socio-negocio-sap.service';
import { SocioNegocioSapService } from '../../../services/socio-negocios.service';



interface IEstadoCliente
{
  codEstado: string;
  nomEstado: string;
}

@Component({
  selector: 'app-soc-panel-cliente-by-sector-estado',
  templateUrl: './panel-cliente-by-sector-estado.component.html',
  styleUrls: ['./panel-cliente-by-sector-estado.component.css']
})
export class PanelClienteBySectorEstadoComponent implements OnInit, OnDestroy {
  modeloForm: FormGroup;
  subscription: Subscription;

  // Titulo del componente
  titulo = 'Reporte - Clientes';
  subtitulo = 'Clientes';
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  // Opcion Buscar
  isDisplay: boolean = false;

  columnas: any[];

  sectorList:SelectItem[];
  estadoList1: IEstadoCliente[];
  estadoList2: SelectItem[];

  sectorSelected:ISectorSocioNegocioSap[];
  estadoSelected: IEstadoCliente[];

  reporteList: ISocioNegocio[];
  params: FilterRequestModel = new FilterRequestModel();

  fecha: string = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
  nombreArchivo: string = 'Clientes -';

  constructor
  (
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    public lenguageService: LanguageService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private socioNegocioSapService: SocioNegocioSapService,
    private sectorSapService: SectorSapService
  ) {}

  ngOnInit() {
    this.modeloForm = this.fb.group(
    {
      'msSector'  : new FormControl('', Validators.compose([Validators.required])),
      'msEstado'  : new FormControl('', Validators.compose([Validators.required])),
      'text1'     : new FormControl(''),
    });

    this.columnas = [
      { field: 'licTradNum',        header: 'RUC' },
      { field: 'cardName',          header: 'Nombre de Cliente' },
      { field: 'slpName',           header: 'Vendedor' },
      { field: 'nomSector',         header: 'Sector' },
      { field: 'nomContacto',       header: 'Contacto' },
      { field: 'createDate',        header: 'Fecha de Alta' },
      { field: 'fechaUltimaVenta',  header: 'Fecha Última Venta' },
      { field: 'nomStatus',         header: 'Estado' },
    ];

    this.estadoList1 =
    [
      { codEstado: 'Y', nomEstado: 'ACTIVO' },
      { codEstado: 'N', nomEstado: 'INACTIVO' },
    ];

    this.getListSector();
    this.getListEstado();

    // Iniciamos el acceso a las opciones con la que cuenta el usuario
    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-soc-panel-cliente-by-sector-estado');
  }

  getListSector() {
    this.sectorList = [];
    this.sectorSapService.getList()
    .subscribe({next:(data: ISectorSocioNegocioSap[]) =>{
      this.sectorSelected = [];

        for (let item of data) {
          this.sectorSelected.push({ code: item.code, name: item.name });
          this.sectorList.push({ label: item.name, value: { code: item.code, name: item.name } });
        }
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  getListEstado() {
    this.estadoList2 = [];
    this.estadoSelected = [];

    for (let item of this.estadoList1) {
      this.estadoSelected.push({ codEstado: item.codEstado, nomEstado: item.nomEstado });
      this.estadoList2.push({ label: item.nomEstado, value: { codEstado: item.codEstado, nomEstado: item.nomEstado } });
    }
  }

  onToBuscar() {
    this.onListar();
  }

  onSetParametro()
  {
    this.params = this.modeloForm.getRawValue();
    this.params.cod1 = this.sectorSelected.map(x=> x.code).join(",");
    this.params.cod2 = this.estadoSelected.map(x=> x.codEstado).join(",");
  }

  onListar() {
    this.isDisplay = true;
    this.reporteList = [];
    this.onSetParametro();
    this.subscription = new Subscription();
    this.subscription = this.socioNegocioSapService.getLitClienteBySectorEstado(this.params)
    .subscribe({next:(data: ISocioNegocio[]) =>{
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
    this.subscription = this.socioNegocioSapService.getLitClienteExcelBySectorEstado(this.params)
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
