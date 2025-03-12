import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';
import { LayoutComponent } from 'src/app/layout/layout.component';
import { UtilService } from 'src/app/services/util.service';
import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { UserContextService } from 'src/app/services/user-context.service';

import { ITransferenciaStock } from 'src/app/modulos/modulo-inventario/interfaces/web/transferencia-stock.interface';
import { TransferenciaStockCreateModel } from 'src/app/modulos/modulo-inventario/models/web/transferencia-stock.model';
import { ILecturaCopyToTransferencia, ILecturaCopyToTransferenciaDetalle1, ILecturaCopyToTransferenciaDetalle2 } from 'src/app/modulos/modulo-inventario/interfaces/web/lectura.inteface';
import { LecturaService } from 'src/app/modulos/modulo-inventario/services/web/lectura.service';
import { TransferenciaStockService } from 'src/app/modulos/modulo-inventario/services/web/transferencia-stock.service';
import { SerieNumeracionSapService } from 'src/app/modulos/modulo-gestion/services/sap/inicializacion-sistema/serie-numeracion-sap.service';
import { CifrarDataService } from 'src/app/services/cifrar-data.service';


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
  modeloFormBar: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  params: any;
  codSede: number = 0;
  jrnlMemo: string = 'Traslado - '
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
  exitRead: boolean = false;
  columnas: any[];
  columnas2: any[];
  opciones: any = [];
  bardcodeList: any[];
  modeloCopy: ILecturaCopyToTransferencia;
  lecturaCopy: ILecturaCopyToTransferenciaDetalle1[] = [];
  detalleCopy: ILecturaCopyToTransferenciaDetalle2[] = [];
  detalleSelected: ILecturaCopyToTransferenciaDetalle2;

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
    private readonly route: ActivatedRoute,
    private readonly swaCustomService: SwaCustomService,
    public app: LayoutComponent,
    public lenguageService: LanguageService,
    public readonly utilService: UtilService,
    private userContextService: UserContextService,
    private lecturaService: LecturaService,
    private serieNumeracionSapService: SerieNumeracionSapService,
    private transferenciaStockService: TransferenciaStockService,
  ) {}

  ngOnInit() {
    this.onBuildForm();
    this.onBuildColumn();
    this.opcionesTabla();
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
      'docNum'        : new FormControl({ value: '', disabled: true  }),
      'tipDocumento'  : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'serDocumento'  : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'numDocumento'  : new FormControl({ value: '', disabled: true  }, Validators.compose([Validators.required])),
      'docDate'       : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'docDueDate'    : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'taxDate'       : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
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
      'filtro' : new FormControl(''),
    });
  }

  onBuildColumn() {
    this.columnas =
    [
      { field: 'itemCode',        header: 'Código' },
      { field: 'itemName',        header: 'Descripción' },
      { field: 'fromWhsCod',      header: 'Almacén de origen' },
      { field: 'whsCode',         header: 'Almacén de destino' },
      { field: 'nomTipOperacion', header: 'Tipo de operación' },
      { field: 'unitMsr',         header: 'UM' },
      { field: 'quantity',        header: 'Cantidad' }
    ];

    this.columnas2 =
    [
      { field: 'itemCode',        header: 'Código' },
      { field: 'barcode',         header: 'Barcode' },
      { field: 'quantity',        header: 'Cantidad' },
    ];
  }

  opcionesTabla() {
    this.opciones = [
      { label: 'Borrar línea',      icon: 'pi pi-times',      command: () => { this.onClickDelete() } },
      { label: 'Visualizar',        icon: 'pi pi-eye',        command: () => { this.onClickVisualizar() } },
    ];
  }

  onSelectedItem(modelo: any) {
    debugger
    this.detalleSelected = modelo;
    if(this.detalleSelected.itemCode !== ''){
      this.opciones.find(x => x.label == "Borrar línea").visible = true;
    } else {
      this.opciones.find(x => x.label == "Borrar línea").visible = false;
    }
    if(this.detalleSelected.itemCode === '' || this.detalleSelected.read === 'Y'){
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
    debugger
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
    this.modeloFormCab3.patchValue({ 'whsCodeOrigen' : value.whsCode });

    if(this.detalleCopy.length > 0)
    {
      this.detalleCopy.forEach(x => {
        if(x.itemCode !== '')
        {
          x.fromWhsCod = value.whsCode;
        }
      });
    }
  }

  onSelectedAlmacenDestino(value: any) {
    this.modeloFormCab3.patchValue({ 'whsCodeDestino' : value.whsCode });

    if(this.detalleCopy.length > 0)
    {
      this.detalleCopy.forEach(x => {
        if(x.itemCode !== '')
        {
          x.whsCode = value.whsCode;
        }
      });
    }
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

    this.detalleCopy[this.indexArticulo].itemCode = value.itemCode;
    this.detalleCopy[this.indexArticulo].dscription = value.itemName;
    if (this.modeloFormCab3.controls['whsCodeOrigen'].value) {
      let itemAlmacenOrigen = this.modeloFormCab3.controls['whsCodeOrigen'].value;
      this.detalleCopy[this.indexArticulo].fromWhsCod = itemAlmacenOrigen;
    }
    else
    {
      if(value.dfltWH)
      {
        this.detalleCopy[this.indexArticulo].fromWhsCod = value.dfltWH;
      }
    }
    if (this.modeloFormCab3.controls['whsCodeDestino'].value) {
      let itemAlmacenDestino = this.modeloFormCab3.controls['whsCodeDestino'].value;
      this.detalleCopy[this.indexArticulo].whsCode = itemAlmacenDestino;
    }
    else
    {
      this.detalleCopy[this.indexArticulo].whsCode = value.dfltWH;
    }
    this.detalleCopy[this.indexArticulo].unitMsr = value.invntryUom;
    this.detalleCopy[this.indexArticulo].quantity = 1;
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
  onOpenAlmacenOrigen(value: ILecturaCopyToTransferenciaDetalle2, index: number) {
    this.indexAlmacenOrigen = index;
    this.itemCode = value.itemCode;
    this.isVisualizarAlmacenOrigen = !this.isVisualizarAlmacenOrigen;
  }

  onSelectedAlmacenOrigenItem(value: any) {
    this.detalleCopy[this.indexAlmacenOrigen].fromWhsCod = value.whsCode;
    this.isVisualizarAlmacenOrigen = !this.isVisualizarAlmacenOrigen;
  }

  onClickCloseAlmacenOrigen()
  {
    this.isVisualizarAlmacenOrigen = !this.isVisualizarAlmacenOrigen;
  }

  onOpenAlmacenDestino(value: ILecturaCopyToTransferenciaDetalle2, index: number) {
    this.indexAlmacenDestino = index;
    this.itemCode = value.itemCode;
    this.isVisualizarAlmacenDestino = !this.isVisualizarAlmacenDestino;
  }

  onSelectedAlmacenDestinoItem(value: any) {
    this.detalleCopy[this.indexAlmacenDestino].whsCode = value.whsCode;
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
  onOpenTipoOperacion(index: number) {
    this.indexTipoOperacion = index;
    this.isVisualizarTipoOperacion = !this.isVisualizarTipoOperacion;
  }

  onSelectedTipoOperacionItem(value: any) {
    let baseEntry: number = this.detalleCopy[this.indexTipoOperacion].baseEntry;
    let baseLine: number = this.detalleCopy[this.indexTipoOperacion].baseLine;

    this.detalleCopy[this.indexTipoOperacion].codTipOperacion = value.code;
    this.detalleCopy[this.indexTipoOperacion].nomTipOperacion = value.name;

    if(this.lecturaCopy.length > 0)
    {
      this.lecturaCopy.forEach(x => {
        if(x.baseEntry === baseEntry && x.baseLine === baseLine)
        {
          x.codTipOperacion = value.code;
        }
      });
    }

    this.isVisualizarTipoOperacion = !this.isVisualizarTipoOperacion;
  }

  onClickCloseTipoOperacion()
  {
    this.isVisualizarTipoOperacion = !this.isVisualizarTipoOperacion;
  }
  //=======================================================================================================================
  //============================= FIN: TIPO DE OPERACION ==================================================================
  //=======================================================================================================================

  onChangeQuantity(value: ILecturaCopyToTransferenciaDetalle2, index: number)
  {
      let quantity   : number = 0;
      let openQty    : number = 0;

      quantity  = this.utilService.onRedondearDecimal(value.quantity, 3);
      openQty   = this.utilService.onRedondearDecimal(value.quantity, 3);

      this.detalleCopy[index].quantity  = value.itemCode === '' ? 0 : quantity;
      this.detalleCopy[index].openQty   = value.itemCode === '' ? 0 : openQty;

      for(const linea of this.lecturaCopy.filter(x => x.idBase === value.idBase && x.lineBase === value.lineBase && x.read === 'N'))
      {
        linea.quantity  = quantity;
        linea.openQty   = openQty;
      }
  }

  onClickDelete()
  {
    // Se borra el registro en el detalle
    this.detalleCopy.filter(x => x.idBase === this.detalleSelected.idBase && x.lineBase === this.detalleSelected.lineBase).forEach(x => this.detalleCopy.splice(this.detalleCopy.indexOf(x), 1));

    // Se borra el registro de la lectura
    this.lecturaCopy.filter(x => x.idBase === this.detalleSelected.idBase && x.lineBase === this.detalleSelected.lineBase).forEach(x => this.lecturaCopy.splice(this.lecturaCopy.indexOf(x), 1));

    this.getTotalBulto(this.detalleCopy);
    this.getTotalKilo(this.detalleCopy);
  }

  //#region  <<< Visualizar >>>
  onClickVisualizar()
  {
    this.bardcodeList = [];
    this.bardcodeList = this.lecturaCopy.filter(x => x.idBase === this.detalleSelected.idBase && x.lineBase === this.detalleSelected.lineBase);
    this.isVisualizarBarcode = !this.isVisualizarBarcode;
  }

  onToBuscar()
  {
    let filtro = this.modeloFormBar.controls['filtro'].value;
    this.bardcodeList = [];

    if(filtro === '')
    {
      this.bardcodeList = this.lecturaCopy.filter(x => x.idBase === this.detalleSelected.idBase && x.lineBase === this.detalleSelected.lineBase);
    }
    else
    {
      this.bardcodeList = this.lecturaCopy.filter(x => x.idBase === this.detalleSelected.idBase && x.lineBase === this.detalleSelected.lineBase && x.barcode === filtro);
    }
  }

  onToSelectedDeleteRow(value: ILecturaCopyToTransferenciaDetalle1)
  {
    let quantity  : number = 0;
    let bulto     : number = 0;
    let peso      : number = 0;

    // Se borra el registro en el detalle
    this.lecturaCopy.filter(x => x.id === value.id).forEach(x => this.lecturaCopy.splice(this.lecturaCopy.indexOf(x), 1));

    // Se borra el registro en el modal
    this.bardcodeList.filter(x => x.id === value.id).forEach(x => this.bardcodeList.splice(this.bardcodeList.indexOf(x), 1));


    // Se obtiene la lista de los registros similares a lo seleccionado
    const lista = this.bardcodeList.filter(x => x.idBase === value.idBase && x.lineBase === value.lineBase);

    // Se suma la cantidad
    lista.forEach(x => quantity += x.quantity);
    lista.forEach(x => bulto    += x.bulto);
    lista.forEach(x => peso     += x.peso);

    // Se le asigna el nuevo valor a la cantidad
    for(const linea of this.detalleCopy.filter(x => x.idBase === value.idBase && x.lineBase === value.lineBase))
    {
      linea.quantity  = quantity;
      linea.bulto     = bulto;
      linea.peso      = peso;
    }

    // Si no hay mas ítems en el modal, se borra el item del detalle
    if(lista.length === 0)
    {
      this.detalleCopy.filter(x => x.idBase === value.idBase && x.lineBase === value.lineBase).forEach(x => this.detalleCopy.splice(this.detalleCopy.indexOf(x), 1));
    }

    this.getTotalBulto(this.detalleCopy);
    this.getTotalKilo(this.detalleCopy);
  }

  onClear()
  {
    this.bardcodeList = [];
    this.modeloFormBar.patchValue({ 'filtro' : '' });
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

  //#region <<< Copy >>>
  getTotalBulto(value: ILecturaCopyToTransferenciaDetalle2[]) {
    this.onInputBulto(value.filter(x => x.bulto > 0).reduce((acumulador, x) => acumulador + x.bulto, 0));
  }

  getTotalKilo(value: ILecturaCopyToTransferenciaDetalle2[]) {
    this.onInpuKilo(value.filter(x => x.peso > 0).reduce((acumulador, x) => acumulador + x.peso, 0))
  }

  set(value: ILecturaCopyToTransferencia)
  {
    setTimeout(() => {
      this.cardCode       = value.cardCode;
      this.cntctCode      = value.cntctCode;
      this.whsCodeOrigen  = value.filler;
      this.whsCodeDestino = value.toWhsCode;
      this.codTipTraslado = value.codTipTraslado;
      this.codMotTraslado = value.codMotTraslado;
      this.codTipSalida   = value.codTipSalida;
      this.slpCode        = value.slpCode;

      this.modeloFormCab1.controls['cardCode'].setValue( value.cardCode );
      this.modeloFormCab1.controls['cardName'].setValue( value.cardName );
      this.modeloFormCab1.controls['cntctCode'].setValue( value.cntctCode );
      this.modeloFormCab1.controls['address'].setValue( value.address );
      this.modeloFormCab3.controls['whsCodeOrigen'].setValue( value.filler );
      this.modeloFormCab3.controls['whsCodeDestino'].setValue( value.toWhsCode );
      this.modeloFormOtr.controls['codTipTraslado'].setValue( value.codTipTraslado );
      this.modeloFormOtr.controls['codMotTraslado'].setValue( value.codMotTraslado );
      this.modeloFormOtr.controls['codTipSalida'].setValue( value.codTipSalida );
      this.modeloFormPie1.controls['comments'].setValue( value.comments );
      this.getTotalBulto(value.linea2);
      this.getTotalKilo(value.linea2);
    }, 20);

    setTimeout(() => {
      this.lecturaCopy = value.linea1;
      this.detalleCopy = value.linea2;
    }, 550);
  }

  getListCopy(params: any)
  {
    this.isDisplay = true;
    this.lecturaService.getLecturaCopyToTransferencia(params)
    .subscribe({next:(data: ILecturaCopyToTransferencia) =>{
      this.isDisplay = false;
      this.modeloCopy = data;
      this.set(this.modeloCopy);
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }
  //#endregion


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

    for (let index = 0; index < this.detalleCopy.length; index++) {
      if(this.detalleCopy[index].itemCode === '')
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

    for (let index = 0; index < this.detalleCopy.length; index++) {
      if(this.detalleCopy[index].itemCode !== '')
      {
        if(this.detalleCopy[index].fromWhsCod === this.detalleCopy[index].whsCode)
        {
          this.isSaving = false;
          this.swaCustomService.swaMsgInfo('El almacén de destino no puede ser idéntico al almacén de Origen.');
          return false;
        }
      }
      if (this.detalleCopy[index].codTipOperacion === '')
      {
        this.isSaving = false;
        this.swaCustomService.swaMsgInfo('Seleccione el tipo de operación en el detalle.');
        return false;
      }
      if (this.detalleCopy[index].quantity === 0)
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
    this.modeloSave.cardCode                  = this.modeloFormCab1.controls['cardCode'].value;
    this.modeloSave.cardName                  = this.modeloFormCab1.controls['cardName'].value;
    if (this.modeloFormCab1.controls['cntctCode'].value)
    {
      this.modeloSave.cntctCode               = this.modeloFormCab1.controls['cntctCode'].value;
    }
    this.modeloSave.address                   = this.modeloFormCab1.controls['address'].value;

    // CAB 02: TRANSFERENCIA
    this.modeloSave.tipDocumento              = this.modeloFormCab2.controls['tipDocumento'].value;
    this.modeloSave.serDocumento              = this.modeloFormCab2.controls['serDocumento'].value;
    this.modeloSave.numDocumento              = this.modeloFormCab2.controls['numDocumento'].value;
    this.modeloSave.docDate                   = new Date(this.modeloFormCab2.controls['docDate'].value);
    this.modeloSave.docDueDate                = new Date(this.modeloFormCab2.controls['docDueDate'].value);
    this.modeloSave.taxDate                   = new Date(this.modeloFormCab2.controls['taxDate'].value);

    // CAB 03: TRANSFERENCIA
    this.modeloSave.filler                    = this.modeloFormCab3.controls['whsCodeOrigen'].value;
    this.modeloSave.toWhsCode                 = this.modeloFormCab3.controls['whsCodeDestino'].value;

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
    this.modeloSave.codTipTraslado            = this.modeloFormOtr.controls['codTipTraslado'].value;
    this.modeloSave.codMotTraslado            = this.modeloFormOtr.controls['codMotTraslado'].value;
    this.modeloSave.codTipSalida              = this.modeloFormOtr.controls['codTipSalida'].value;

    // PIE 01: TRANSFERENCIA
    this.modeloSave.slpCode                   = this.modeloFormPie1.controls['slpCode'].value;
    this.modeloSave.numBulto                  = this.modeloFormPie1.controls['numBulto'].value;
    this.modeloSave.totKilo                   = this.modeloFormPie1.controls['totKilo'].value;
    this.modeloSave.jrnlMemo                  = this.modeloFormPie1.controls['jrnlMemo'].value;
    this.modeloSave.comments                  = this.modeloFormPie1.controls['comments'].value;
    this.modeloSave.idUsuarioCreate = this.userContextService.getIdUsuario();
    this.modeloSave.linea = [];

    for (let index = 0; index < this.lecturaCopy.length; index++) {
      if(this.lecturaCopy[index].itemCode !== '')
      {
        this.modeloSave.linea.push
        ({
          id                  : 0,
          line                : 0,
          idLectura           : this.lecturaCopy[index].id,
          idBase              : this.lecturaCopy[index].idBase,
          lineBase            : this.lecturaCopy[index].lineBase,
          baseType            : this.lecturaCopy[index].baseType,
          baseEntry           : this.lecturaCopy[index].baseEntry,
          baseLine            : this.lecturaCopy[index].baseLine,
          read                : this.lecturaCopy[index].read,
          itemCode            : this.lecturaCopy[index].itemCode,
          dscription          : this.lecturaCopy[index].dscription,
          fromWhsCod          : this.lecturaCopy[index].fromWhsCod,
          whsCode             : this.lecturaCopy[index].whsCode,
          codTipOperacion     : this.lecturaCopy[index].codTipOperacion,
          unitMsr             : this.lecturaCopy[index].unitMsr,
          quantity            : this.lecturaCopy[index].quantity,
          openQty             : this.lecturaCopy[index].openQty,
          idUsuarioCreate     : this.userContextService.getIdUsuario()
        });
      }

      console.log("CREATE :", this.modeloSave);
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
