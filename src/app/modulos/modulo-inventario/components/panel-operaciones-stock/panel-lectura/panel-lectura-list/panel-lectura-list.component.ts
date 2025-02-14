import Swal from 'sweetalert2';
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

import { ILectura } from 'src/app/modulos/modulo-inventario/interfaces/web/lectura.inteface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { ParamCreateTransferenciaModel } from 'src/app/modulos/modulo-inventario/models/web/solicitud-traslado.model';
import { LecturaService } from 'src/app/modulos/modulo-inventario/services/web/lectura.service';
import { CifrarDataService } from 'src/app/services/cifrar-data.service';


interface DocStatus {
  statusCode  : string,
  statusName  : string
}


@Component({
  selector: 'app-inv-panel-lectura-list',
  templateUrl: './panel-lectura-list.component.html',
  styleUrls: ['./panel-lectura-list.component.css']
})
export class PanelLecturaListComponent implements OnInit {
  modeloForm: FormGroup;
  modeloFormBusqueda: FormGroup;;

  // Titulo del componente
  titulo = 'Lectura';
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  columnas: any[];
  opciones1: any = [];
  opciones2: any = [];

  modeloDelete: ILectura;
  modeloSelected: ILectura;
  listObjType: SelectItem[];
  lecturaList: ILectura[] = [];
  lecturaSelected: ILectura[] = [];

  docStatus: DocStatus[];
  docStatusList: SelectItem[];
  docStatusSelected: any[];

  isDisplay: Boolean = false;
  isDeleting: boolean = false;
  params: FilterRequestModel = new FilterRequestModel();
  paramsCreateTransferencia: ParamCreateTransferenciaModel = new ParamCreateTransferenciaModel();

  // Modal
  columnasModal: any[];
  listModal: ILectura[] = [];
  modeloModalSeleted: ILectura;
  isVisualizar: boolean = false;


  constructor
  (
    private router: Router,
    private fb: FormBuilder,
    public lenguageService: LanguageService,
    private userContextService: UserContextService,
    private readonly swaCustomService: SwaCustomService,
    private readonly cifrarDataService: CifrarDataService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private lecturaService: LecturaService,
  )
  {
    this.isRowSelectable = this.isRowSelectable.bind(this);
  }


  ngOnInit() {
    this.onBuildForm();
    this.onBuildColumn();
    this.opcionesTabla();
    this.getListTipoDocumento();
    this.getListEstado();
  }

  onBuildForm() {
    this.modeloForm = this.fb.group(
    {
      'dat1'            : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'dat2'            : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'objType'         : new FormControl('', Validators.compose([Validators.required])),
      'msDocStatus'     : new FormControl('', Validators.compose([Validators.required])),
    });

    this.modeloFormBusqueda = this.fb.group({
      'text1': new FormControl(''),
    });

    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-inv-panel-lectura-list');
  }

  onBuildColumn() {
    this.columnas =
    [
      { field: 'baseNum',         header: 'Número' },
      { field: 'baseLine',        header: 'Línea' },
      { field: 'itemCode',        header: 'Código' },
      { field: 'dscription',      header: 'Descripción' },
      // { field: 'return',          header: 'Devuelto' },
      { field: 'unitMsr',         header: 'UM' },
      { field: 'quantity',        header: 'Cantidad' },
      { field: 'openQty',         header: 'Pendiente' },
      { field: 'engQtyRead',      header: 'Lectura Pendiente' },
      { field: 'dedQtyRead',      header: 'Lectura Despachada' },
    ];

    this.columnasModal =
    [
      { field: 'itemCode',        header: 'Código' },
      { field: 'barcode',         header: 'Barcode' },
      { field: 'quantity',        header: 'Cantidad' },
      { field: 'peso',            header: 'Peso' }
    ];
  }

  opcionesTabla() {
    this.opciones1 = [
      { label: 'Eliminar',    icon: 'pi pi-trash',          command: () => { this.onToDelete() } },
      { label: 'Visualizar',  icon: 'pi pi-eye',            command: () => { this.onToVisualizar() } },
    ];
    this.opciones2 = [
      { label: 'Despacho',    icon: 'pi pi-plus',           command: () => { this.onToCopy() } },
    ];
  }

  getListTipoDocumento()
  {
    this.listObjType =
    [
      { label: 'Solicitud de Traslado',   value: '1250000001' },
      { label: 'Órden de Venta',          value: '17' },
      { label: 'Factura de Reserva',      value: '13' },
    ];

    const item: any = this.listObjType.find(x=>x.value === '1250000001');
    this.modeloForm.controls['objType'].setValue({ label: item.label, value: item.value });
  }

  getListEstado() {
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
    let objType: string = '';

    if (this.modeloForm.controls['objType'].value) {
      let itemTipobjType = this.modeloForm.controls['objType'].value;
      objType = itemTipobjType.value;
    }

    this.params = this.modeloForm.getRawValue();
    this.params.cod1 = objType;
    this.params.cod2 = this.docStatusSelected.map(x=> x.statusCode).join(",");
  }

  onListar() {
    this.isDisplay = true;
    this.onSetParametro();
    this.lecturaService.getListFiltro(this.params)
    .subscribe({next:(data: ILectura[]) =>{
      this.isDisplay = false;
      this.lecturaList = data;
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
    this.router.navigate(['/main/modulo-inv/panel-lectura-create']);
  }

  onToItemSelected(modelo: ILectura) {
    this.modeloSelected = modelo;
    if(this.buttonAcces.btnEliminar || modelo.docStatus === '02' || modelo.docStatus === '03' || modelo.baseType === '1250000001'){
      this.opciones1.find(x => x.label == "Eliminar").visible = false;
    } else {
      this.opciones1.find(x => x.label == "Eliminar").visible = true;
    }
    if(this.buttonAcces.btnVizualizar || modelo.docStatus === '03'){
      this.opciones1.find(x => x.label == "Visualizar").visible = false;
    } else {
      this.opciones1.find(x => x.label == "Visualizar").visible = true;
    }
  }

  //#region <<< Delete >>>
  delete() {
    this.isDeleting = true;
    const params: any = { id: 0, baseType: this.modeloSelected.baseType, baseEntry: this.modeloSelected.baseEntry, baseLine: this.modeloSelected.baseLine, return: this.modeloSelected.return, docStatus: this.modeloSelected.docStatus };
    this.lecturaService.setDeleteMassive(params)
    .subscribe({ next: (resp:any)=>{
        this.onListar();
        this.isDeleting = false;
        this.swaCustomService.swaMsgExito(null);
      },
      error:(e)=>{
        this.isDeleting = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onToDelete()
  {
    this.swaCustomService.swaConfirmation(
      this.globalConstants.titleEliminar,
      this.globalConstants.subTitleEliminar,
      this.globalConstants.icoSwalQuestion
    ).then((result) => {
      if (result.isConfirmed) {
        this.delete();
      }
    });
  }
  //#endregion

  //#region <<< Visualizar >>>
  onToVisualizar()
  {
    this.isVisualizar = !this.isVisualizar;
    this.onModalListar();
  }

  //#region <<< Modal >>>
  onToModalBuscar()
  {
    this.onModalListar();
  }

  onModalListar() {
    this.isDisplay = true;
    this.listModal = [];
    const text1 = this.modeloFormBusqueda.value;
    const params: any = { cod1: this.modeloSelected.baseType, id1: this.modeloSelected.baseEntry, id2: this.modeloSelected.baseLine, cod2: this.modeloSelected.return, cod3: this.modeloSelected.docStatus, text1: text1.text1 };
    this.lecturaService.getListByBaseTypeBaseEntryBaseLineFiltro(params)
    .subscribe({next:(data: ILectura[]) =>{
        this.isDisplay = false;
        this.listModal = data;
      },error:(e)=>{
        this.listModal = [];
        this.isDisplay = false;
        let swalWithBootstrapButtons = Swal.mixin({ customClass: { container: 'my-swal' }, target: document.getElementById('modal') });
        swalWithBootstrapButtons.fire(this.globalConstants.msgInfoSummary, e.error.resultadoDescripcion, 'error');
      }
    });
  }

  onToSelectedDeleteRow(modelo: ILectura)
  {
    this.modeloModalSeleted = modelo;
    this.onConfirmDeleteRow()
  }

  onConfirmDeleteRow()
  {
    this.swaConfirmation(
      this.globalConstants.titleEliminar,
      this.globalConstants.subTitleEliminar,
      this.globalConstants.icoSwalQuestion
    ).then((result) => {
      if (result.isConfirmed) {
        this.deleteRow();
      }
    });
  }

  swaConfirmation(title: string, text: string, icon: any) {
    let swalWithBootstrapButtons = Swal.mixin({ customClass: { container: 'my-swal' }, target: document.getElementById('modal') });
    return swalWithBootstrapButtons.fire({
      title: title,
      html: text,
      icon: icon,
      showConfirmButton: true,
      confirmButtonText: this.globalConstants.confirmButtonText,
      confirmButtonColor: '#3085d6',
      showCancelButton: true,
      cancelButtonText: this.globalConstants.cancelButtonText,
      cancelButtonColor: '#d33000',
    });
  }

  swaMsgExito(msgExitoDetail: string){
    let swalWithBootstrapButtons = Swal.mixin({ customClass: { container: 'my-swal' }, target: document.getElementById('modal') });
    return swalWithBootstrapButtons.fire(
      this.globalConstants.msgExitoSummary,
      msgExitoDetail === null || msgExitoDetail === undefined || msgExitoDetail === '' ? this.globalConstants.msgExitoDetail :  msgExitoDetail,
      this.globalConstants.icoSwalSuccess
    );
  }

  deleteRow() {
    this.isDeleting = true;
    const params: any = { id: this.modeloModalSeleted.id };
    this.lecturaService.setDelete(params)
    .subscribe({ next: (resp:any)=>{
      this.onListar();
        this.onModalListar();
        this.isDeleting = false;
        this.swaMsgExito(null);
      },
      error:(e)=>{
        this.isDeleting = false;
        let swalWithBootstrapButtons = Swal.mixin({ customClass: { container: 'my-swal' }, target: document.getElementById('modal') });
        swalWithBootstrapButtons.fire(this.globalConstants.msgInfoSummary, e.error.resultadoDescripcion, 'error');
      }
    });
  }

  onClickClose()
  {
    this.listModal = [];
    this.modeloFormBusqueda.patchValue({ filtro : '' });
    this.isVisualizar = false;
  }
  //#endregion
  //#endregion

  isRowSelectable(event) {
    return !this.isOutOfStock(event.data);
  }

  isOutOfStock(data) {
    return data.docStatus === '02';
  }

  onToCopy()
  {
    if(this.lecturaSelected.length > 0)
    {
      this.paramsCreateTransferencia.idBase = this.lecturaSelected[0].idBase;
      this.paramsCreateTransferencia.baseType = this.lecturaSelected[0].baseType;
      this.paramsCreateTransferencia.linea = [];

      for (let index = 0; index < this.lecturaSelected.length; index++) {
        if(this.lecturaSelected[index].idBase !== 0)
        {
          this.paramsCreateTransferencia.linea.push
          ({
            idBase              : this.lecturaSelected[index].idBase,
            lineBase            : this.lecturaSelected[index].lineBase,
            baseType            : this.lecturaSelected[index].baseType,
            read                : this.lecturaSelected[index].engQtyRead > 0? 'Y' : 'N',
            return              : this.lecturaSelected[index].return,
          });
        }
      }

      this.router.navigate(['/main/modulo-inv/panel-transferencia-stock-create', this.cifrarDataService.encrypt(JSON.stringify(this.paramsCreateTransferencia))]);
    }
  }
}
