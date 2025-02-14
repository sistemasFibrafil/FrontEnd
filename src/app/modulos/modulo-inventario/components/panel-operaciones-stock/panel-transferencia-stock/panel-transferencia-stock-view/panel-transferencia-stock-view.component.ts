import Swal from 'sweetalert2';
import { SelectItem } from 'primeng/api';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';
import { LayoutComponent } from 'src/app/layout/layout.component';
import { UtilService } from 'src/app/services/util.service';
import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { UserContextService } from 'src/app/services/user-context.service';

import { ILectura } from 'src/app/modulos/modulo-inventario/interfaces/web/lectura.inteface';
import { ITransferenciaStock, ITransferenciaStockDetalle } from 'src/app/modulos/modulo-inventario/interfaces/web/transferencia-stock.interface';
import { TransferenciaStockUpdateModel } from 'src/app/modulos/modulo-inventario/models/web/transferencia-stock.model';
import { TransferenciaStockService } from 'src/app/modulos/modulo-inventario/services/web/transferencia-stock.service';
import { LecturaService } from 'src/app/modulos/modulo-inventario/services/web/lectura.service';
import { SerieNumeracionSapService } from 'src/app/modulos/modulo-gestion/services/sap/inicializacion-sistema/serie-numeracion-sap.service';


@Component({
  selector: 'app-inv-panel-transferencia-stock-view',
  templateUrl: './panel-transferencia-stock-view.component.html',
  styleUrls: ['./panel-transferencia-stock-view.component.css']
})
export class PanelPanelTransferenciaStockViewComponent implements OnInit {

  // Titulo del componente
  titulo = 'Transferencia de Stock';

  modeloFormCab1: FormGroup;
  modeloFormCab2: FormGroup;
  modeloFormCab3: FormGroup;
  modeloFormTra: FormGroup;
  modeloFormOtr: FormGroup;
  modeloFormPie1: FormGroup;
  modeloFormBar: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  params: any;
  codSede: number = 0;
  jrnlMemo: string = 'Traslado - '
  modelo: ITransferenciaStock;
  modeloSave: TransferenciaStockUpdateModel = new TransferenciaStockUpdateModel();

  id      : number = 0;
  docEntry: number = 0;

  // MODAL: Progreso
  isSaving: boolean = false;
  isDisplay: boolean = false;

  // MODAL: CLiente
  cardCode: string = '';
  cntctCode: number = 0;

  // MODAL: Tipo de documento
  tipDocumento: string = '';

  // MODAL: Serie de documento
  serDocumento: string = '';

  // MODAL: Almacen
  whsCodeOrigen: string = '';
  whsCodeDestino: string = '';
  itemCodeAlmacen: string = '';
  demandanteAlmacen: string = 'N';
  inactiveAlmacen: string = 'N';

  // MODAL: Tipo de transporte
  codTipTransporte: string = '';

  // MODAL: Tipo de documento transportista
  codTipDocTransportista: string = '';

  // MODAL: Tipo de documento conductor
  codTipDocConductor: string = '';

  // MODAL: Tipo de traslado
  codTipTraslado: string = '';

  // MODAL: Motivo de traslado
  codMotTraslado: string = '';

  // MODAL: Tipo de salida
  codTipSalida: string = '';

  // DETALLE
  columnas: any[];
  opciones: any = [];
  detalle: any[] = [];
  bardcodeList: any[];
  detalleSelected: ITransferenciaStockDetalle;
  lectura: ITransferenciaStockDetalle[] = [];

  // MODAL: Almacen - Item
  itemCode: string = '';
  indexArticulo: number = 0;
  indexAlmacenOrigen: number = 0;
  indexTipoOperacion: number = 0;
  indexAlmacenDestino: number = 0;
  inactiveAlmacenItem: string = 'N';
  demandanteAlmacenItem: string = 'Y';
  isVisualizarBarcode: boolean = false;
  isVisualizarArticulo: boolean = false;
  isVisualizarTipoOperacion: boolean = false;
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
    public readonly utilService: UtilService,
    private readonly swaCustomService: SwaCustomService,
    public lenguageService: LanguageService,
    private lecturaService: LecturaService,
    private userContextService: UserContextService,
    private serieNumeracionSapService: SerieNumeracionSapService,
    private transferenciaStockService: TransferenciaStockService,
  ) {}

  ngOnInit() {
    this.onBuildForm();
    this.onBuildColumn();
    this.opcionesTabla();
    this.codSede = this.userContextService.getCodSede();

    this.route.params.subscribe((params: Params) => {
      this.id = Number(params["id"]);
      setTimeout(() => {
      this.getById(this.id);
      }, 10);
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
      'docNum'        : new FormControl({ value: '', disabled: true  }),
      'tipDocumento'  : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'serDocumento'  : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'numDocumento'  : new FormControl({ value: '', disabled: true  }, Validators.compose([Validators.required])),
      'docDate'       : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required])),
      'docDueDate'    : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required])),
      'taxDate'       : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required])),
    });

    this.modeloFormCab3 = this.fb.group(
    {
      'whsCodeOrigen'   : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'whsCodeDestino'  : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
    });

    this.modeloFormTra = this.fb.group(
    {
      'codTipTransporte'        : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'codTipDocTransportista'  : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'numTipoDocTransportista' : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'nomTransportista'        : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'numPlaVehTransportista'  : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),

      'codTipDocConductor'      : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'numTipoDocConductor'     : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'nomConductor'            : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'apeConductor'            : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'nomComConductor'         : new FormControl({ value: '', disabled: true  }, Validators.compose([Validators.required])),
      'numLicConductor'         : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
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

    this.modeloFormBar = this.fb.group(
    {
      'text1' : new FormControl(''),
    });
  }

  onBuildColumn() {
    this.columnas =
    [
      { field: 'itemCode',        header: 'Código' },
      { field: 'barcode',         header: 'Barcode' },
      { field: 'quantity',        header: 'Cantidad' },
      { field: 'peso',            header: 'Peso' }
    ];
  }

  opcionesTabla() {
    this.opciones = [
      { label: 'Visualizar',        icon: 'pi pi-eye',       command: () => { this.onClickVisualizar() } },
    ];
  }

  onSelectedItem(modelo: ITransferenciaStockDetalle) {
      this.detalleSelected = modelo;
      if(this.detalle.filter(x => x.itemCode === '').length === 0){
        this.opciones.find(x => x.label == "Visualizar").visible = true;
      } else {
        this.opciones.find(x => x.label == "Visualizar").visible = false;
      }
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

  //#region <<< Datos de sunat >>>
  onSelectedTipoDocumento(value: any) {
    this.tipDocumento = value.codTipoDocumento;
    this.modeloFormCab2.patchValue({ 'tipDocumento' : value.codTipoDocumento });
  }

  onSelectedSerieDocumento(value: any) {
    this.modeloFormCab2.patchValue({ 'serDocumento' : value.serDocumento });
    this. getNumDocumentoByTipoAndSerie(value.tipDocumento, value.serDocumento);
  }

  getNumDocumentoByTipoAndSerie(tipDocumento: string, serDocumento: string) {
    const params = { cod1: tipDocumento, cod2: serDocumento };
    this.serieNumeracionSapService.getNumDocumentoByTipoAndSerie(params)
    .subscribe({next:(data: any) =>{
      this.modeloFormCab2.patchValue({ 'numDocumento': data.numDocumento });
      },error:(e)=>{
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }
  //#endregion


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
    this.modeloFormTra.patchValue({ 'codTipTransporte' : value.fldValue });
  }

  onChangeNomConductor()
  {
    const nomConductor = this.modeloFormTra.controls['nomConductor'].value;
    const apeConductor = this.modeloFormTra.controls['apeConductor'].value;
    const nomComConductor = nomConductor + ' ' + apeConductor;

    this.modeloFormTra.controls['nomComConductor'].setValue( nomComConductor );
  }

  onSelectedTipoDocumentoTransportista(value: any) {
    this.modeloFormTra.patchValue({ 'codTipDocTransportista' : value.fldValue });
  }

  onSelectedTipoDocumentoConductor(value: any) {
    this.modeloFormTra.patchValue({ 'codTipDocConductor' : value.fldValue });
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


  //#region <<< Detalle >>>
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

  onSelectedAlmacenOrigenItem(value: any) {
    this.detalle[this.indexAlmacenOrigen].fromWhsCod = value.whsCode;
    this.isVisualizarAlmacenOrigen = !this.isVisualizarAlmacenOrigen;
  }

  onClickCloseAlmacenOrigen()
  {
    this.isVisualizarAlmacenOrigen = !this.isVisualizarAlmacenOrigen;
  }

  onOpenAlmacenDestino(value: ITransferenciaStockDetalle, index: number) {
    this.indexAlmacenDestino = index;
    this.itemCode = value.itemCode;
    this.isVisualizarAlmacenDestino = !this.isVisualizarAlmacenDestino;
  }

  onSelectedAlmacenDestinoItem(value: any) {
    this.detalle[this.indexAlmacenDestino].whsCode = value.whsCode;
    this.isVisualizarAlmacenDestino = !this.isVisualizarAlmacenDestino;
  }

  onClickCloseAlmacenDestino()
  {
    this.isVisualizarAlmacenDestino = !this.isVisualizarAlmacenDestino;
  }
  //=======================================================================================================================
  //============================= FIN: ALMACEN ============================================================================
  //=======================================================================================================================

  //=======================================================================================================================
  //============================= INI: TIPO DE OPERACION ==================================================================
  //=======================================================================================================================
  onOpenTipoOperacion(value: ITransferenciaStockDetalle, index: number) {
    this.indexTipoOperacion = index;
    this.isVisualizarTipoOperacion = !this.isVisualizarTipoOperacion;
  }

  onSelectedTipoOperacionItem(value: any) {
    let baseEntry: number = this.detalle[this.indexTipoOperacion].baseEntry;
    let baseLine: number = this.detalle[this.indexTipoOperacion].baseLine;

    this.detalle[this.indexTipoOperacion].codTipOperacion = value.code;

    setTimeout(() => {
      this.lectura.forEach(x => {
        if(x.baseEntry === baseEntry && x.baseLine === baseLine)
        {
          x.codTipOperacion = value.code;
        }
      });
    }, 10);
    this.isVisualizarTipoOperacion = !this.isVisualizarTipoOperacion;
  }

  onClickCloseTipoOperacion()
  {
    this.isVisualizarTipoOperacion = !this.isVisualizarTipoOperacion;
  }
  //=======================================================================================================================
  //============================= FIN: TIPO DE OPERACION ==================================================================
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

  //#region  <<< Visualizar >>>
  onListar() {
    this.isDisplay = true;
    this.bardcodeList = [];
    const text1 = this.modeloFormBar.value;
    const params: any = { cod1: this.detalleSelected.objType, id1: this.detalleSelected.docEntry, id2: this.detalleSelected.lineNum, text1: text1.text1 };
    this.lecturaService.getListByTargetTypeTrgetEntryTrgetLineFiltro(params)
    .subscribe({next:(data: ILectura[]) =>{
        this.isDisplay = false;
        this.bardcodeList = data;
      },error:(e)=>{
        this.bardcodeList = [];
        this.isDisplay = false;
        let swalWithBootstrapButtons = Swal.mixin({ customClass: { container: 'my-swal' }, target: document.getElementById('modal') });
        swalWithBootstrapButtons.fire(this.globalConstants.msgInfoSummary, e.error.resultadoDescripcion, 'error');
      }
    });
  }

  onClickVisualizar()
  {
    this.onListar();
    this.isVisualizarBarcode = !this.isVisualizarBarcode;
  }

  onToBuscar()
  {
    this.onListar();
  }

  onClear()
  {
    this.bardcodeList = [];
    this.modeloFormBar.patchValue({ 'text1' : '' });
  }

  onHide()
  {
    this.onClear();
  }

  onClickBarcodeClose()
  {
    this.onClear();
    this.isVisualizarBarcode = !this.isVisualizarBarcode;
  }
  //#endregion

  onInputBulto(val)
  {
    let value: number = val === null? 0 : val;

    this.modeloFormPie1.controls['numBulto'].setValue( value );
  }

  onInpuKilo(val)
  {
    let value: number = val === null? 0 : val;

    this.modeloFormPie1.controls['totKilo'].setValue( value );
  }
  //#endregion


  onSelectedEmpleadoVenta(value: any) {
    this.modeloFormPie1.patchValue({ 'slpCode' : value.slpCode });
  }

  set(data: ITransferenciaStock)
  {
    setTimeout(() => {
      this.docEntry                 = data.docEntry;
      this.cardCode                 = data.cardCode;
      this.cntctCode                = data.cntctCode;
      this.tipDocumento             = data.tipDocumento;
      this.serDocumento             = data.serDocumento;
      this.whsCodeOrigen            = data.filler;
      this.whsCodeDestino           = data.toWhsCode;
      this.codTipTransporte         = data.codTipTransporte;
      this.codTipDocTransportista   = data.codTipDocTransportista;
      this.codTipDocConductor       = data.codTipDocConductor;
      this.codTipTraslado           = data.codTipTraslado;
      this.codMotTraslado           = data.codMotTraslado;
      this.codTipSalida             = data.codTipSalida;
      this.slpCode                  = data.slpCode;

    }, 10);

    this.modeloFormCab1.controls['cardCode'].setValue( data.cardCode );
    this.modeloFormCab1.controls['cardName'].setValue( data.cardName );
    this.modeloFormCab1.controls['cntctCode'].setValue( data.cntctCode );
    this.modeloFormCab1.controls['address'].setValue( data.address );
    this.modeloFormCab2.controls['docNum'].setValue( data.docNum );
    this.modeloFormCab2.controls['tipDocumento'].setValue( data.tipDocumento );
    this.modeloFormCab2.controls['serDocumento'].setValue( data.serDocumento );
    this.modeloFormCab2.controls['numDocumento'].setValue( data.numDocumento );
    this.modeloFormCab2.controls['docDate'].setValue( data.docDate == null ?  null : new Date(data.docDate) );
    this.modeloFormCab2.controls['docDueDate'].setValue( data.docDueDate == null ?  null : new Date(data.docDueDate) );
    this.modeloFormCab2.controls['taxDate'].setValue( data.taxDate == null ?  null : new Date(data.taxDate) );
    this.modeloFormCab3.controls['whsCodeOrigen'].setValue( data.filler );
    this.modeloFormCab3.controls['whsCodeDestino'].setValue( data.toWhsCode );
    this.modeloFormTra.controls['codTipTransporte'].setValue( data.codTipTransporte );
    this.modeloFormTra.controls['codTipDocTransportista'].setValue( data.codTipDocTransportista );
    this.modeloFormTra.controls['numTipoDocTransportista'].setValue( data.numTipoDocTransportista );
    this.modeloFormTra.controls['nomTransportista'].setValue( data.nomTransportista );
    this.modeloFormTra.controls['numPlaVehTransportista'].setValue( data.numPlaVehTransportista );
    this.modeloFormTra.controls['codTipDocConductor'].setValue( data.codTipDocConductor );
    this.modeloFormTra.controls['numTipoDocConductor'].setValue( data.numTipoDocConductor );
    this.modeloFormTra.controls['nomConductor'].setValue( data.nomConductor );
    this.modeloFormTra.controls['apeConductor'].setValue( data.apeConductor );
    this.modeloFormTra.controls['nomComConductor'].setValue( data.nomComConductor );
    this.modeloFormTra.controls['numLicConductor'].setValue( data.numLicConductor );
    this.modeloFormOtr.controls['codTipTraslado'].setValue( data.codTipTraslado );
    this.modeloFormOtr.controls['codMotTraslado'].setValue( data.codMotTraslado );
    this.modeloFormOtr.controls['codTipSalida'].setValue( data.codTipSalida );
    this.modeloFormPie1.controls['slpCode'].setValue( data.slpCode );
    this.modeloFormPie1.controls['numBulto'].setValue( data.numBulto );
    this.modeloFormPie1.controls['totKilo'].setValue( data.totKilo );
    this.modeloFormPie1.controls['jrnlMemo'].setValue( data.jrnlMemo );
    this.modeloFormPie1.controls['comments'].setValue( data.comments );
  }

  getById(id: number) {
    this.isDisplay = true;
    this.transferenciaStockService.getById(id)
    .subscribe({next:(data: ITransferenciaStock) => {
      setTimeout(() => {
        this.modelo = data;
        this.set(this.modelo);
      }, 10);
      setTimeout(() => {
        data.linea.forEach(element => {
          this.detalle.push(element);
        });
      }, 1000);
      this.isDisplay = false;
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }


  //#region <<< Save >>>
  onValidatedSave(){
    debugger
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
      this.swaCustomService.swaMsgInfo('Ingrese los datos en el detalle de la transferencia.');
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
      if (this.detalle[index].codTipOperacion === '')
      {
        this.isSaving = false;
        this.swaCustomService.swaMsgInfo('Seleccione el tipo de operación en el detalle.');
        return false;
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

    // CAB 02: SOCIO NEGOCIO
    // CAB 02: TRANSFERENCIA
    this.modeloSave.id = this.id;
    this.modeloSave.docEntry = this.docEntry;
    // CAB 03: TRANSFERENCIA

    // TRANSPORTISTA
    this.modeloSave.codTipTransporte          = this.modeloFormTra.controls['codTipTransporte'].value;
    this.modeloSave.codTipDocTransportista    = this.modeloFormTra.controls['codTipDocTransportista'].value;
    this.modeloSave.numTipoDocTransportista   = this.modeloFormTra.controls['numTipoDocTransportista'].value;
    this.modeloSave.nomTransportista          = this.modeloFormTra.controls['nomTransportista'].value;
    this.modeloSave.numPlaVehTransportista    = this.modeloFormTra.controls['numPlaVehTransportista'].value;

    // CONDUCTOR
    this.modeloSave.codTipDocConductor        = this.modeloFormTra.controls['codTipDocConductor'].value;
    this.modeloSave.numTipoDocConductor       = this.modeloFormTra.controls['numTipoDocConductor'].value;
    this.modeloSave.nomConductor              = this.modeloFormTra.controls['nomConductor'].value;
    this.modeloSave.apeConductor              = this.modeloFormTra.controls['apeConductor'].value;
    this.modeloSave.nomComConductor           = this.modeloFormTra.controls['nomComConductor'].value;
    this.modeloSave.numLicConductor           = this.modeloFormTra.controls['numLicConductor'].value;

    // OTROS
    this.modeloSave.codTipTraslado  = this.modeloFormOtr.controls['codTipTraslado'].value;
    this.modeloSave.codMotTraslado  = this.modeloFormOtr.controls['codMotTraslado'].value;
    this.modeloSave.codTipSalida    = this.modeloFormOtr.controls['codTipSalida'].value;

    // PIE 01: TRANSFERENCIA
    this.modeloSave.slpCode         = this.modeloFormPie1.controls['slpCode'].value;
    this.modeloSave.numBulto        = this.modeloFormPie1.controls['numBulto'].value;
    this.modeloSave.totKilo         = this.modeloFormPie1.controls['totKilo'].value;
    this.modeloSave.jrnlMemo        = this.modeloFormPie1.controls['jrnlMemo'].value;
    this.modeloSave.comments        = this.modeloFormPie1.controls['comments'].value;

    this.modeloSave.idUsuarioUpdate = this.userContextService.getIdUsuario();

    this.modeloSave.linea = [];

    for (let index = 0; index < this.lectura.length; index++) {
      if(this.lectura[index].itemCode !== '')
      {
        this.modeloSave.linea.push
        ({
          id                  : this.lectura[index].id,
          line                : this.lectura[index].line,
          docEntry            : this.lectura[index].docEntry,
          lineNum             : this.lectura[index].lineNum,
          itemCode            : this.lectura[index].itemCode,
          dscription          : this.lectura[index].dscription,
          fromWhsCod          : this.lectura[index].fromWhsCod,
          whsCode             : this.lectura[index].whsCode,
          codTipOperacion     : this.lectura[index].codTipOperacion,
          unitMsr             : this.lectura[index].unitMsr,
          quantity            : this.lectura[index].quantity,
          openQty             : this.lectura[index].openQty
        });
      }
    }

    this.transferenciaStockService.setUpdate(this.modeloSave)
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
