import { MenuItem, SelectItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { UtilService } from 'src/app/services/util.service';
import { LanguageService } from 'src/app/services/language.service';
import { LayoutComponent } from '../../../../../layout/layout.component';
import { SwaCustomService } from '../../../../../services/swa-custom.service';
import { UserContextService } from 'src/app/services/user-context.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';


import { IStatus } from 'src/app/modulos/modulo-gestion/interfaces/web/definiciones/general/status.interface';
import { IAlmacenSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/inventario/almacen-sap.interface';
import { IImpuestoSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/finanzas/impuesto-sap.iterface';
import { ISocioNegocio } from 'src/app/modulos/modulo-socio-negocios/interfaces/socio-segocio.interface';
import { ITipoCambioSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/tipo-cambio-sap.interface';
import { IOrdenVentaDetalle } from '../../../interfaces/orden-venta.interface';
import { IArticuloDocumentoSap, IArticuloSap } from 'src/app/modulos/modulo-inventario/interfaces/sap/articulo-sap.interface';
import { OrdenVentaCreateModel } from '../../../models/web/orden-venta.model';
import { OrdenVentaService } from '../../../services/web/orden-venta.service';
import { ArticuloSapService } from 'src/app/modulos/modulo-inventario/services/sap/articulo-sap.service';
import { ImpuestoSapService } from 'src/app/modulos/modulo-gestion/services/sap/definiciones/finanzas/impuesto-sap.service';
import { TipoCambioSapService } from 'src/app/modulos/modulo-gestion/services/sap/tipo-cambio-sap.service';
import { StatusService } from 'src/app/modulos/modulo-gestion/services/web/definiciones/general/status.service';
import { ButtonAcces } from 'src/app/models/acceso-button.model';



@Component({
  selector: 'app-ven-panel-orden-venta-create',
  templateUrl: './panel-orden-venta-create.component.html',
  styleUrls: ['./panel-orden-venta-create.component.css']
})
export class PanelOrdenVentaCreateComponent implements OnInit {
  // Titulo del componente
  titulo = 'Órden de Venta';
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  modeloFormCab1: FormGroup;
  modeloFormCab2: FormGroup;
  modeloFormLog: FormGroup;
  modeloFormFin: FormGroup;
  modeloFormAge: FormGroup;
  modeloFormExp: FormGroup;
  modeloFormOtr: FormGroup;
  modeloFormPie1: FormGroup;
  modeloFormPie2: FormGroup;

  fecha         : Date = new Date();

  slpCode       : number = 0;
  groupNum      : number = 0;
  cntctCode     : number = 0;

  type          : string = '';
  cardCode      : string = '';
  currCode      : string = '';
  mainCurncy    : string = '';
  payToCode     : string = '';
  codDirAgencia : string = '';
  codAgencia    : string = '';
  shipToCode    : string = '';
  codTipVenta   : string = '';
  codTipFlete   : string = '';

  listEstado: SelectItem[];
  listMoneda: SelectItem[];
  listCondicionPago: SelectItem[];
  socioNegocio: ISocioNegocio;
  modeloSave: OrdenVentaCreateModel = new OrdenVentaCreateModel();

  // Progreso
  isDisplay: boolean = false;
  isSaving: boolean = false;
  isVisualizarAlmacen: boolean = false;
  isVisualizarImpuesto: boolean = false;
  isVisualizarArticulo: boolean = false;

  // DETALLE
  opciones: any = [];
  indexAlmacen: number = 0;
  indexImpuesto: number = 0;
  indexArticulo: number = 0;
  itemCode: string = '';
  inactiveAlmacenItem: string = 'N';
  demandanteAlmacenItem: string = 'Y';

  columnas: any[];
  detalle: IOrdenVentaDetalle[] = [];
  modeloSelected: IOrdenVentaDetalle;


  constructor
  (
    private router: Router,
    private fb: FormBuilder,
    public app: LayoutComponent,
    public lenguageService: LanguageService,
    public readonly utilService: UtilService,
    private readonly route: ActivatedRoute,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private userContextService: UserContextService,
    private statusService: StatusService,
    private impuestoSapService: ImpuestoSapService,
    private ordenVentaService: OrdenVentaService,
    private articuloSapService: ArticuloSapService,
    private tipoCambioSapService: TipoCambioSapService,
  ) {}

  ngOnInit() {
    this.onBuildForm();
    this.onBuildColumn();
    this.opcionesTabla();
    this.getListEstado();
    this.addNewLine();

    console.log("MainCurncy: ", this.mainCurncy);
  }

  onBuildForm() {
    this.modeloFormCab1 = this.fb.group(
    {
      'cardCode'              : new FormControl({ value: '', disabled: true  }, Validators.compose([Validators.required])),
      'licTradNum'            : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'cardName'              : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'cntctCode'             : new FormControl({ value: '', disabled: false }),
      'numOrdCom'             : new FormControl(''),
      'docCur'                : new FormControl('', Validators.compose([Validators.required])),
      'docRate'               : new FormControl('', Validators.compose([Validators.required])),
    });

    this.modeloFormCab2 = this.fb.group(
    {
      'docNum'                : new FormControl({ value: '',  disabled: false }),
      'docStatus'             : new FormControl({ value: '',  disabled: true  }, Validators.compose([Validators.required])),
      'docDate'               : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'docDueDate'            : new FormControl(null, Validators.compose([Validators.required])),
      'taxDate'               : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
    });

    this.modeloFormLog = this.fb.group(
    {
      'shipToCode'            : new FormControl(''),
      'address2'              : new FormControl({ value: '', disabled: false }),
      'payToCode'             : new FormControl('',),
      'address'               : new FormControl({ value: '', disabled: false }),
    });

    this.modeloFormFin = this.fb.group(
    {
      'groupNum'              : new FormControl('', Validators.compose([Validators.required]))
    });

    this.modeloFormAge = this.fb.group(
    {
      'codAgencia'            : new FormControl(''),
      'rucAgencia'            : new FormControl(''),
      'nomAgencia'            : new FormControl(''),
      'codDirAgencia'         : new FormControl(''),
      'dirAgencia'            : new FormControl(''),
    });

    this.modeloFormExp = this.fb.group(
    {
      'codTipFlete'           : new FormControl(''),
      'valorFlete'            : new FormControl(''),
      'totalFlete'            : new FormControl(''),
      'importeSeguro'         : new FormControl(''),
      'puerto'                : new FormControl(''),
    });

    this.modeloFormOtr = this.fb.group(
      {
        'codTipVenta'         : new FormControl('', Validators.compose([Validators.required]))
      });

    this.modeloFormPie1 = this.fb.group(
    {
      'slpCode'               : new FormControl('', Validators.compose([Validators.required])),
      'comments'              : new FormControl(''),
    });

    this.modeloFormPie2 = this.fb.group(
    {
      'subTotal'              : new FormControl({ value: '', disabled: false }),
      'discPrcnt'             : new FormControl({ value: '', disabled: false }),
      'discSum'               : new FormControl({ value: '', disabled: false }),
      'vatSum'                : new FormControl({ value: '', disabled: false }),
      'docTotal'              : new FormControl({ value: '', disabled: false }),
    });

    this.mainCurncy = this.userContextService.getMainCurncy();
  }

  opcionesTabla() {
    this.opciones = [
      { label: 'Añadir línea',      icon: 'pi pi-plus',                   command: () => { } },
      { label: 'Borrar línea',      icon: 'pi pi-trash',                  command: () => { } },
    ];
  }

  onBuildColumn() {
    this.columnas = [
      { field: 'itemCode',    header: 'Código' },
      { field: 'dscription',  header: 'Descripción' },
      { field: 'whsCode',     header: 'Almacén' },
      { field: 'unitMsr',     header: 'UM' },
      { field: 'onHand',      header: 'Stock' },
      { field: 'quantity',    header: 'Cantidad' },
      { field: 'PriceBefDi',  header: 'Precio' },
      { field: 'TaxCode',     header: 'Impuesto' },
      { field: 'lineTotal',   header: 'Total' },
    ];
  }

  onSelectedItem(modelo: IOrdenVentaDetalle) {
  }

  getTipoCambio() {
    const params: any = { dat1: this.fecha, cod1: this.modeloFormCab1.controls['docCur'].value };
    this.tipoCambioSapService.getByFechaCode(params)
    .subscribe({next:(data: ITipoCambioSap) =>{
      this.modeloFormCab1.patchValue({ 'docRate': data.rate });
      if (!this.valTipoCambio()) return;
      },error:(e)=>{
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  valTipoCambio()
  {
    const currency  : string = this.modeloFormCab1.controls['docCur'].value;
    const rate      : number = Number(this.modeloFormCab1.controls['docRate'].value);

    if(currency !== this.mainCurncy && rate === 0)
    {
      this.swaCustomService.swaMsgInfo('Ingrese el tipo de cambio.');
      return false;
    }

    return true;
  }

  //#region <<< MODAL: CLIENTE >>>
  limpiarSocioNegocio()
  {
    this.cardCode   = '';
    this.cntctCode  = 0;
    this.currCode   = '';
    this.shipToCode = '';
    this.payToCode  = '';
    this.slpCode    = 0;
    this.modeloFormCab1.patchValue({ 'cardCode': '', 'licTradNum': '', 'cardName': '', 'cntctCode': '', 'docCur': '', 'docRate': '' });
    this.modeloFormLog.patchValue({ 'shipToCode': '', 'address2': '', 'payToCode': '', 'address': '' });
    this.modeloFormFin.patchValue({ 'groupNum': '' });
    this.modeloFormPie1.patchValue({ 'slpCode': '' });
  }

  onSelectedCliente(value: ISocioNegocio) {
    this.limpiarSocioNegocio();
    this.socioNegocio = value;
    this.cardCode   = value.cardCode;
    this.cntctCode  = value.cntctCode;
    this.currCode   = value.currency;
    this.shipToCode = value.shipToDef;
    this.payToCode  = value.billToDef;
    this.groupNum   = value.groupNum;
    this.slpCode    = value.slpCode;
    this.modeloFormCab1.patchValue({ 'cardCode': value.cardCode, 'licTradNum': value.licTradNum, 'cardName': value.cardName, 'cntctCode': value.cntctCode, 'docCur': value?.currency === '##' ? this.mainCurncy : value.currency });
    this.modeloFormLog.patchValue({ 'shipToCode': value.shipToDef,'address2': value.address2, 'payToCode': value.billToDef, 'address': value.address });
    this.modeloFormFin.patchValue({ 'groupNum': value.groupNum });
    this.modeloFormPie1.patchValue({ 'slpCode': value.slpCode });
    this.getTipoCambio();
  }

  onSelectedMoneda(value) {
    // Para el [ngClass] se actualiza la moneda
    this.socioNegocio.currency = value.currCode;
    this.modeloFormCab1.patchValue({ 'docCur': value.currCode });
    this.getTipoCambio();

    for (let index = 0; index < this.detalle.length; index++) {
      if(this.detalle[index].itemCode)
      {
        this.getArticuloVentaByCode(this.detalle[index].itemCode, index);
      }
    }
  }

  onSelectedDireccionEntrega(value) {
    this.modeloFormLog.patchValue({ 'shipToCode': value.address, 'address2': value.street });
  }

  onSelectedDireccionFactura(value) {
    this.modeloFormLog.patchValue({ 'payToCode': value.address, 'address': value.street });
  }
  //#endregion

  getListEstado() {
    this.statusService.getList()
    .subscribe({next:(data: IStatus[]) =>{
        this.listEstado = [];
        for (let item of data) {
          this.listEstado.push({ label: item.statusName, value: item.statusCode });
        }
        const item: any = this.listEstado.find(x=>x.value === '01');
        this.modeloFormCab2.controls['docStatus'].setValue({ label: item.label, value: item.value });
      },error:(e)=>{
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onSelectedCondicionPago(value) {
    this.modeloFormFin.patchValue({ 'groupNum': value.groupNum });
  }

  onSelectedAgencia(value) {
    this.codAgencia     = value.cardCode;
    this.codDirAgencia  = value.billToDef;
    this.modeloFormAge.patchValue({ 'codAgencia': value.cardCode, 'rucAgencia': value.licTradNum, 'nomAgencia': value.cardName, 'codDirAgencia': value.billToDef, 'dirAgencia': value.address });
  }

  onSelectedDireccionAgencia(value) {
    this.modeloFormAge.patchValue({ 'codDirAgencia': value.address, 'dirAgencia': value.street });
  }

  onSelectedTipoFlete(value) {
    this.modeloFormExp.patchValue({ 'codTipFlete': value.fldValue });
  }

  onSelectedTipoVenta(value) {
    this.modeloFormOtr.patchValue({ 'codTipVenta': value.fldValue });
  }

  //#region <<< DETALLE >>>
  addNewLine()
  {
    this.detalle.push
    ({
        idOrdenVenta      : 0,
        line              : 0,
        lineStatus        : '01',
        lineStatusRd      : '01',
        itemCode          : '',
        dscription        : '',
        whsCode           : '',
        unitMsr           : '',
        onHand            : 0,
        quantity          : 0,
        openQty           : 0,
        openQtyRd         : 0,
        currency          : '',
        priceBefDi        : 0,
        discPrcnt         : 0,
        price             : 0,
        lineTotal         : 0,
        taxCode           : '',
        vatPrcnt          : 0,
        vatSum            : 0
    });
  }
  delete(value: IOrdenVentaDetalle)
  {
    if(this.detalle.length === 1)
    {
      return;
    }
    let index = this.detalle.indexOf(value);
    this.detalle.splice(+index, 1);
  }

  onOpenArticulo(index: number) {
    if (!this.valTipoCambio()) return;
    this.indexArticulo = index;
    this.isVisualizarArticulo = !this.isVisualizarArticulo;
  }

  onSelectedArticulo(value: IArticuloSap) {
    this.getArticuloVentaByCode(value.itemCode, this.indexArticulo);
    this.isVisualizarArticulo = !this.isVisualizarArticulo;
  }

  getArticuloVentaByCode(itemCode: string, index: number) {
    this.isDisplay = true;
    const params = { code1: this.modeloFormCab1.controls['cardCode'].value, code2: this.modeloFormCab1.controls['docCur'].value, code3: itemCode ,  id1: this.modeloFormPie1.controls['slpCode'].value };
    this.articuloSapService.getArticuloVentaByCode(params)
    .subscribe({next:(data: IArticuloDocumentoSap) =>{
      this.isDisplay = false;
      this.detalle[index].itemCode     = data.itemCode;
      this.detalle[index].dscription   = data.itemName;
      this.detalle[index].whsCode      = data.dfltWH;
      this.detalle[index].unitMsr      = data.salUnitMsr;
      this.detalle[index].onHand       = data.onHand;
      this.detalle[index].quantity     = data.quantity;
      this.detalle[index].openQty      = data.openQty;
      this.detalle[index].openQtyRd   = data.openQtyRead;
      this.detalle[index].currency     = data.currency;
      this.detalle[index].priceBefDi   = data.priceBefDi;
      this.detalle[index].discPrcnt    = data.discPrcnt;
      this.detalle[index].price        = data.price;
      this.detalle[index].lineTotal    = data.lineTotal;
      this.detalle[index].taxCode      = data.taxCode;
      this.detalle[index].vatPrcnt     = data.vatPrcnt;
      this.detalle[index].vatSum       = data.vatSum;
      this.calcularTotales();
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }
  onOpenAlmacen(index: number) {
    this.indexAlmacen = index;
    this.itemCode = this.detalle[this.indexAlmacen].itemCode;
    this.isVisualizarAlmacen = !this.isVisualizarAlmacen;
  }
  onToAlmacenSelected(value: IAlmacenSap) {
    this.detalle[this.indexAlmacen].whsCode  = value.whsCode;
    this.isVisualizarAlmacen = !this.isVisualizarAlmacen;
  }
  onCloseAlmacen()
  {
    this.isVisualizarAlmacen = !this.isVisualizarAlmacen;
  }
  onChangeQuantity(value: IOrdenVentaDetalle, index: number)
  {
    this.calcularTotalLinea(value, index);
    this.calcularTotales();
  }
  onChangePrice(value: IOrdenVentaDetalle, index: number)
  {
    this.calcularTotalLinea(value, index);
    this.calcularTotales();
  }
  onChangeDiscPrcnt(value: IOrdenVentaDetalle, index: number)
  {
    this.calcularTotalLinea(value, index);
    this.calcularTotales();
  }
  calcularTotalLinea(value: IOrdenVentaDetalle, index: number)
  {
      let quantity        : number = 0;
      let openQty         : number = 0;
      let openQtyLectura  : number = 0;
      let priceBefDi      : number = 0;
      let discPrcnt       : number = 0;
      let price           : number = 0;
      let lineTotal       : number = 0;
      let vatSum          : number = 0;

      quantity        = this.utilService.onRedondearDecimal(value.itemCode === '' ? 0 : value.quantity, 3);
      openQty         = this.utilService.onRedondearDecimal(value.itemCode === '' ? 0 : value.quantity, 3);
      openQtyLectura  = this.utilService.onRedondearDecimal(value.itemCode === '' ? 0 : value.quantity, 3);

      priceBefDi  = this.utilService.onRedondearDecimal(value.itemCode === '' ? 0 : value.priceBefDi, 3);
      discPrcnt   = this.utilService.onRedondearDecimal(value.itemCode === '' ? 0 : value.discPrcnt,  2);
      price       = this.utilService.onRedondearDecimal((discPrcnt === 0 ? priceBefDi : priceBefDi - (priceBefDi * discPrcnt) / 100), 3);

      lineTotal = this.utilService.onRedondearDecimal((quantity * price), 2);
      vatSum    = this.utilService.onRedondearDecimal((lineTotal * value.vatPrcnt) / 100, 2);

      this.detalle[index].quantity    = quantity;
      this.detalle[index].openQty     = openQty;
      this.detalle[index].openQtyRd   = openQtyLectura;
      this.detalle[index].priceBefDi  = priceBefDi;
      this.detalle[index].discPrcnt   = discPrcnt;
      this.detalle[index].price       = price;
      this.detalle[index].lineTotal   = lineTotal;
      this.detalle[index].vatSum      = vatSum;
  }
  calcularTotales()
  {
    let subTotal  : number = 0;
    let vatSum    : number = 0;
    let docTotal  : number = 0;

    this.detalle.forEach(element => {
      if(element.itemCode)
      {
        subTotal += element.lineTotal;
        vatSum += element.vatSum;
      }
    });

    docTotal = subTotal + vatSum;

    this.modeloFormPie2.patchValue({ 'subTotal': subTotal, 'vatSum': vatSum, 'docTotal': docTotal });
  }
  onCloseArticulo()
  {
    this.isVisualizarArticulo = !this.isVisualizarArticulo;
  }
  onOpenImpuesto(index: number) {
    this.indexImpuesto = index;
    this.isVisualizarImpuesto = !this.isVisualizarImpuesto;
  }
  onSelectedImpuesto(value: IImpuestoSap) {
    this.detalle[this.indexImpuesto].taxCode      = value.code;
    this.detalle[this.indexImpuesto].vatPrcnt     = value.rate;
    this.calcularTotalLinea(this.detalle[this.indexImpuesto], this.indexImpuesto);
    this.calcularTotales();
    this.isVisualizarImpuesto = !this.isVisualizarImpuesto;
  }
  onCloseImpuesto()
  {
    this.isVisualizarImpuesto = !this.isVisualizarImpuesto;
  }
  //#endregion

  onSelectedEmpleadoVenta(value) {
    this.modeloFormPie1.patchValue({ 'slpCode': value.slpCode });
  }

  validatedSave(){
    let line: number = 0;
    //const { estado } = this.modeloFormCab2.controls;

    // if (tipoPicking === '' || tipoPicking === null)
    // {
    //   this.isSaving = false;
    //   this.swaCustomService.swaMsgInfo('Seleccione el tipo de picking.');
    //   return false;
    // }

    // if (estado.value === null || estado.value === undefined)
    // {ddd
    //   this.isSaving = false;
    //   this.swaCustomService.swaMsgInfo('Seleccione el estado.');
    //   return false;
    // }

    // if (estado.value.codEstado !== '01')
    // {
    //   this.isSaving = false;
    //   this.swaCustomService.swaMsgInfo('El estado del picking no es válido.');
    //   return false;
    // }

    // if(cardCode.value === '')
    // {
    //   this.isSaving = false;
    //   this.swaCustomService.swaMsgInfo('Seleccione el cliente.');
    //   return false;
    // }

    for (let index = 0; index < this.detalle.length; index++) {
      if(this.detalle[index].itemCode)
      {
        line++;
      }
    }

    if(line === 0)
    {
      this.isSaving = false;
      this.swaCustomService.swaMsgInfo('El detalle debe tener al menos un articulo.');
      return false;
    }


    for (let index = 0; index < this.detalle.length; index++) {
      if(this.detalle[index].itemCode)
      {
        if (this.detalle[index].quantity === 0)
        {
          this.isSaving = false;
          this.swaCustomService.swaMsgInfo('La cantidad debe ser mayor que CERO (0).');
          return;
        }
        if (this.detalle[index].priceBefDi === 0)
        {
          this.isSaving = false;
          this.swaCustomService.swaMsgInfo('El precio debe ser mayor que CERO (0).');
          return;
        }
      }
    }

    return true;
  }

  onToSave() {
    this.isSaving = true;
    if(!this.validatedSave()) return;
    // =================================================================================
    // CABECERA
    // =================================================================================
    this.modeloSave.docDate         = this.modeloFormCab2.controls['docDate'].value;
    this.modeloSave.docDueDate      = this.modeloFormCab2.controls['docDueDate'].value;
    this.modeloSave.taxDate         = this.modeloFormCab2.controls['taxDate'].value;
    // =================================================================================
    // CLIENTE
    // =================================================================================
    this.modeloSave.cardCode        = this.modeloFormCab1.controls['cardCode'].value;
    this.modeloSave.licTradNum      = this.modeloFormCab1.controls['licTradNum'].value;
    this.modeloSave.cardName        = this.modeloFormCab1.controls['cardName'].value;
    this.modeloSave.cntctCode       = this.modeloFormCab1.controls['cntctCode'].value;
    this.modeloSave.numOrdCom       = this.modeloFormCab1.controls['numOrdCom'].value;
    this.modeloSave.docCur          = this.modeloFormCab1.controls['docCur'].value;
    this.modeloSave.docRate         = this.modeloFormCab1.controls['docRate'].value;
    // =================================================================================
    // LOGISTICA
    // =================================================================================
    this.modeloSave.payToCode       = this.modeloFormLog.controls['payToCode'].value;
    this.modeloSave.address         = this.modeloFormLog.controls['address'].value;
    this.modeloSave.shipToCode      = this.modeloFormLog.controls['shipToCode'].value;
    this.modeloSave.address2        = this.modeloFormLog.controls['address2'].value;
    // =================================================================================
    // FINANZAS
    // =================================================================================
    this.modeloSave.groupNum        = this.modeloFormFin.controls['groupNum'].value;
    // =================================================================================

    // =================================================================================
    // AGENCIA
    // =================================================================================
    this.modeloSave.codAgencia      = this.modeloFormAge.controls['codAgencia'].value;
    this.modeloSave.rucAgencia      = this.modeloFormAge.controls['rucAgencia'].value;
    this.modeloSave.nomAgencia      = this.modeloFormAge.controls['nomAgencia'].value;
    this.modeloSave.codDirAgencia   = this.modeloFormAge.controls['codDirAgencia'].value;
    this.modeloSave.dirAgencia      = this.modeloFormAge.controls['dirAgencia'].value;
    // =================================================================================
    // EXPORTACION
    // =================================================================================
    this.modeloSave.codTipFlete     = this.modeloFormExp.controls['codTipFlete'].value;
    this.modeloSave.valorFlete      = this.modeloFormExp.controls['valorFlete'].value;
    this.modeloSave.totalFlete      = this.modeloFormExp.controls['totalFlete'].value;
    this.modeloSave.importeSeguro   = this.modeloFormExp.controls['importeSeguro'].value;
    this.modeloSave.puerto          = this.modeloFormExp.controls['puerto'].value;
    // =================================================================================
    // OTROS
    // =================================================================================
    this.modeloSave.codTipVenta     = this.modeloFormOtr.controls['codTipVenta'].value;
    // == ===============================================================================
    // PRIE
    // =================================================================================
    this.modeloSave.slpCode         = this.modeloFormPie1.controls['slpCode'].value ;
    this.modeloSave.comments        = this.modeloFormPie1.controls['comments'].value;

    // TOTALES
    this.modeloSave.vatSum          = this.modeloFormPie2.controls['vatSum'].value;
    this.modeloSave.docTotal        = this.modeloFormPie2.controls['docTotal'].value;

    this.modeloSave.idUsuarioCreate = this.userContextService.getIdUsuario();

    this.modeloSave.linea = [];
    for (let index = 0; index < this.detalle.length; index++) {
      this.modeloSave.linea.push
      ({
        line              : index,
        itemCode          : this.detalle[index].itemCode,
        dscription        : this.detalle[index].dscription,
        whsCode           : this.detalle[index].whsCode,
        unitMsr           : this.detalle[index].unitMsr,
        quantity          : this.detalle[index].quantity,
        openQty           : this.detalle[index].openQty,
        openQtyRd         : this.detalle[index].openQtyRd,
        currency          : this.detalle[index].currency,
        priceBefDi        : this.detalle[index].priceBefDi,
        discPrcnt         : this.detalle[index].discPrcnt,
        price             : this.detalle[index].price,
        lineTotal         : this.detalle[index].lineTotal,
        taxCode           : this.detalle[index].taxCode,
        vatPrcnt          : this.detalle[index].vatPrcnt,
        vatSum            : this.detalle[index].vatSum,
      });
    }

    this.ordenVentaService.setCreate(this.modeloSave)
    .subscribe({ next: (data:any)=>{
        this.isSaving = false;
        this.swaCustomService.swaMsgExito(null);
        this.back();
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
        this.onToSave();
      }
    });
  }

  back() {
    this.router.navigate(['/main/modulo-ven/panel-orden-venta-list']);
  }
}
