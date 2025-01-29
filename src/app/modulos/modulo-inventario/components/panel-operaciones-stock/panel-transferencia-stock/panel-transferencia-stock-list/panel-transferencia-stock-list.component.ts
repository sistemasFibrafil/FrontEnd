import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';
import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { UserContextService } from 'src/app/services/user-context.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';

import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { TransferenciaStockService } from 'src/app/modulos/modulo-inventario/services/web/transferencia-stock.service';
import { TransferenciaStockSapService } from 'src/app/modulos/modulo-inventario/services/sap/transferencia-stock-sap.service';
import { ITransferenciaStock } from 'src/app/modulos/modulo-inventario/interfaces/web/transferencia-stock.interface';
import { ParamCreateTransferenciaModel } from 'src/app/modulos/modulo-inventario/models/web/solicitud-traslado.model';



interface DocStatus {
  statusCode  : string,
  statusName  : string
}

@Component({
  selector: 'app-inv-panel-transferencia-stock-list',
  templateUrl: './panel-transferencia-stock-list.component.html',
  styleUrls: ['./panel-transferencia-stock-list.component.css']
})
export class PanelPanelTransferenciaStockListComponent implements OnInit {
  modeloForm: FormGroup;

  // Titulo del componente
  titulo = 'Transferencia de Stock';
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  isDataBlob: Blob;
  isDisplay: Boolean = false;
  isClosing: boolean = false;
  isDisplayVisor: boolean = false;
  isDisplayGenerandoVisor: boolean = false;

  columnas: any[];
  opciones: any = [];

  modeloDelete: ITransferenciaStock;
  modeloSelected: ITransferenciaStock;
  listTransferencia: ITransferenciaStock[] = [];

  docStatus: DocStatus[];
  docStatusList: SelectItem[];
  docStatusSelected: any[];

  params: FilterRequestModel = new FilterRequestModel();
  paramCreateTransferencia: ParamCreateTransferenciaModel = new ParamCreateTransferenciaModel();


  constructor
  (
    private router: Router,
    private fb: FormBuilder,
    public lenguageService: LanguageService,
    private userContextService: UserContextService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private transferenciaStockService: TransferenciaStockService,
    private transferenciaStockSapService: TransferenciaStockSapService,
  ) {}


  ngOnInit() {
    this.onBuildForm();
    this.onBuildColumn();
    this.opcionesTabla();
    this.getListStatus();
  }

  onBuildForm() {
    this.modeloForm = this.fb.group(
    {
      'dat1'        : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'dat2'        : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'msDocStatus' : new FormControl('', Validators.compose([Validators.required])),
    });

    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-inv-panel-transferencia-stock-list');
  }

  onBuildColumn() {
    this.columnas = [
      { field: 'number',          header: 'Número' },
      { field: 'docNum',          header: 'Número de SAP' },
      { field: 'numDocumento',    header: 'Número de SUNAT' },
      { field: 'docStatus',       header: 'Estado' },
      { field: 'docDate',         header: 'Fecha de contabilización' },
      { field: 'docDueDate',      header: 'Fecha de entrega' },
      { field: 'taxDate',         header: 'Fecha de documento' },
      { field: 'filler',          header: 'Origen' },
      { field: 'toWhsCode',       header: 'Destino' },
    ];
  }

  opcionesTabla() {
    this.opciones = [
      { label: 'Editar',      icon: 'pi pi-pencil',      command: () => { this.onClickEditar() } },
      { label: 'Imprimir',    icon: 'pi pi-print',       command: () => { this.onClickImprimir() } },
      { label: 'Visualizar',  icon: 'pi pi-eye',         command: () => { this.onClickVisualizar() } },
    ];
  }

  onSelectedItem(modelo: ITransferenciaStock) {
    this.modeloSelected = modelo;
    if(this.buttonAcces.btnEditar || modelo.docStatus === '01'){
      this.opciones.find(x => x.label == "Editar").visible = true;
    } else {
      this.opciones.find(x => x.label == "Editar").visible = false;
    }
    if(this.buttonAcces.btnCerrar || modelo.docStatus === '01'){
      this.opciones.find(x => x.label == "Cancelar").visible = true;
    } else {
      this.opciones.find(x => x.label == "Cancelar").visible = false;
    }
    if(this.buttonAcces.btnVizualizar || modelo.docStatus === '01' || modelo.docStatus === '02'){
      this.opciones.find(x => x.label == "Visualizar").visible = true;
    } else {
      this.opciones.find(x => x.label == "Visualizar").visible = false;
    }
  }

  getListStatus() {
    this.docStatusList = [];
    this.docStatusSelected = [];
    this.docStatus =
    [
      { statusCode  : '01', statusName: 'Abierto'},
      { statusCode  : '02', statusName: 'Cerrado'},
    ];
    for (let lina of this.docStatus) {
      this.docStatusSelected.push({ statusCode: lina.statusCode, statusName: lina.statusName });
      this.docStatusList.push({ label: lina.statusName, value: { statusCode: lina.statusCode, statusName: lina.statusName } });
    }
  }

  onSetParametro()
  {
    this.params = this.modeloForm.getRawValue();
    this.params.cod1 = this.docStatusSelected.map(x=> x.statusCode).join(",");
  }

  getList() {
    this.isDisplay = true;
    this.onSetParametro();
    this.transferenciaStockService.getListFiltro(this.params)
    .subscribe({next:(data: ITransferenciaStock[]) =>
    {
      this.isDisplay = false;
      this.listTransferencia = data;
    },error:(e)=>{
      this.isDisplay = false;
      this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
    }
    });
  }

  onClickBuscar() {
    this.getList();
  }

  onClickCreate() {
    this.router.navigate(['/main/modulo-inv/panel-transferencia-stock-create',JSON.stringify(this.paramCreateTransferencia)]);
  }

  onClickEditar(){
    console.log("SELECTED: ", this.modeloSelected);
    this.router.navigate(['/main/modulo-inv/panel-transferencia-stock-update', this.modeloSelected.id]);
  }

  close() {
    // this.isClosing = true;
    // const param: any = { idSolicitudTraslado: this.modeloSelected.id, docEntry: this.modeloSelected.docEntry, idUsuarioClose: this.userContextService.getIdUsuario() };
    // this.transferenciaStockService.setClose(param)
    // .subscribe({ next: (resp:any)=>{
    //     this.getList();
    //     this.isClosing = false;
    //     this.swaCustomService.swaMsgExito(null);
    //   },
    //   error:(e)=>{
    //     this.isClosing = false;
    //     this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
    //   }
    // });
  }

  onClickCancelar()
  {
    // this.swaCustomService.swaConfirmation(
    //   this.globalConstants.titleCerrar,
    //   this.globalConstants.subTitleCerrar,
    //   this.globalConstants.icoSwalQuestion
    // ).then((result) => {
    //   if (result.isConfirmed) {
    //     this.close();
    //   }
    // });
  }

  onClickVisualizar(){
    this.router.navigate(['/main/modulo-inv/panel-transferencia-stock-view', this.modeloSelected.id]);
  }

  onClickImprimir() {
    this.isDisplayGenerandoVisor = true;
    this.transferenciaStockSapService.getTransferenciaStockPdfByDocEntry(this.modeloSelected.docEntry)
    .subscribe({next:(resp: any) => {
      switch (resp.type) {
        case HttpEventType.DownloadProgress:
          break;
        case HttpEventType.Response:
          this.isDataBlob = new Blob([resp.body], {type: resp.body.type});
          this.isDisplayGenerandoVisor = false;
          this.isDisplayVisor = true;
          break;
      }
      },error:(e)=>{
        this.isDisplayGenerandoVisor = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }
}
