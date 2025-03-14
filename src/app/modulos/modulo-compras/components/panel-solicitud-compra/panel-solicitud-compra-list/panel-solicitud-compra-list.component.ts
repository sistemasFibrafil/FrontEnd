import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';
import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { UserContextService } from 'src/app/services/user-context.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';

import { ISolicitudCompra } from '../../../interfaces/solicitud-compra.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { SolicitudCompraService } from '../../../services/web/solicitud-compra.service';

interface DocStatus {
  statusCode  : string,
  statusName  : string
}

@Component({
  selector: 'app-com-panel-solicitud-compra-list',
  templateUrl: './panel-solicitud-compra-list.component.html',
  styleUrls: ['./panel-solicitud-compra-list.component.css']
})
export class PanelSolicitdCompraListComponent implements OnInit {
  modeloForm: FormGroup;

  // Titulo del componente
  titulo = 'Solicitud de Compra';
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  columnas: any[];
  opciones: any = [];

  modeloDelete: ISolicitudCompra;
  modeloSelected: ISolicitudCompra;
  listSolicitud: ISolicitudCompra[] = [];

  docStatus: DocStatus[];
  docStatusList: SelectItem[];
  docStatusSelected: any[];

  params: FilterRequestModel = new FilterRequestModel();
  isDisplay: Boolean = false;
  isClosing: boolean = false;


  constructor
  (
    private router: Router,
    private fb: FormBuilder,
    public lenguageService: LanguageService,
    private userContextService: UserContextService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private solicitudCompraService: SolicitudCompraService,
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

    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-com-panel-solicitud-compra-list');
  }

  onBuildColumn() {
    this.columnas = [
      { field: 'number',          header: 'Número' },
      { field: 'docNum',          header: 'Número de SAP' },
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
      { label: 'Cerrar',      icon: 'pi pi-times',       command: () => { this.onClickCerrar() } },
      { label: 'Visualizar',  icon: 'pi pi-eye',         command: () => { this.onClickVisualizar() } },
    ];
  }

  onSelectedItem(modelo: ISolicitudCompra) {
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
    this.solicitudCompraService.getListFiltro(this.params)
    .subscribe({next:(data: ISolicitudCompra[]) =>
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
    this.router.navigate(['/main/modulo-com/panel-solicitud-compra-create']);
  }

  onClickEditar(){
    this.router.navigate(['/main/modulo-com/panel-solicitud-compra-update', this.modeloSelected.id]);
  }

  close() {
    this.isClosing = true;
    const param: any = { id: this.modeloSelected.id, docEntry: this.modeloSelected.docEntry, idUsuarioClose: this.userContextService.getIdUsuario() };
    this.solicitudCompraService.setClose(param)
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

  onClickVisualizar(){
    this.router.navigate(['/main/modulo-com/panel-solicitud-compra-view', this.modeloSelected.id]);
  }
}
