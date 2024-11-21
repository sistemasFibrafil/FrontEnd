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

import { IGrupoSocioNegocioSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/socio-negocios/grupo-socio-negocio.interface';
import { ICobranzaCarteraVencidaSapByFecha } from 'src/app/modulos/modulo-gestion-bancos/interfaces/pagoRecibido.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { PagoRecibidoSapService } from 'src/app/modulos/modulo-gestion-bancos/services/pagoRecibido.service';
import { GrupoSocionegocioSapService } from 'src/app/modulos/modulo-gestion/services/sap/definiciones/socio-negocios/grupo-socio-negocio-sap.service';




@Component({
  selector: 'app-ban-panel-cobranza-cartera-vencida-by-fecha-corte',
  templateUrl: './panel-cobranza-cartera-vencida-by-fecha-corte.component.html',
  styleUrls: ['./panel-cobranza-cartera-vencida-by-fecha-corte.component.css']
})
export class PanelCobranzaCarteraVencidaByFechaComponent implements OnInit, OnDestroy {
  modeloForm: FormGroup;
  subscription: Subscription;

  // Titulo del componente
  titulo = 'Reporte - Cobranza de Carteras Vencidas';
  subtitulo = 'Cobranza de Carteras Vencidas';
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  // Opcion Buscar
  registro: boolean = true;
  isDisplay: boolean = false;

  columnas: any[];
  grupoClienteSapList: SelectItem[];
  grupoClienteSelected: IGrupoSocioNegocioSap[];
  reporteList: ICobranzaCarteraVencidaSapByFecha[];
  params: FilterRequestModel = new FilterRequestModel();

  fecha: string = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
  nombreArchivo: string = 'Cobranza de Carteras Vencidas -';

  saldoSOL: number = 0;
  saldoUSD: number = 0;
  saldoSYS: number = 0;
  de_0_15_Dias: number = 0;
  de_16_30_Dias: number = 0;
  de_31_60_Dias: number = 0;
  mas_60_Dias: number = 0;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    public lenguageService: LanguageService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private grupoSocionegocioSapService: GrupoSocionegocioSapService,
    private pagoRecibidoSapService: PagoRecibidoSapService) {}

  ngOnInit() {
    this.modeloForm = this.fb.group(
      {
        'dat1'            : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
        'msGrupoCliente'  : new FormControl('', Validators.compose([Validators.required])),
        'text1'           : new FormControl(''),
      });

    // Iniciamos el acceso a las opciones con la que cuenta el usuario
    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-ban-panel-cobranza-cartera-vencida-by-fecha-corte');

    this.columnas = [
      { field: 'cardCode',  header: 'Código de Cliente' },
      { field: 'cardName',  header: 'Nombre de Cliente' },
      { field: 'cardName',  header: 'Grupo de Cliente' },
      { field: 'creditLine',  header: 'Línea de Crédito' },
      { field: 'slpName', header: 'Vendedor' },
      { field: 'numeroAsiento', header: 'Número Asiento' },
      { field: 'numeroSAP', header: 'Número SAP' },
      { field: 'tipoDocumento', header: 'Tipo Documento' },
      { field: 'numeroDocumento', header: 'Número Documento' },
      { field: 'docDate', header: 'Fecha Contabilización' },
      { field: 'taxDate', header: 'Fecha Emisión' },
      { field: 'dueDate', header: 'Fecha Vencimiento' },
      { field: 'comments', header: 'Comentarios' },
      { field: 'segment_0', header: 'Segment 0' },
      { field: 'condicionPago', header: 'Condicion Pago' },
      { field: 'moneda', header: 'Moneda' },
      { field: 'saldoSOL', header: 'Saldo SOL' },
      { field: 'saldoUSD', header: 'Saldo USD' },
      { field: 'saldoSYS', header: 'Saldo SYS' },
      { field: 'de_0_15_Dias', header: '0-15 días' },
      { field: 'de_16_30_Dias', header: '16-30 días' },
      { field: 'de_31_60_Dias', header: '31-60 días' },
      { field: 'mas_60_Dias', header: '+60 días' },
    ];

    this.getListGrupoClienteAll();
  }

  getListGrupoClienteAll() {
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

  onToBuscar() {
    this.onListar();
  }

  onSetParametro()
  {
    this.params = this.modeloForm.getRawValue();
    var groupCode = this.grupoClienteSelected.map(x=> x.groupCode).join(",");
    this.params.cod1 = groupCode;
  }

  onListar() {
    this.registro = true;
    this.isDisplay = true;

    this.saldoSOL = 0;
    this.saldoUSD = 0;
    this.saldoSYS = 0;
    this.de_0_15_Dias = 0;
    this.de_16_30_Dias = 0;
    this.de_31_60_Dias = 0;
    this.mas_60_Dias = 0;

    this.onSetParametro();
    this.subscription = new Subscription();
    this.subscription = this.pagoRecibidoSapService.getListCobranzaCarteraVencidaByFechaCorte(this.params)
    .subscribe({next:(data: ICobranzaCarteraVencidaSapByFecha[]) =>{
      if(data)
      {
        this.registro = true;
        this.isDisplay = false;
        this.reporteList = data;

        this.reporteList.forEach((item) => {
          this.saldoSOL += item.saldoSOL;
          this.saldoUSD += item.saldoUSD;
          this.saldoSYS += item.saldoSYS;
          this.de_0_15_Dias += item.de_0_15_Dias;
          this.de_16_30_Dias += item.de_16_30_Dias;
          this.de_31_60_Dias += item.de_31_60_Dias;
          this.mas_60_Dias += item.mas_60_Dias;
        });
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
    this.subscription = this.pagoRecibidoSapService.getListCobranzaCarteraVencidaExcelByFechaCorte(this.params)
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
