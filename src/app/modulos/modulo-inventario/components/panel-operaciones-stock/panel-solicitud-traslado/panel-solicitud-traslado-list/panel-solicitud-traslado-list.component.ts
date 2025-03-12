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

import { ISolicitudTraslado, ISolicitudTrasladoDetalle } from 'src/app/modulos/modulo-inventario/interfaces/web/solicitud-traslado.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { ParamCreateTransferenciaModel } from 'src/app/modulos/modulo-inventario/models/web/solicitud-traslado.model';
import { SolicitudTrasladoService } from 'src/app/modulos/modulo-inventario/services/web/solicitud-traslado.service';
import { SolicitudTrasladoSapService } from 'src/app/modulos/modulo-inventario/services/sap/solicitud-traslado-sap.Service';
import { CifrarDataService } from 'src/app/services/cifrar-data.service';

interface DocStatus {
  statusCode  : string,
  statusName  : string
}

@Component({
  selector: 'app-inv-panel-solicitud-traslado-list',
  templateUrl: './panel-solicitud-traslado-list.component.html',
  styleUrls: ['./panel-solicitud-traslado-list.component.css']
})
export class PanelSolicitdTraladoListComponent implements OnInit {
  modeloForm: FormGroup;

  // Titulo del componente
  titulo = 'Solicitud de Traslado';
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

  modeloDelete: ISolicitudTraslado;
  modeloSelected: ISolicitudTraslado;
  listSolicitud: ISolicitudTraslado[] = [];

  docStatus: DocStatus[];
  docStatusList: SelectItem[];
  docStatusSelected: any[];

  params: FilterRequestModel = new FilterRequestModel();
  modeloDetalle: ISolicitudTrasladoDetalle[] = [];
  paramCreateTransferencia: ParamCreateTransferenciaModel = new ParamCreateTransferenciaModel();


  constructor
  (
    private router: Router,
    private fb: FormBuilder,
    public lenguageService: LanguageService,
    private userContextService: UserContextService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private solicitudTrasladoService: SolicitudTrasladoService,
    private solicitudTrasladoSapService: SolicitudTrasladoSapService,
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
      'text1'       : new FormControl('')
    });

    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-inv-panel-solicitud-traslado-list');
  }

  onBuildColumn() {
    this.columnas = [
      { field: 'docNum',          header: 'Número' },
      { field: 'docStatus',       header: 'Estado' },
      { field: 'read',            header: '¿Lectura?' },
      { field: 'docDate',         header: 'Fecha de contabilización' },
      { field: 'docDueDate',      header: 'Fecha de entrega' },
      { field: 'filler',          header: 'Origen' },
      { field: 'toWhsCode',       header: 'Destino' },
    ];
  }

  opcionesTabla() {
    this.opciones = [
      { label: 'Editar',      icon: 'pi pi-pencil',                   command: () => { this.onClickEditar() } },
      { label: 'Cerrar',      icon: 'pi pi-times',                    command: () => { this.onClickCerrar() } },
      { label: 'Formato',     icon: 'pi pi-print',                    command: () => { this.onClickImprimir() } },
      { label: 'Transferir',  icon: 'pi pi-arrow-right-arrow-left',   command: () => { this.onClickTransferir() } },
      { label: 'Visualizar',  icon: 'pi pi-eye',                      command: () => { this.onClickVisualizar() } },
    ];
  }

  onSelectedItem(modelo: ISolicitudTraslado) {
    this.modeloSelected = modelo;
    if(this.buttonAcces.btnEditar || modelo.docStatus === '01' || modelo.docStatus === '02'){
      this.opciones.find(x => x.label == "Editar").visible = true;
    } else {
      this.opciones.find(x => x.label == "Editar").visible = false;
    }
    if(this.buttonAcces.btnCerrar || modelo.docStatus === '01'){
      this.opciones.find(x => x.label == "Cerrar").visible = true;
    } else {
      this.opciones.find(x => x.label == "Cerrar").visible = false;
    }
    if(!this.buttonAcces.btnImprimir1){
      this.opciones.find(x => x.label == "Formato").visible = true;
    } else {
      this.opciones.find(x => x.label == "Formato").visible = false;
    }
    if(!this.buttonAcces.btnTransferir && modelo.docStatus === '01' && modelo.read === 'N'){
      this.opciones.find(x => x.label == "Transferir").visible = true;
    } else {
      this.opciones.find(x => x.label == "Transferir").visible = false;
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
    this.solicitudTrasladoService.getListFiltro(this.params)
    .subscribe({next:(data: ISolicitudTraslado[]) =>
    {
      this.isDisplay = false;
      this.listSolicitud = data;
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
    this.router.navigate(['/main/modulo-inv/panel-solicitud-traslado-create']);
  }

  onClickEditar(){
    this.router.navigate(['/main/modulo-inv/panel-solicitud-traslado-update', this.modeloSelected.id]);
  }

  close() {
    this.isClosing = true;
    const param: any = { id: this.modeloSelected.id, docEntry: this.modeloSelected.docEntry, idUsuarioClose: this.userContextService.getIdUsuario() };
    this.solicitudTrasladoService.setClose(param)
    .subscribe({ next: (resp:any)=>{
        this.getList();
        this.isClosing = false;
        this.swaCustomService.swaMsgExito(null);
      },
      error:(e)=>{
        this.isClosing = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onClickCerrar()
  {
    this.swaCustomService.swaConfirmation(
      this.globalConstants.titleCerrar,
      this.globalConstants.subTitleCerrar,
      this.globalConstants.icoSwalQuestion
    ).then((result) => {
      if (result.isConfirmed) {
        this.close();
      }
    });
  }

  onClickImprimir() {
    this.isDisplayGenerandoVisor = true;
    this.solicitudTrasladoSapService.getSolicitudTrasladoPdfByDocEntry(this.modeloSelected.docEntry)
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

  onClickTransferir(){
    this.getListById(this.modeloSelected.id);
  }

  getListById(id: number) {
    this.isDisplay = true;
    this.onSetParametro();
    this.solicitudTrasladoService.getListById(id)
    .subscribe({next:(data: ISolicitudTrasladoDetalle[]) =>
    {
      this.isDisplay = false;
      this.modeloDetalle = data;

      if(this.modeloDetalle.length > 0)
        {
          this.paramCreateTransferencia.idBase = this.modeloSelected.id;
          this.paramCreateTransferencia.baseType = this.modeloSelected.objType;
          this.paramCreateTransferencia.linea = [];

          for (let index = 0; index < this.modeloDetalle.length; index++) {
            this.paramCreateTransferencia.linea.push
            ({
              idBase              : this.modeloDetalle[index].id,
              lineBase            : this.modeloDetalle[index].line,
              baseType            : this.modeloDetalle[index].objType,
              read                : 'N',
              return              : 'N',
            });
          }

          this.onTransferir(this.paramCreateTransferencia);
        }
    },error:(e)=>{
      this.isDisplay = false;
      this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
    }
    });
  }

  onTransferir(params: ParamCreateTransferenciaModel)
  {
    this.router.navigate(['/main/modulo-inv/panel-transferencia-stock-create', JSON.stringify(params)]);
  }


  onClickVisualizar(){
    this.router.navigate(['/main/modulo-inv/panel-solicitud-traslado-view', this.modeloSelected.id]);
  }
}
