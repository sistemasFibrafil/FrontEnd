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

import { ISolicitudTraslado, ISolicitudTrasladoDetalle } from 'src/app/modulos/modulo-inventario/interfaces/web/solicitud-traslado.interface';
import { SolicitudTrasladoUpdateModel } from 'src/app/modulos/modulo-inventario/models/web/solicitud-traslado.model';
import { SolicitudTrasladoService } from 'src/app/modulos/modulo-inventario/services/web/solicitud-traslado.service';

interface DocStatus {
  statusCode  : string,
  statusName  : string
}


@Component({
  selector: 'app-inv-panel-solicitud-traslado-update',
  templateUrl: './panel-solicitud-traslado-update.component.html',
  styleUrls: ['./panel-solicitud-traslado-update.component.css']
})
export class PanelSolicitudTrasladoUpdateComponent implements OnInit {

  // Titulo del componente
  titulo = 'Solicitud de Traslado';

  modeloFormCab1: FormGroup;
  modeloFormCab2: FormGroup;
  modeloFormCab3: FormGroup;
  modeloFormOtr: FormGroup;
  modeloFormPie1: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  jrnlMemo: string = 'Solicitud de traslado - '
  docStatus: DocStatus[];
  docStatusList: SelectItem[];
  modeloSave: SolicitudTrasladoUpdateModel = new SolicitudTrasladoUpdateModel();

  id      : number = 0;
  docEntry: number = 0;

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

  // MODAL: Tipo de traslado
  codTipTraslado: string = '';

  // MODAL: Motivo de traslado
  codMotTraslado: string = '';

  // MODAL: Tipo de salida
  codTipSalida: string = '';

  // DETALLE
  opciones: any = [];

  modelo: ISolicitudTraslado;
  modeloDetalle: ISolicitudTrasladoDetalle;
  detalleSelected: ISolicitudTrasladoDetalle;
  detalle: ISolicitudTrasladoDetalle[] = [];
  detalleCerrar: ISolicitudTrasladoDetalle[] = [];
  detalleEliminar: ISolicitudTrasladoDetalle[] = [];

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
    private solicitudTrasladoService: SolicitudTrasladoService,
  ) {}

  ngOnInit() {
    this.onBuildForm();
    this.opcionesTabla();
    this.getListEstado();

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
      'docNum'      : new FormControl({ value: '', disabled: true }),
      'docStatus'   : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required])),
      'docDate'     : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'docDueDate'  : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'taxDate'     : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'read'        : new FormControl(true),
    });

    this.modeloFormCab3 = this.fb.group(
    {
      'whsCodeOrigen'   : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'whsCodeDestino'  : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
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
      'jrnlMemo' : new FormControl(this.jrnlMemo),
      'comments' : new FormControl(''),
    });
  }

  opcionesTabla() {
    this.opciones = [
      { label: 'Añadir línea',      icon: 'pi pi-pencil',      command: () => { this.onClickAddLine() } },
      { label: 'Borrar línea',      icon: 'pi pi-times',       command: () => { this.onClickDelete() } },
    ];
  }

  onSelectedItem(modelo: ISolicitudTrasladoDetalle) {
    this.detalleSelected = modelo;
    if(this.detalle.filter(x => x.itemCode === '').length === 0){
      this.opciones.find(x => x.label == "Añadir línea").visible = true;
    } else {
      this.opciones.find(x => x.label == "Añadir línea").visible = false;
    }
    if(this.detalle.length > 0 && modelo.lineStatus === '01' && (modelo.quantity === modelo.openQtyRding || modelo.quantity === modelo.openQty)){
      this.opciones.find(x => x.label == "Borrar línea").visible = true;
    } else {
      this.opciones.find(x => x.label == "Borrar línea").visible = false;
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

  onSelectedAlmacenOrigen(value: any) {
    this.modeloFormCab3.patchValue({ 'whsCodeOrigen' : value.whsCode });

    if(this.detalle.length > 0)
    {
      this.detalle.forEach(x => {
        if(x.itemCode !== '')
        {
          x.fromWhsCod = value.whsCode;
        }
      });
    }
  }

  onSelectedAlmacenDestino(value: any) {
    this.modeloFormCab3.patchValue({ 'whsCodeDestino' : value.whsCode });

    if(this.detalle.length > 0)
    {
      this.detalle.forEach(x => {
        if(x.itemCode !== '')
        {
          x.whsCode = value.whsCode;
        }
      });
    }
  }

  onSelectedTipoTraslado(value: any) {
    this.modeloFormOtr.patchValue({ 'codTipTraslado' : value.fldValue });
  }

  onSelectedMotivoTraslado(value: any) {
    this.modeloFormOtr.patchValue({ 'codMotTraslado' : value.fldValue });
  }

  onSelectedTipoSalida(value: any) {
    this.modeloFormOtr.patchValue({ 'codTipSalida' : value.fldValue });
  }

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
  onOpenAlmacenOrigen(value: ISolicitudTrasladoDetalle, index: number) {
    this.indexAlmacenOrigen = index;
    this.itemCode = value.itemCode;
    this.isVisualizarAlmacenOrigen = !this.isVisualizarAlmacenOrigen;
  }

  onOpenAlmacenDestino(value: ISolicitudTrasladoDetalle, index: number) {
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

  onChangeQuantity(value: ISolicitudTrasladoDetalle, index: number)
  {
    if(value.record === 1)
    {
      this.onUpdateQuantity1(value, index);
    }
    else
    {
      this.onUpdateQuantity2(value, index);
    }
  }

  onUpdateQuantity1(value: ISolicitudTrasladoDetalle, index: number)
  {
    let quantity      : number = 0;
    let openQtyRding  : number = 0;
    let openQty       : number = 0;

    quantity          = this.utilService.onRedondearDecimal(value.quantity, 3);
    openQtyRding      = this.utilService.onRedondearDecimal(value.quantity, 3);
    openQty           = this.utilService.onRedondearDecimal(value.quantity, 3);

    this.detalle[index].quantity      = value.itemCode === '' ? 0 : quantity;
    this.detalle[index].openQtyRding  = value.itemCode === '' ? 0 : openQtyRding;
    this.detalle[index].openQty       = value.itemCode === '' ? 0 : openQty;
  }

  onUpdateQuantity2(value: ISolicitudTrasladoDetalle, index: number)
  {
    let quantity   : number = 0;
    let read       : number = 0;
    let earring    : number = 0;

    const params  = {id1: value.id, id2: value.line};

    this.solicitudTrasladoService.getSolicitudTrasladoDetalleByIdAndLine(params)
    .subscribe({next:(data: ISolicitudTrasladoDetalle) => {
        this.modeloDetalle = data;

        quantity      = this.utilService.onRedondearDecimal(value.quantity, 3);
        read          = this.utilService.onRedondearDecimal(this.modeloDetalle.quantity - this.modeloDetalle.openQtyRding, 3);
        earring       = this.utilService.onRedondearDecimal(this.modeloDetalle.quantity - this.modeloDetalle.openQty, 3);

        this.detalle[index].quantity      = value.itemCode === '' ? 0 : quantity;
        this.detalle[index].openQtyRding  = value.itemCode === '' ? 0 : quantity - read;
        this.detalle[index].openQty       = value.itemCode === '' ? 0 : quantity - earring;
      },error:(e)=>{
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  addLine()
  {
    this.detalle.push({id: 0, line: 0, lineStatus: '01', itemCode: '', dscription: '', fromWhsCod: '', whsCode: '', unitMsr: '', quantity: 0, openQtyRding: 0, openQty: 0, record: 1 });
  }

  onClickAddLine()
  {
    this.addLine();
  }

  onClickDelete()
  {
    if(this.detalleSelected.record == 2)
    {
      // Se define que es borrado
      this.detalleSelected.record = 3;
      this.detalleEliminar.push(this.detalleSelected);
    }

    let index = this.detalle.indexOf(this.detalleSelected);
    this.detalle.splice(+index, 1);

    if(this.detalle.length === 0)
    {
      this.addLine();
    }
  }
  //#endregion

  onSelectedEmpleadoVenta(value: any) {
    this.modeloFormPie1.patchValue({ 'slpCode' : value.slpCode });
  }

  set(value: ISolicitudTraslado)
  {
    setTimeout(() => {
      this.docEntry       = value.docEntry;
      this.cardCode       = value.cardCode;
      this.cntctCode      = value.cntctCode;
      this.whsCodeOrigen  = value.filler;
      this.whsCodeDestino = value.toWhsCode;
      this.codTipTraslado = value.codTipTraslado;
      this.codMotTraslado = value.codMotTraslado;
      this.codTipSalida   = value.codTipSalida;
      this.slpCode        = value.slpCode;

      const status = this.docStatus.find(x => x.statusCode === value.docStatus);

      this.modeloFormCab1.controls['cardCode'].setValue( value.cardCode );
      this.modeloFormCab1.controls['cardName'].setValue( value.cardName );
      this.modeloFormCab1.controls['cntctCode'].setValue( value.cntctCode );
      this.modeloFormCab1.controls['address'].setValue( value.address );
      this.modeloFormCab2.controls['docNum'].setValue( value.docNum );
      this.modeloFormCab2.controls['docStatus'].setValue({ label: status.statusName, value: status.statusCode });
      this.modeloFormCab2.controls['docDate'].setValue( value.docDate == null ?  null : new Date(value.docDate) );
      this.modeloFormCab2.controls['docDueDate'].setValue( value.docDueDate == null ?  null : new Date(value.docDueDate) );
      this.modeloFormCab2.controls['taxDate'].setValue( value.taxDate == null ?  null : new Date(value.taxDate) );
      this.modeloFormCab2.controls['read'].setValue( value.read === 'Y'? true : false );
      this.modeloFormCab3.controls['whsCodeOrigen'].setValue( value.filler );
      this.modeloFormCab3.controls['whsCodeDestino'].setValue( value.toWhsCode );
      this.modeloFormOtr.controls['codTipTraslado'].setValue( value.codTipTraslado );
      this.modeloFormOtr.controls['codMotTraslado'].setValue( value.codMotTraslado );
      this.modeloFormOtr.controls['codTipSalida'].setValue( value.codTipSalida );
      this.modeloFormPie1.controls['slpCode'].setValue( value.slpCode );
      this.modeloFormPie1.controls['jrnlMemo'].setValue( value.jrnlMemo );
      this.modeloFormPie1.controls['comments'].setValue( value.comments );
    }, 20);

    setTimeout(() => {
      this.detalle = value.linea;
    }, 550);
  }

  getById(id: number) {
    this.isDisplay = true;
    this.solicitudTrasladoService.getById(id)
    .subscribe({next:(data: ISolicitudTraslado) => {
      this.isDisplay = false;
      this.modelo = data;
      this.set(this.modelo);
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  //#region <<< Save >>>
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

    for(const linea of this.detalle.filter(x => x.itemCode === ''))
    {
      reg++;
    }

    if(reg > 0)
    {
      this.isSaving = false;
      this.swaCustomService.swaMsgInfo('Ingrese los datos en el detalle de la solicitud.');
      return false;
    }

    for(const linea of this.detalle.filter(x => x.itemCode !== ''))
    {
      if(linea.fromWhsCod === linea.whsCode)
      {
        this.isSaving = false;
        this.swaCustomService.swaMsgInfo('El almacén de destino no puede ser idéntico al almacén de Origen.');
        return false;
      }
      if (linea.quantity === 0)
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
    // CAB 02: SOLICITUD DE TRASLADO

    this.modeloSave.id              = this.id;
    this.modeloSave.docEntry        = this.docEntry;
    this.modeloSave.docDate         = new Date(this.modeloFormCab2.controls['docDate'].value);
    this.modeloSave.docDueDate      = new Date(this.modeloFormCab2.controls['docDueDate'].value);
    this.modeloSave.taxDate         = new Date(this.modeloFormCab2.controls['taxDate'].value);
    this.modeloSave.read            = this.modeloFormCab2.controls['read'].value === true? 'Y' : 'N';

    // CAB 03: SOLICITUD DE TRASLADO
    this.modeloSave.filler          = this.modeloFormCab3.controls['whsCodeOrigen'].value;
    this.modeloSave.toWhsCode       = this.modeloFormCab3.controls['whsCodeDestino'].value;

    // OTROS
    this.modeloSave.codTipTraslado  = this.modeloFormOtr.controls['codTipTraslado'].value;
    this.modeloSave.codMotTraslado  = this.modeloFormOtr.controls['codMotTraslado'].value;
    this.modeloSave.codTipSalida    = this.modeloFormOtr.controls['codTipSalida'].value;

    // PIE 01: SOLICITUD DE TRASLADO
    this.modeloSave.slpCode         = this.modeloFormPie1.controls['slpCode'].value;
    this.modeloSave.jrnlMemo        = this.modeloFormPie1.controls['jrnlMemo'].value;
    this.modeloSave.comments        = this.modeloFormPie1.controls['comments'].value;

    this.modeloSave.idUsuarioUpdate = this.userContextService.getIdUsuario();

    this.modeloSave.linea = [];

    for(const linea of this.detalle.filter(x => x.itemCode !== '' && x.record !== 4))
    {
      this.modeloSave.linea.push
      ({
        id                  : this.id,
        line                : linea.line,
        docEntry            : linea.docEntry,
        lineNum             : linea.lineNum,
        lineStatus          : linea.lineStatus,
        itemCode            : linea.itemCode,
        dscription          : linea.dscription,
        fromWhsCod          : linea.fromWhsCod,
        whsCode             : linea.whsCode,
        unitMsr             : linea.unitMsr,
        quantity            : linea.quantity,
        openQty             : linea.openQty,
        openQtyRding        : linea.openQtyRding,
        idUsuarioCreate     : this.userContextService.getIdUsuario(),
        idUsuarioUpdate     : this.userContextService.getIdUsuario(),
        record              : linea.record,
      });
    }


    for (const linea of this.detalleEliminar.filter(x => x.itemCode !== ''))
    {
      this.modeloSave.linea.push
      ({
        id                  : this.id,
        line                : linea.line,
        docEntry            : linea.docEntry,
        lineNum             : linea.lineNum,
        lineStatus          : linea.lineStatus,
        itemCode            : linea.itemCode,
        dscription          : linea.dscription,
        fromWhsCod          : linea.fromWhsCod,
        whsCode             : linea.whsCode,
        unitMsr             : linea.unitMsr,
        quantity            : linea.quantity,
        openQty             : linea.openQty,
        openQtyRding        : linea.openQtyRding,
        record              : linea.record,
      });
    }

    for (const linea of this.detalleCerrar.filter(x => x.itemCode !== ''))
    {
      this.modeloSave.linea.push
      ({
        id                  : this.id,
        line                : linea.line,
        docEntry            : linea.docEntry,
        lineNum             : linea.lineNum,
        lineStatus          : linea.lineStatus,
        itemCode            : linea.itemCode,
        dscription          : linea.dscription,
        fromWhsCod          : linea.fromWhsCod,
        whsCode             : linea.whsCode,
        unitMsr             : linea.unitMsr,
        quantity            : linea.quantity,
        openQty             : linea.openQty,
        openQtyRding        : linea.openQtyRding,
        record              : linea.record,
        idUsuarioClose      : this.userContextService.getIdUsuario(),
      });
    }

    this.solicitudTrasladoService.setUpdate(this.modeloSave)
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
    this.router.navigate(['/main/modulo-inv/panel-solicitud-traslado-list']);
  }
}
