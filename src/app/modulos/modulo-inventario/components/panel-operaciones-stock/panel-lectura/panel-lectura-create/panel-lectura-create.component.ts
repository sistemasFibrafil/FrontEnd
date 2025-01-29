import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MenuItem, SelectItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';
import { LayoutComponent } from 'src/app/layout/layout.component';
import { LanguageService } from 'src/app/services/language.service';
import { UserContextService } from 'src/app/services/user-context.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';

import { IDocumento } from 'src/app/modulos/modulo-ventas/interfaces/documento.interface';
import { IAlmacenSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/inventario/almacen-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { AlmacenService } from 'src/app/modulos/modulo-gestion/services/sap/definiciones/inventario/almacen-sap.service';
import { LecturaService } from 'src/app/modulos/modulo-inventario/services/web/lectura.service';
import { DocumentoLecturaService } from 'src/app/modulos/modulo-inventario/services/web/documento-lectura.service';
import { DocumentoLecturaSapService } from 'src/app/modulos/modulo-inventario/services/sap/documento-lectura-sap.service';
import { ILectura } from 'src/app/modulos/modulo-inventario/interfaces/web/lectura.inteface';



@Component({
  selector: 'panel-inv-lectura-create',
  templateUrl: './panel-lectura-create.component.html',
  styleUrls: ['./panel-lectura-create.component.css']
})
export class PanelLecturaCreateComponent implements OnInit {
  modeloForm: FormGroup;
  modeloFormDetalle: FormGroup;
  modeloFormBusqueda: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  // Titulo del componente
  titulo = 'Lectura';

  // MODAL: Progreso
  isDisplay: boolean = false;
  isSaving: boolean = false;
  isDeleting: boolean = false;

  // DETALLE
  itemCode: string = '';
  columnas: any[];
  opciones: any = [];
  items: MenuItem[];
  listAlmacen: SelectItem[];
  listDocumento: SelectItem[];
  listObjType: SelectItem[];
  listLectura: ILectura[] = [];
  modeloSelected: ILectura;
  params: FilterRequestModel = new FilterRequestModel();

  // Modal
  columnasModal: any[];
  listModal: ILectura[] = [];
  modeloModalSeleted: ILectura;
  isVisualizar: boolean = false;


  constructor
  (
    private router: Router,
    private fb: FormBuilder,
    private userContextService: UserContextService,
    public app: LayoutComponent,
    public lenguageService: LanguageService,
    private readonly swaCustomService: SwaCustomService,
    private lecturaService: LecturaService,
    private almacenService: AlmacenService,
    private documentoLecturaService: DocumentoLecturaService,
    private documentoLecturaSapService: DocumentoLecturaSapService,
  ) {}

  ngOnInit() {
    this.onBuildForm();
    this.onBuildColumn();
    this.getListTipoDocumento();
    this.getListAlamcen();
    this.getListItemContextMenu();
  }

  getListItemContextMenu() {
    this.items =
    [
      {label: 'Eliminar',     icon: 'pi pi-trash',  command: () => this.onToDelete(this.modeloSelected) },
      {label: 'Visualizar',   icon: 'pi pi-eye',   command: () => this.onToView(this.modeloSelected) },
    ];
  }

  onBuildForm() {
    this.modeloForm = this.fb.group(
    {
      'objType'       : new FormControl('', Validators.compose([Validators.required])),
      'cardCode'      : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required])),
      'licTradNum'    : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required])),
      'cardName'      : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required]))
    });

    this.modeloFormDetalle = this.fb.group(
    {
      'documento'  : new FormControl('', Validators.compose([Validators.required])),
      'almacen'     : new FormControl('', Validators.compose([Validators.required])),
      'barcode'     : new FormControl('', Validators.compose([Validators.required])),
    });

    this.modeloFormBusqueda = this.fb.group({
      'text1': new FormControl(''),
    });
  }

  onBuildColumn() {
    this.columnas = [
      { field: 'baseNum',   header: 'Número' },
      { field: 'itemCode',  header: 'Código' },
      { field: 'itemName',  header: 'Descripción' },
      { field: 'unitMsr',   header: 'UM' },
      { field: 'quantity',  header: 'Cantidad' },
      { field: 'peso',      header: 'Peso' },
    ];

    this.columnasModal =
    [
      { field: 'itemCode',  header: 'Código' },
      { field: 'barcode',   header: 'Barcode' },
      { field: 'quantity',  header: 'Cantidad' },
      { field: 'peso',      header: 'Peso' }
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
  }

  onChangeObjType()
  {
    this.getListDocumento();
  }

  getListDocumento()
  {
    let objType: string = '';
    let cardCode: string = '';
    this.listLectura = [];
    this.listDocumento = [];

    if (this.modeloForm.controls['objType'].value) {
      let itemTipobjType = this.modeloForm.controls['objType'].value;
      objType = itemTipobjType.value;
    }

    if(objType === '' || objType === null) return;

    cardCode = this.modeloForm.controls['cardCode'].value;

    if(objType !== '1250000001' && (cardCode === '' || cardCode === null)) return;

    const value: any = { cod1: objType, cod2: cardCode };

    if(objType == '1250000001')
      this.getListDocumentoPendienteByObjTypeAndCardCode(value);
    else
    this.getListDocumentoPendienteSapByObjTypeAndCardCode(value);
  }


  //#region <<< MODAL: Cliente >>>
  onToClienteSelecionado(value) {
    this.modeloForm.patchValue({cardCode : value.cardCode, licTradNum: value.licTradNum, cardName: value.cardName });
    this.getListDocumento();
  }
  //#endregion


  getListDocumentoPendienteByObjTypeAndCardCode(value: any) {
    this.isDisplay = true;
    this.documentoLecturaService.getListDocumentoPendienteByObjTypeAndCardCode(value)
    .subscribe({next:(data: IDocumento[]) =>{
        this.listDocumento = [];
        for (let item of data) {
          this.listDocumento.push({ label: item.docNum.toString(), value: item.docEntry });
        }
        this.isDisplay = false;
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  getListDocumentoPendienteSapByObjTypeAndCardCode(value: any) {
    this.isDisplay = true;
    this.documentoLecturaSapService.getListDocumentoPendienteByObjTypeAndCardCode(value)
    .subscribe({next:(data: IDocumento[]) =>{
        this.listDocumento = [];
        for (let item of data) {
          this.listDocumento.push({ label: item.docNum.toString(), value: item.docEntry });
        }
        this.isDisplay = false;
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  getListAlamcen() {
    this.listAlmacen = [];
    const param: any = { cod1: 'N' }; // inactive
    this.almacenService.getListByEstado(param)
    .subscribe({next:(data: IAlmacenSap[]) =>{
        this.listAlmacen = [];
        for (let item of data) {
          this.listAlmacen.push({ label: item.fullDescr, value: item.whsCode });
        }
      },error:(e)=>{
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  //#endregion <<< Detalle >>>
  getListByObjTypeAndDocEntry() {
    if (this.modeloForm.controls['objType'].value) {
      let itemTipobjType = this.modeloForm.controls['objType'].value;
      this.params.cod1 = itemTipobjType.value;
    }
    if (this.modeloFormDetalle.controls['documento'].value) {
      let itemDocumento = this.modeloFormDetalle.controls['documento'].value;
      this.params.id1 = itemDocumento.value;
    }

    this.lecturaService.getListByBaseTypeAndBaseEntry(this.params)
    .subscribe({next:(data: ILectura[]) =>
    {
      this.listLectura = data;
    },error:(e)=>{
      this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
    }
    });
  }

  onToAdd()
  {
    let objType: string = '';
    let docEntry: number = 0;
    let whsCode: string = '';
    let barcode: string = '';

    if (this.modeloForm.controls['objType'].value) {
      let itemTipobjType = this.modeloForm.controls['objType'].value;
      objType = itemTipobjType.value;
    }
    if (this.modeloFormDetalle.controls['documento'].value) {
      let itemDocumento = this.modeloFormDetalle.controls['documento'].value;
      docEntry = itemDocumento.value;
    }
    if (this.modeloFormDetalle.controls['almacen'].value) {
      let itemAlmacen = this.modeloFormDetalle.controls['almacen'].value;
      whsCode = itemAlmacen.value;
    }
    barcode = this.modeloFormDetalle.controls['barcode'].value;

    if (objType === '' || objType === null || objType === undefined)
    {
      this.swaCustomService.swaMsgInfo('Seleccione el tipo de documento.');
      return;
    }

    if (docEntry === 0 || docEntry === null || docEntry === undefined)
    {
      this.swaCustomService.swaMsgInfo('Seleccione el documento.');
      return;
    }

    if (whsCode === '' || whsCode === null || whsCode === undefined)
    {
      this.swaCustomService.swaMsgInfo('Seleccione el almacén.');
      return;
    }

    if (barcode === '' || barcode === null || barcode === undefined)
    {
      this.swaCustomService.swaMsgInfo('Ingrese el código de barra.');
      return;
    }

    const value: any = { baseType: objType, baseEntry: docEntry, fromWhsCod: whsCode, barcode: barcode, idUsuarioCreate: this.userContextService.getIdUsuario() };

    this.isSaving = true;

    this.lecturaService.setCreate(value)
    .subscribe({ next: (data:any)=>{
        this.isSaving = false;
        this.getListByObjTypeAndDocEntry();
        this.modeloFormDetalle.patchValue({ barcode : '' });
        this.swaCustomService.swaMsgExito(null);
      },
      error:(e)=>{
        this.isSaving = false;
        this.modeloFormDetalle.patchValue({barcode : '' });
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onToView(modelo: ILectura){
    this.modeloSelected = modelo;
    this.onListar();
    this.isVisualizar = true;
  }

  onToDelete(modelo: ILectura)
  {
    this.modeloSelected = modelo;
    this.onConfirmDelete();
  }

  onConfirmDelete()
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

  delete() {
    this.isDeleting = true;
    const params: any = { id: 0, baseType: this.modeloSelected.baseType, baseEntry: this.modeloSelected.baseEntry, baseLine: this.modeloSelected.baseLine, return: this.modeloSelected.return, docStatus: this.modeloSelected.docStatus };
    this.lecturaService.setDeleteMassive(params)
    .subscribe({ next: (resp:any)=>{
        this.getListByObjTypeAndDocEntry();
        this.isDeleting = false;
        this.swaCustomService.swaMsgExito(null);
      },
      error:(e)=>{
        this.isDeleting = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }
  //#endregion



  //#region <<< Modal >>>
  onToBuscar()
  {
    this.onListar();
  }

  onListar() {
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
        this.getListByObjTypeAndDocEntry();
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


  back() {
    this.router.navigate(['/main/modulo-inv/panel-lectura-list']);
  }
}
