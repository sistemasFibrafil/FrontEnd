import { MenuItem, SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';
import { LayoutComponent } from 'src/app/layout/layout.component';
import { UtilService } from 'src/app/services/util.service';
import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { UserContextService } from 'src/app/services/user-context.service';

import { ISolicitudCompra, ISolicitudCompraDetalle } from '../../../interfaces/solicitud-compra.interface';
import { SolicitudCompraCreateModel } from '../../../models/solicitud-compra.model';
import { SolicitudCompraService } from '../../../services/web/solicitud-compra.service';

interface DocStatus {
  statusCode  : string,
  statusName  : string
}

interface DocType {
  docTypeCode  : string,
  docTypeName  : string
}

@Component({
  selector: 'app-com-panel-solicitud-compra-create',
  templateUrl: './panel-solicitud-compra-create.component.html',
  styleUrls: ['./panel-solicitud-compra-create.component.css']
})
export class PanelSolicitudCompraCreateComponent implements OnInit {

  // Titulo del componente
  titulo = 'Solicitud de Compra';

  // modeloFormCab1: FormGroup;
  modeloFormCab1: FormGroup;
  modeloFormCab2: FormGroup;
  modeloFormDet1: FormGroup;
  modeloFormPie1: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  jrnlMemo: string = 'Solicitud de compra - '
  docTypSelected: any;
  docType: DocType[];
  docStatus: DocStatus[];
  docTypesList: SelectItem[];
  docStatusList: SelectItem[];
  modeloSave: SolicitudCompraCreateModel = new SolicitudCompraCreateModel();

  // MODAL: Progreso
  isSaving: boolean = false;
  isDisplay: boolean = false;

  // MODAL: CLiente
  cardCode: string = '';
  cntctCode: number = 0;

   // MODAL: Almacen
   whsCodeOrigen: string = '';
   whsCodeDestino: string = '';
   itemCodeAlmacen: string = '';
   demandanteAlmacen: string = 'N';
   inactiveAlmacen: string = 'N';

     // DETALLE
  columnas: any[];
  items: MenuItem[];
  detalle: ISolicitudCompraDetalle[] = [];
  detalleSelected: ISolicitudCompraDetalle;

  // MODAL: Artículo
  itemCode: string = '';
  indexArticulo: number = 0;
  isVisualizarArticulo: boolean = false;

   // MODAL: Almacen - Item
   indexAlmacenOrigen: number = 0;
   indexAlmacenDestino: number = 0;
   inactiveAlmacenItem: string = 'N';
   demandanteAlmacenItem: string = 'Y';
   isVisualizarAlmacenOrigen: boolean = false;
   isVisualizarAlmacenDestino: boolean = false;

   // MODAL: Empleado de ventas
   slpCode: number = 0;


  constructor
  (
    private router: Router,
    private fb: FormBuilder,
    public app: LayoutComponent,
    public lenguageService: LanguageService,
    private userContextService: UserContextService,
    public readonly utilService: UtilService,
    private readonly swaCustomService: SwaCustomService,
    private solicitudCompraService: SolicitudCompraService,
  ) {}

  ngOnInit() {
    this.onBuildForm();
    //this.getNumber();
    this.getListEstado();
    this.getListDocType();
    this.onBuildColumn();
    this.getListContextMenu();
  }

  onBuildForm() {
    this.modeloFormCab1 = this.fb.group(
    {
      'nomSolicitante'  : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required])),
      'sucursal'        : new FormControl({ value: '', disabled: true }),
      'departamento'    : new FormControl({ value: '', disabled: true }),
    });

    this.modeloFormCab2 = this.fb.group(
    {
      'number'      : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required])),
      'docNum'      : new FormControl({ value: '', disabled: true }),
      'docStatus'   : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required])),
      'docDate'     : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'docDueDate'  : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'reqDate'     : new FormControl(new Date(new Date()), Validators.compose([Validators.required]))
    });

    this.modeloFormDet1 = this.fb.group(
    {
      'docType'     : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
    });

    this.modeloFormPie1 = this.fb.group(
    {
      'empId'    : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'comments' : new FormControl(''),
    });

    this.addLine();
  }

  getListContextMenu() {
    this.items =
    [
      {label: 'Añadir línea', icon: 'pi pi-plus',   command: () => this.onClickAddLine() },
      {label: 'Borrar línea', icon: 'pi pi-trash',  command: () => this.onClickDelete(this.detalleSelected) }
    ];
  }

  onBuildColumn() {
    if(this.docTypSelected.value === 'I')
    {
      this.columnas =
      [
        { field: 'itemCode',      header: 'Código' },
        { field: 'itemName',      header: 'Descripción' },
        { field: 'reqDate',       header: 'Fecha necesaria' },
        { field: 'fortmatCode',   header: 'Cuenta mayor' },
        { field: 'ocrCode',       header: 'Centro de costos' },
        { field: 'tipOperacion',  header: 'Tipo de operación' },
        { field: 'whsCode',       header: 'Almacén' },
        { field: 'unitMsr',       header: 'UM' },
        { field: 'quantity',      header: 'Cantidad' },
      ];
    }
    else if(this.docTypSelected.value === 'S')
    {
      this.columnas =
      [
        { field: 'itemName',      header: 'Descripción' },
        { field: 'reqDate',       header: 'Fecha necesaria' },
        { field: 'fortmatCode',   header: 'Cuenta mayor' },
        { field: 'ocrCode',       header: 'Centro de costos' },
        { field: 'tipOperacion',  header: 'Tipo de operación' },
      ];
    }
  }

  getNumber() {
    this.solicitudCompraService.getNumber()
    .subscribe({next:(data: ISolicitudCompra) =>{
      this.modeloFormCab2.patchValue({ number: data.number });
      },error:(e)=>{
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  getListEstado() {
    this.docStatus =
    [
      { statusCode  : '01', statusName: 'Abierto'},
      { statusCode  : '02', statusName: 'Cerrado'},
    ];

    this.docStatusList = [];
    for (let item of this.docStatus) {
      this.docStatusList.push({ label: item.statusName, value: item.statusCode });
    }
    const item: any = this.docStatusList.find(x=>x.value === '01');
    this.modeloFormCab2.controls['docStatus'].setValue({ label: item.label, value: item.value });
  }

  getListDocType() {
    this.docType =
    [
      { docTypeCode  : 'I', docTypeName: 'Artículo'},
      { docTypeCode  : 'S', docTypeName: 'Servicio'},
    ];

    this.docTypesList = [];
    for (let item of this.docType) {
      this.docTypesList.push({ label: item.docTypeName, value: item.docTypeCode });
    }
    const item: any = this.docTypesList.find(x=>x.value === 'I');
    this.modeloFormDet1.controls['docType'].setValue({ label: item.label, value: item.value });

    this.docTypSelected = { label: 'Artículo', value: 'I' };
  }

  onChengeDocType()
  {
    this.onBuildColumn();
    console.log("DocType: ",this.docTypSelected);
  }


  //#region <<< DETALLE >>>
  //=======================================================================================================================
  //============================= INI: ARTICULO ===========================================================================
  //=======================================================================================================================
  onOpenArticulo(index: number) {
    this.indexArticulo = index;
    this.isVisualizarArticulo = !this.isVisualizarArticulo;
  }

  onSelectedArticulo(value: any) {
    this.detalle[this.indexArticulo].itemCode = value.itemCode;
    this.detalle[this.indexArticulo].dscription = value.itemName;
    // if (this.modeloFormCab3.controls['whsCodeOrigen'].value) {
    //   let itemAlmacenOrigen = this.modeloFormCab3.controls['whsCodeOrigen'].value;
    //   this.detalle[this.indexArticulo].fromWhsCod = itemAlmacenOrigen;
    // }
    // else
    // {
    //   if(value.dfltWH)
    //   {
    //     this.detalle[this.indexArticulo].fromWhsCod = value.dfltWH;
    //   }
    // }
    // if (this.modeloFormCab3.controls['whsCodeDestino'].value) {
    //   let itemAlmacenDestino = this.modeloFormCab3.controls['whsCodeDestino'].value;
    //   this.detalle[this.indexArticulo].whsCode = itemAlmacenDestino;
    // }
    // else
    // {
    //   this.detalle[this.indexArticulo].whsCode = value.dfltWH;
    // }
    this.detalle[this.indexArticulo].unitMsr = value.invntryUom;
    this.detalle[this.indexArticulo].quantity = 1;
    this.detalle[this.indexArticulo].openQty = 1;
    this.detalle[this.indexArticulo].openQtyRding = 1;
    this.isVisualizarArticulo = !this.isVisualizarArticulo;
  }

  onClickCloseArticulo()
  {
    this.isVisualizarArticulo = !this.isVisualizarArticulo;
  }
  //=======================================================================================================================
  //============================= FIN: ARTICULO ===========================================================================
  //=======================================================================================================================


  //=======================================================================================================================
  //============================= INI: ALMACEN ============================================================================
  //=======================================================================================================================
  onOpenAlmacenOrigen(value: ISolicitudCompraDetalle, index: number) {
    this.indexAlmacenOrigen = index;
    this.itemCode = value.itemCode;
    this.isVisualizarAlmacenOrigen = !this.isVisualizarAlmacenOrigen;
  }

  onOpenAlmacenDestino(value: ISolicitudCompraDetalle, index: number) {
    this.indexAlmacenDestino = index;
    this.itemCode = value.itemCode;
    this.isVisualizarAlmacenDestino = !this.isVisualizarAlmacenDestino;
  }

  onSelectedAlmacenOrigenItem(value: any) {
    this.detalle[this.indexAlmacenOrigen].fromWhsCod = value.whsCode;
    this.isVisualizarAlmacenOrigen = !this.isVisualizarAlmacenOrigen;
  }

  onSelectedAlmacenDestinoItem(value: any) {
    this.detalle[this.indexAlmacenDestino].whsCode = value.whsCode;
    this.isVisualizarAlmacenDestino = !this.isVisualizarAlmacenDestino;
  }

  onClickCloseAlmacenOrigen()
  {
    this.isVisualizarAlmacenOrigen = !this.isVisualizarAlmacenOrigen;
  }
  onClickCloseAlmacenDestino()
  {
    this.isVisualizarAlmacenDestino = !this.isVisualizarAlmacenDestino;
  }
  //=======================================================================================================================
  //============================= FIN: ALMACEN ============================================================================
  //=======================================================================================================================

  onChangeQuantity(value: ISolicitudCompraDetalle, index: number)
  {
      let quantity   : number = 0;
      let openQty    : number = 0;
      let openQtyRd  : number = 0;

      quantity  = this.utilService.onRedondearDecimal(value.quantity, 3);
      openQty   = this.utilService.onRedondearDecimal(value.quantity, 3);
      openQtyRd = this.utilService.onRedondearDecimal(value.quantity, 3);

      this.detalle[index].quantity  = value.itemCode === '' ? 0 : quantity;
      this.detalle[index].openQty   = value.itemCode === '' ? 0 : openQty;
      this.detalle[index].openQtyRding = value.itemCode === '' ? 0 : openQtyRd;
  }

  addLine()
  {
    let exiete: boolean = false;
    this.detalle.forEach(item=>{
      if(item.itemCode === ""){
        exiete = true;
        return;
      }
    });

    if(!exiete)
    {
      this.detalle.push({id: 0, line:0, lineStatus: '01', itemCode: '', dscription: '', fromWhsCod: '', whsCode: '', unitMsr: '', quantity: 0, openQty: 0, openQtyRding: 0 });
    }
  }

  onClickAddLine()
  {
    this.addLine();
  }

  onClickDelete(value: ISolicitudCompraDetalle)
  {
    let index = this.detalle.indexOf(value);
    this.detalle.splice(+index, 1);

    if(this.detalle.length === 0)
    {
      this.addLine();
    }
  }

  //#endregion


  onSelectedEmpleadoVenta(value: any) {
    this.modeloFormPie1.patchValue({ 'empId' : value.slpCode });
  }


  //#region <<< SAVE >>>
  onValidatedSave(){
    let reg: number = 0;

    // if (!this.modeloFormCab2.controls['estado'].value) {
    //   this.isSaving = false;
    //   this.swaCustomService.swaMsgInfo('Seleccione el estado.');
    //   return false;
    // }

    // if (this.modeloFormCab2.controls['estado'].value) {
    //   let itemEstado = this.modeloFormCab2.controls['estado'].value;
    //   codEstado = itemEstado.value;
    // }

    // if (codEstado !== '01')
    // {
    //   this.isSaving = false;
    //   this.swaCustomService.swaMsgInfo('El estado no es válido.');
    //   return false;
    // }

    for (let index = 0; index < this.detalle.length; index++) {
      if(this.detalle[index].itemCode === '')
      {
        reg++;
      }
    }

    if(reg > 0)
    {
      this.isSaving = false;
      this.swaCustomService.swaMsgInfo('Ingrese los datos en el detalle de la solicitud.');
      return false;
    }

    for (let index = 0; index < this.detalle.length; index++) {
      if(this.detalle[index].itemCode !== '')
      {
        if(this.detalle[index].fromWhsCod === this.detalle[index].whsCode)
        {
          this.isSaving = false;
          this.swaCustomService.swaMsgInfo('El almacén de destino no puede ser idéntico al almacén de Origen.');
          return false;
        }
      }
      if (this.detalle[index].quantity === 0)
      {
        this.isSaving = false;
        this.swaCustomService.swaMsgInfo('La cantidad debe ser mayor que CERO (0).');
        return false;
      }
    }

    return true;
  }

  save() {
    this.isSaving = true;
    if(!this.onValidatedSave()) return;

    // CAB 02: SOLICITUD DE TRASLADO
    this.modeloSave.docDate = this.modeloFormCab2.controls['docDate'].value;
    this.modeloSave.docDueDate = this.modeloFormCab2.controls['docDueDate'].value;
    this.modeloSave.taxDate = this.modeloFormCab2.controls['taxDate'].value;

    // PIE 01: SOLICITUD DE TRASLADO
    this.modeloSave.empId     = this.modeloFormPie1.controls['empId'].value;
    this.modeloSave.comments  = this.modeloFormPie1.controls['comments'].value;

    this.modeloSave.idUsuarioCreate = this.userContextService.getIdUsuario();

    this.modeloSave.linea = [];

    for (let index = 0; index < this.detalle.length; index++) {
      if(this.detalle[index].itemCode !== '')
      {
        this.modeloSave.linea.push
        ({
          id                  : 0,
          line                : index,
          itemCode            : this.detalle[index].itemCode,
          dscription          : this.detalle[index].dscription,
          fromWhsCod          : this.detalle[index].fromWhsCod,
          whsCode             : this.detalle[index].whsCode,
          unitMsr             : this.detalle[index].unitMsr,
          quantity            : this.detalle[index].quantity,
          openQty             : this.detalle[index].openQty,
          openQtyRding        : this.detalle[index].openQtyRding,
          idUsuarioCreate     : this.userContextService.getIdUsuario()
        });
      }
    }

    this.solicitudCompraService.setCreate(this.modeloSave)
    .subscribe({ next: (data:any)=>{
        this.isSaving = false;
        this.swaCustomService.swaMsgExito(null);
        this.onClickBack();
      },
      error:(e)=>{
        this.isSaving = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onClickSave() {
    this.swaCustomService.swaConfirmation(
      this.globalConstants.titleGrabar,
      this.globalConstants.subTitleGrabar,
      this.globalConstants.icoSwalQuestion
    ).then((result) => {
      if (result.isConfirmed) {
        this.save();
      }
    });
  }

  //#endregion


  onClickBack() {
    this.router.navigate(['/main/modulo-com/panel-solicitud-compra-list']);
  }
}
