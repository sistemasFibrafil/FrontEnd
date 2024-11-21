import { MenuItem, SelectItem } from 'primeng/api';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';
import { LayoutComponent } from 'src/app/layout/layout.component';
import { UtilService } from 'src/app/services/util.service';
import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { UserContextService } from 'src/app/services/user-context.service';

import { ISolicitudTraslado } from 'src/app/modulos/modulo-inventario/interfaces/solicitud-traslado.interface';
import { ITransferenciaStock, ITransferenciaStockDetalle } from 'src/app/modulos/modulo-inventario/interfaces/transferencia-stock.interface';
import { TransferenciaStockCreateModel } from 'src/app/modulos/modulo-inventario/models/transferencia-stock.model';
import { TransferenciaStockService } from 'src/app/modulos/modulo-inventario/services/web/transferencia-stock.service';
import { LecturaService } from 'src/app/modulos/modulo-inventario/services/web/lectura.service';


interface DocStatus {
  statusCode  : string,
  statusName  : string
}

@Component({
  selector: 'app-inv-panel-transferencia-stock-create',
  templateUrl: './panel-transferencia-stock-create.component.html',
  styleUrls: ['./panel-transferencia-stock-create.component.css']
})
export class PanelPanelTransferenciaStockCreateComponent implements OnInit {

  // Titulo del componente
  titulo = 'Transferencia de Stock';

  modeloFormCab1: FormGroup;
  modeloFormCab2: FormGroup;
  modeloFormCab3: FormGroup;
  modeloFormTra: FormGroup;
  modeloFormOtr: FormGroup;
  modeloFormPie1: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  params: any;
  codSede: number = 0;
  jrnlMemo: string = 'Traslado - '
  docStatus: DocStatus[];
  docStatusList: SelectItem[];
  modeloSave: TransferenciaStockCreateModel = new TransferenciaStockCreateModel();

  // MODAL: Progreso
  isSaving: boolean = false;
  isDisplay: boolean = false;

  // MODAL: CLiente
  cardCode: string = '';
  cntctCode: number = 0;

  // MODAL: Tipo de documento
  tipDocumento: string = '';


   // MODAL: Almacen
   whsCodeOrigen: string = '';
   whsCodeDestino: string = '';
   itemCodeAlmacen: string = '';
   demandanteAlmacen: string = 'N';
   inactiveAlmacen: string = 'N';

   // MODAL: Tipo de transporte
   codTipTransporte: string = '';

   // MODAL: Tipo de documento transportista
   tipDocTransportista: string = '';

   // MODAL: Tipo de documento conductor
   tipDocConductor: string = '';

   // MODAL: Tipo de traslado
   codTipTraslado: string = '';

   // MODAL: Motivo de traslado
   codMotTraslado: string = '';

   // MODAL: Tipo de salida
   codTipSalida: string = '';

  // DETALLE
  columnas: any[];
  items: MenuItem[];
  detalle: any[] = [];
  lectura: ITransferenciaStockDetalle[] = [];
  detalleSelected: ITransferenciaStockDetalle;

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
    private readonly route: ActivatedRoute,
    public lenguageService: LanguageService,
    public readonly utilService: UtilService,
    private userContextService: UserContextService,
    private readonly swaCustomService: SwaCustomService,
    private lecturaService: LecturaService,
    private transferenciaStockService: TransferenciaStockService,
  ) {}

  ngOnInit() {
    this.onBuildForm();
    this.onBuildColumn();
    this.getNumber();
    this.getListEstado();
    this.getListContextMenu();
    this.codSede = this.userContextService.getCodSede();

    this.route.params.subscribe((params: Params) => {
      this.params = JSON.parse(params["json"]);
      if(this.params.idBase !== 0)
      {
        setTimeout(() => {
          this.getListCopy(this.params);
        },10);
      }
    });
  }


  onBuildForm() {
    this.modeloFormCab1 = this.fb.group(
    {
      'cardCode'        : new FormControl({ value: '', disabled: true }),
      'cardName'        : new FormControl({ value: '', disabled: true }),
      'cntctCode'       : new FormControl({ value: '', disabled: true }),
      'address'         : new FormControl({ value: '', disabled: true })
    });
    this.modeloFormCab2 = this.fb.group(
    {
      'number'        : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required])),
      'docNum'        : new FormControl({ value: '', disabled: true }),
      'docStatus'     : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required])),
      'tipDocumento'  : new FormControl({ value: '', disabled: true }),
      'serDocumento'  : new FormControl({ value: '', disabled: true }),
      'numDocumento'  : new FormControl({ value: '', disabled: true }),
      'docDate'       : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'docDueDate'    : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'taxDate'       : new FormControl(new Date(new Date()), Validators.compose([Validators.required]))
    });

    this.modeloFormCab3 = this.fb.group(
    {
      'whsCodeOrigen'   : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'whsCodeDestino'  : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
    });

    this.modeloFormTra = this.fb.group(
    {
      'codTipTraslado'      : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'tipDocTransportista' : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'rucTransportista'    : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'nomTransportista'    : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'numPlaTransportista' : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'tipDocConductor'     : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'numDocConductor'     : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'nomConductor'        : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'ApeConductor'        : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'nomComConductor'     : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'numLicComConductor'  : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
    });

    this.modeloFormOtr = this.fb.group(
    {
      'codTipTraslado'  : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'codMotTraslado'  : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'codTipSalida'    : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
    });

    this.modeloFormPie1 = this.fb.group(
    {
      'slpCode'  : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'numBulto' : new FormControl({ value: '0.00', disabled: false }, Validators.compose([Validators.required])),
      'totKilo'  : new FormControl({ value: '0.00', disabled: false }, Validators.compose([Validators.required])),
      'jrnlMemo' : new FormControl(this.jrnlMemo),
      'comments' : new FormControl(''),
    });

    this.addLine();
  }

  getListContextMenu() {
    this.items =
    [
      {label: 'Añadir línea', icon: 'pi pi-plus'  },
      {label: 'Borrar línea', icon: 'pi pi-trash' },
      {label: 'Visualizar',   icon: 'pi pi-eye',   command: () => this.onClickVisualizar() }
    ];
  }

  onBuildColumn() {
    this.columnas =
    [
      { field: 'itemCode',    header: 'Código' },
      { field: 'itemName',    header: 'Descripción' },
      { field: 'fromWhsCod',  header: 'Almacén de origen' },
      { field: 'whsCode',     header: 'Almacén de destino' },
      { field: 'unitMsr',     header: 'UM' },
      { field: 'quantity',    header: 'Cantidad' }
    ];
  }


  //#region <<< MODAL: Cliente >>>
  onSelectedSocioNegocio(value: any) {
    this.cardCode = value.cardCode;
    this.cntctCode = value.cntctCode;
    this.modeloFormCab1.patchValue({ 'cardCode': value.cardCode, 'cardName': value.cardName, 'address': value.address2, 'cntctCode': value.cntctCode });

    const jrnlMemoNew: string = this.jrnlMemo + this.cardCode;
    this.modeloFormPie1.patchValue({ 'jrnlMemo' :  jrnlMemoNew });
  }

  onSelectedPersonaContacto(value: any) {
    this.cntctCode = value.cntctCode;
    this.modeloFormCab1.patchValue({ 'cntctCode' : value.cntctCode });
  }
  //#endregion

  getNumber() {
    this.transferenciaStockService.getNumber()
    .subscribe({next:(data: ITransferenciaStock) =>{
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

  onSelectedTipoDocumento(value: any) {
    this.tipDocumento = value.codTipoDocumento;
    this.modeloFormCab2.patchValue({ 'tipDocumento' : value.codTipoDocumento });
  }

  onSelectedSerieDocumento(value: any) {
    this.modeloFormCab2.patchValue({ 'serDocumento' : value.serDocumento });
    this.modeloFormCab2.patchValue({ 'numDocumento' : value.numDocumento });
  }

  onSelectedAlmacenOrigen(value: any) {
    setTimeout(() => {
      this.modeloFormCab3.patchValue({ 'whsCodeOrigen' : value.whsCode });
      this.detalle.forEach(x => {
        if(x.itemCode !== '')
        {
          x.fromWhsCod = value.whsCode;
        }
      });
    }, 10);
  }

  onSelectedAlmacenDestino(value: any) {
    setTimeout(() => {
      this.modeloFormCab3.patchValue({ 'whsCodeDestino' : value.whsCode });
      this.detalle.forEach(x => {
        if(x.itemCode !== '')
        {
          x.whsCode = value.whsCode;
        }
      });
    }, 10);
  }

  //#region <<< Transportista >>>
  onSelectedTipoTransporte(value: any) {
    this.modeloFormTra.patchValue({ 'codTipTraslado' : value.fldValue });
  }

  onSelectedTipoDocumentoTransportista(value: any) {
    this.modeloFormTra.patchValue({ 'tipDocTransportista' : value.fldValue });
  }

  onSelectedTipoDocumentoConductor(value: any) {
    this.modeloFormTra.patchValue({ 'tipDocConductor' : value.fldValue });
  }
  //#endregion


  //#region <<< Otro >>>
  onSelectedTipoTraslado(value: any) {
    this.modeloFormOtr.patchValue({ 'codTipTraslado' : value.fldValue });
  }

  onSelectedMotivoTraslado(value: any) {
    this.modeloFormOtr.patchValue({ 'codMotTraslado' : value.fldValue });
  }

  onSelectedTipoSalida(value: any) {
    this.modeloFormOtr.patchValue({ 'codTipSalida' : value.fldValue });
  }
  //#endregion


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
    if (this.modeloFormCab3.controls['whsCodeOrigen'].value) {
      let itemAlmacenOrigen = this.modeloFormCab3.controls['whsCodeOrigen'].value;
      this.detalle[this.indexArticulo].fromWhsCod = itemAlmacenOrigen;
    }
    else
    {
      if(value.dfltWH)
      {
        this.detalle[this.indexArticulo].fromWhsCod = value.dfltWH;
      }
    }
    if (this.modeloFormCab3.controls['whsCodeDestino'].value) {
      let itemAlmacenDestino = this.modeloFormCab3.controls['whsCodeDestino'].value;
      this.detalle[this.indexArticulo].whsCode = itemAlmacenDestino;
    }
    else
    {
      this.detalle[this.indexArticulo].whsCode = value.dfltWH;
    }
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
  onOpenAlmacenOrigen(value: ITransferenciaStockDetalle, index: number) {
    this.indexAlmacenOrigen = index;
    this.itemCode = value.itemCode;
    this.isVisualizarAlmacenOrigen = !this.isVisualizarAlmacenOrigen;
  }

  onOpenAlmacenDestino(value: ITransferenciaStockDetalle, index: number) {
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

  onChangeQuantity(value: ITransferenciaStockDetalle, index: number)
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

  onClickDelete(value: ITransferenciaStockDetalle)
  {
    let index = this.detalle.indexOf(value);
    this.detalle.splice(+index, 1);

    if(this.detalle.length === 0)
    {
      this.addLine();
    }
  }

  onClickVisualizar()
  {}

  onInputBulto(event)
  {
    debugger
    console.log("INPUT 1: ", event);
    let reg: number = event.value === null? 0 : 100;
    console.log("INPUT 2: ", reg);
    this.modeloFormPie1.patchValue({ 'numBulto' : reg });
  }

  //#endregion


  onSelectedEmpleadoVenta(value: any) {
    this.modeloFormPie1.patchValue({ 'slpCode' : value.slpCode });
  }

  set(data: ITransferenciaStock)
  {
    setTimeout(() => {
      this.cardCode       = data.cardCode;
      this.cntctCode      = data.cntctCode;
      this.whsCodeOrigen  = data.filler;
      this.whsCodeDestino = data.toWhsCode;
      this.codTipTraslado = data.codTipTraslado;
      this.codMotTraslado = data.codMotTraslado;
      this.codTipSalida   = data.codTipSalida;
      this.slpCode        = data.slpCode;
    }, 10);

    const status = this.docStatus.find(x => x.statusCode === data.docStatus);

    this.modeloFormCab2.controls['number'].setValue( data.number );
    this.modeloFormCab2.controls['docNum'].setValue( data.docNum );
    this.modeloFormCab2.controls['docStatus'].setValue({ label: status.statusName, value: status.statusCode });
    this.modeloFormCab2.controls['docDate'].setValue( data.docDate == null ?  null : new Date(data.docDate) );
    this.modeloFormCab2.controls['docDueDate'].setValue( data.docDueDate == null ?  null : new Date(data.docDueDate) );
    this.modeloFormCab2.controls['taxDate'].setValue( data.taxDate == null ?  null : new Date(data.taxDate) );
    this.modeloFormPie1.controls['jrnlMemo'].setValue( data.jrnlMemo );
    this.modeloFormPie1.controls['comments'].setValue( data.comments );
  }

  getGroupByAndSum(data: ITransferenciaStockDetalle[]): { baseType: string, baseEntry: number, baseLine: number, itemCode: string, dscription: string, fromWhsCod: string, whsCode: string, unitMsr: string, quantity: number } [] {
    const result = data.reduce((acc, current) => {
      const { baseType, baseEntry, baseLine, itemCode, dscription, fromWhsCod, whsCode, unitMsr, quantity } = current;

      const key = `${itemCode}-${dscription}`;

      if (acc[key]) {
        acc[key].quantity += quantity;
      } else {
        acc[key] = { baseType, baseEntry, baseLine, itemCode, dscription, fromWhsCod, whsCode, unitMsr, quantity };
      }

      return acc;
    }, {} as Record<string, { baseType: string, baseEntry: number, baseLine: number, itemCode: string, dscription: string, fromWhsCod: string, whsCode: string, unitMsr: string, quantity: number }>);
    return Object.values(result);
  }

  getListCopy(params: any)
  {
    this.lecturaService.getLecturaCopyToTransferencia(params)
    .subscribe({next:(data: any) =>{
      setTimeout(() => {
        this.set(data);
      }, 10);
      setTimeout(() => {
        this.lectura = data.linea;
        this.detalle = this.getGroupByAndSum(this.lectura);
      }, 1000);
      },error:(e)=>{
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }


  //#region <<< SAVE >>>
  onValidatedSave(){
    let reg: number = 0;
    const fromWhsCode = this.modeloFormCab3.controls['whsCodeOrigen'].value;
    const toWhsCode = this.modeloFormCab3.controls['whsCodeDestino'].value;

    if(fromWhsCode === toWhsCode)
    {
      this.isSaving = false;
      this.swaCustomService.swaMsgInfo('El almacén de destino no puede ser idéntico al almacén de Origen.');
      return false;
    }

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
        return;
      }
    }

    return true;
  }

  save() {
    this.isSaving = true;
    if(!this.onValidatedSave()) return;

    // CAB 02: SOCIO NEGOCIO
    this.modeloSave.cardCode = this.modeloFormCab1.controls['cardCode'].value;
    this.modeloSave.cardName = this.modeloFormCab1.controls['cardName'].value;
    if (this.modeloFormCab1.controls['cntctCode'].value)
    {
      this.modeloSave.cntctCode = this.modeloFormCab1.controls['cntctCode'].value;
    }
    this.modeloSave.address = this.modeloFormCab1.controls['address'].value;

    // CAB 02: SOLICITUD DE TRASLADO
    this.modeloSave.docDate = this.modeloFormCab2.controls['docDate'].value;
    this.modeloSave.docDueDate = this.modeloFormCab2.controls['docDueDate'].value;
    this.modeloSave.taxDate = this.modeloFormCab2.controls['taxDate'].value;

    // CAB 03: SOLICITUD DE TRASLADO
    this.modeloSave.filler = this.modeloFormCab3.controls['whsCodeOrigen'].value;
    this.modeloSave.toWhsCode = this.modeloFormCab3.controls['whsCodeDestino'].value;
    // OTROS
    this.modeloSave.codTipTraslado = this.modeloFormOtr.controls['codTipTraslado'].value;
    this.modeloSave.codMotTraslado = this.modeloFormOtr.controls['codMotTraslado'].value;
    this.modeloSave.codTipSalida = this.modeloFormOtr.controls['codTipSalida'].value;

    // PIE 01: SOLICITUD DE TRASLADO
    this.modeloSave.slpCode= this.modeloFormPie1.controls['slpCode'].value;
    this.modeloSave.jrnlMemo = this.modeloFormPie1.controls['jrnlMemo'].value;
    this.modeloSave.comments = this.modeloFormPie1.controls['comments'].value;

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

    this.transferenciaStockService.setCreate(this.modeloSave)
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
    this.router.navigate(['/main/modulo-inv/panel-transferencia-stock-list']);
  }
}
