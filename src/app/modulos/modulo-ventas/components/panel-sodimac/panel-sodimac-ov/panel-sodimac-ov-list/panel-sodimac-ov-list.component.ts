import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { UserContextService } from 'src/app/services/user-context.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';

import { SelectItem } from 'primeng/api';
import { StatusService } from 'src/app/modulos/modulo-gestion/services/web/definiciones/general/status.service';
import { IOrdenVentaSodimacByFiltro } from 'src/app/modulos/modulo-ventas/interfaces/orden-venta-sodimac.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { OrdenVentaSodimacService } from 'src/app/modulos/modulo-ventas/services/web/orden-venta-sodimac.service';


interface DocStatus {
  statusCode  : string,
  statusName  : string
}


@Component({
  selector: 'app-ven-panel-sodimac-ov-list',
  templateUrl: './panel-sodimac-ov-list.component.html',
  styleUrls: ['./panel-sodimac-ov-list.component.css']
})
export class PanelSodimacOrdenVentaListComponent implements OnInit {
  modeloForm: FormGroup;

  // Titulo del componente
  titulo = 'Órden de Venta';
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  columnas: any[];
  opciones: any = [];

  modeloDelete: IOrdenVentaSodimacByFiltro;
  modeloSelected: IOrdenVentaSodimacByFiltro;
  list: IOrdenVentaSodimacByFiltro[] = [];

  docStatusItem: SelectItem[];
  docStatusList: DocStatus[];
  docStatusSelected:DocStatus[];

  params: FilterRequestModel = new FilterRequestModel();
  isDisplay: Boolean = false;
  isDeleting: boolean = false;


  constructor
  (
    private router: Router,
    private fb: FormBuilder,
    public lenguageService: LanguageService,
    private userContextService: UserContextService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private statusService: StatusService,
    private ordenVentaSodimacService: OrdenVentaSodimacService,
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
      'dat1'              : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'dat2'              : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'msStatus'          : new FormControl('', Validators.compose([Validators.required])),
      'text1'             : new FormControl(''),
    });

    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-ven-panel-sodimac-ov-list');
  }

  onBuildColumn() {
    this.columnas = [
      { field: 'docNum',          header: 'Número' },
      { field: 'numOrdenCompra',  header: 'OC' },
      { field: 'docStatus',       header: 'Estado' },
      { field: 'docDate',         header: 'Fecha de contabilización' },
      { field: 'docDueDate',      header: 'Fecha de entrega' },
      { field: 'taxDate',         header: 'Fecha de documento' },
      { field: 'cardCode',        header: 'Código de cliente' },
      { field: 'cardName',        header: 'Nombre de cliente' },
    ];
  }

  opcionesTabla() {
    this.opciones = [
      { label: 'Vizualizar',  icon: 'pi pi-eye',            command: () => { this.ver() } },
      { label: 'Eliminar',    icon: 'pi pi-trash',          command: () => { this.eliminar() } },
    ];
  }

  getListStatus() {
    this.docStatusList = [];
    this.docStatusList = [
      { statusCode: '01', statusName: 'Abierto' },
      { statusCode: '02', statusName: 'Cerrado' },
      { statusCode: '03', statusName: 'Cancelado' },
    ];

    this.docStatusItem = [];
    this.docStatusSelected = [];
    for (let item of this.docStatusList) {
      this.docStatusSelected.push({ statusCode: item.statusCode, statusName: item.statusName });
      this.docStatusItem.push({ label: item.statusName, value: { statusCode: item.statusCode, statusName: item.statusName } });
    }
  }

  onSetParametro()
  {
    this.params = this.modeloForm.getRawValue();
    this.params.cod1 = this.docStatusSelected.map(x=> x.statusCode).join(",");
  }

  onListar() {
    this.isDisplay = true;
    this.onSetParametro();
    this.ordenVentaSodimacService.getListOrdenVentaSodimacByFiltro(this.params)
    .subscribe({next:(data: IOrdenVentaSodimacByFiltro[]) =>
    {
      this.isDisplay = false;
      this.list = data;
    },error:(e)=>{
      this.isDisplay = false;
      this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
    }
    });
  }

  onToBuscar() {
    this.onListar();
  }

  onToCreate() {
    this.router.navigate(['/main/modulo-ven/panel-sodimac-ov-create']);
  }

  onToItemSelected(modelo: IOrdenVentaSodimacByFiltro) {
    this.modeloSelected = modelo;

    // if(this.buttonAcces.btnEditar || modelo.codEstado === '02' || modelo.codEstado === '03'){
    //   this.opciones.find(x => x.label == "Editar").visible = false;
    // } else {
    //   this.opciones.find(x => x.label == "Editar").visible = true;
    // }

    if(this.buttonAcces.btnEditar || modelo.docStatus === '02' || modelo.docStatus === '03'){
      this.opciones.find(x => x.label == "Visualizar").visible = false;
    } else {
      this.opciones.find(x => x.label == "Visualizar").visible = true;
    }

    if(this.buttonAcces.btnEliminar || modelo.docStatus === '02' || modelo.docStatus === '03'){
      this.opciones.find(x => x.label == "Eliminar").visible = false;
    } else {
      this.opciones.find(x => x.label == "Eliminar").visible = true;
    }
  }

  // onToRowSelectView(modelo: IPickingVentaByFiltro){
  //   this.router.navigate(['/main/modulo-ve/picking-venta-view', modelo.idPicking]);
  // }

  ver(){
    this.router.navigate(['/main/modulo-ven/panel-sodimac-ov-view', this.modeloSelected.id]);
  }

  // onToRowSelectEdit(modelo: IPickingVentaByFiltro){
  //   this.router.navigate(['/main/modulo-ve/picking-venta-edit', modelo.idPicking]);
  // }

  editar(){
    this.router.navigate(['/main/modulo-ven/panel-sodimac-ov-update', this.modeloSelected.id]);
  }

  onToDelete() {
    // this.isDeleting = true;
    // const param: any = { idPicking: this.modeloSelected.idPicking, idUsuario: this.userContextService.getIdUsuario() };
    // this.solicitudTrasladoService.setDelete(param)
    // .subscribe({ next: (resp:any)=>{
    //     this.onListar();
    //     this.isDeleting = false;
    //     this.swaCustomService.swaMsgExito(null);
    //   },
    //   error:(e)=>{
    //     this.isDeleting = false;
    //     this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
    //   }
    // });
  }

  // onToRowSelectDelte(modelo: IPickingVentaByFiltro)
  // {
  //   this.modeloDelete = modelo;
  //   this.onConfirmDelete();
  // }

  eliminar()
  {
    this.swaCustomService.swaConfirmation(
      this.globalConstants.titleEliminar,
      this.globalConstants.subTitleEliminar,
      this.globalConstants.icoSwalQuestion
    ).then((result) => {
      if (result.isConfirmed) {
        this.onToDelete();
      }
    });
  }
}
