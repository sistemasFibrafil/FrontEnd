import { SelectItem } from 'primeng/api';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';
import { LayoutComponent } from 'src/app/layout/layout.component';
import { UtilService } from 'src/app/services/util.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { LanguageService } from 'src/app/services/language.service';

import { ISolicitudTraslado, ISolicitudTrasladoDetalle } from 'src/app/modulos/modulo-inventario/interfaces/web/solicitud-traslado.interface';
import { SolicitudTrasladoCreateModel } from 'src/app/modulos/modulo-inventario/models/web/solicitud-traslado.model';
import { SolicitudTrasladoService } from 'src/app/modulos/modulo-inventario/services/web/solicitud-traslado.service';

interface DocStatus {
  statusCode  : string,
  statusName  : string
}

@Component({
  selector: 'panel-inv-solicitud-traslado-view',
  templateUrl: './panel-solicitud-traslado-view.component.html',
  styleUrls: ['./panel-solicitud-traslado-view.component.css']
})
export class PanelSolicitudTrasladoViewComponent implements OnInit {

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
  modeloSave: SolicitudTrasladoCreateModel = new SolicitudTrasladoCreateModel();

  id        : number = 0;
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
  // DETALLE
  opciones: any = [];
  columnas: any[];
  detalle: ISolicitudTrasladoDetalle[] = [];
  detalleSelected: ISolicitudTrasladoDetalle;

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
    private readonly route: ActivatedRoute,
    public readonly utilService: UtilService,
    private readonly swaCustomService: SwaCustomService,
    private solicitudTrasladoService: SolicitudTrasladoService,
  ) {}

  ngOnInit() {
    this.onBuildForm();
    this.onBuildColumn();
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
      'cardCode'        : new FormControl({ value: '', disabled: false }),
      'cardName'        : new FormControl({ value: '', disabled: true }),
      'cntctCode'       : new FormControl({ value: '', disabled: true }),
      'address'         : new FormControl({ value: '', disabled: true })
    });
    this.modeloFormCab2 = this.fb.group(
    {
      'docNum'      : new FormControl({ value: '', disabled: true }),
      'docStatus'   : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required])),
      'read'        : new FormControl({ value: false, disabled: true}),
      'docDate'     : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required])),
      'docDueDate'  : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required])),
      'taxDate'     : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required]))
    });

    this.modeloFormCab3 = this.fb.group(
    {
      'whsCodeOrigen'   : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'whsCodeDestino'  : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
    });

    this.modeloFormCab3 = this.fb.group(
    {
      'codTipTraslado'  : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'codMotTraslado'  : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
      'codTipSalida'    : new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required])),
    });

    this.modeloFormPie1 = this.fb.group(
    {
      'slpCode'  : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required])),
      'jrnlMemo' : new FormControl({ value: this.jrnlMemo, disabled: true }),
      'comments' : new FormControl({ value: '', disabled: true }),
    });
  }

  onBuildColumn() {
    this.columnas = [
      { field: 'itemCode',    header: 'Código' },
      { field: 'itemName',    header: 'Descripción' },
      { field: 'fromWhsCod',  header: 'Almacén de origen' },
      { field: 'whsCode',     header: 'Almacén de destino' },
      { field: 'unitMsr',     header: 'UM' },
      { field: 'quantity',    header: 'Cantidad' }
    ];
  }

  opcionesTabla() {
    this.opciones = [
      { label: 'Añadir línea',      icon: 'pi pi-pencil',      command: () => {  } },
      { label: 'Borrar línea',      icon: 'pi pi-times',       command: () => {  } },
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
    setTimeout(() => {
      this.modeloFormCab3.patchValue({ 'whsCodeOrigen' : value.whsCode });
      if(this.detalle.length > 0){
        this.detalle.forEach(x => {
          if(x.itemCode !== '')
          {
            x.fromWhsCod = value.whsCode;
          }
        });
      }
    }, 10);
  }

  onSelectedAlmacenDestino(value: any) {
    setTimeout(() => {
      this.modeloFormCab3.patchValue({ 'whsCodeDestino' : value.whsCode });
      if(this.detalle.length > 0){
        this.detalle.forEach(x => {
          if(x.itemCode !== '')
          {
            x.whsCode = value.whsCode;
          }
        });
      }
    }, 10);
  }

  onSelectedTipoTraslado(value: any) {
    this.modeloFormCab3.patchValue({ 'codTipTraslado' : value.fldValue });
  }

  onSelectedMotivoTraslado(value: any) {
    this.modeloFormCab3.patchValue({ 'codMotTraslado' : value.fldValue });
  }

  onSelectedTipoSalida(value: any) {
    this.modeloFormCab3.patchValue({ 'codTipSalida' : value.fldValue });
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

  onClickArticuloClose()
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

  onClickDelete(value: ISolicitudTrasladoDetalle)
  {
    if(this.detalle.length === 1)
    {
      return;
    }
    let index = this.detalle.indexOf(value);
    this.detalle.splice(+index, 1);
  }
  //#endregion

  onSelectedEmpleadoVenta(value: any) {
    this.modeloFormPie1.patchValue({ 'slpCode' : value.slpCode });
  }

  //#region <<< SAVE >>>
  set(data: ISolicitudTraslado)
  {
    setTimeout(() => {
      this.docEntry = data.docEntry;
      this.cardCode = data.cardCode;
      this.cntctCode = data.cntctCode;
      this.whsCodeOrigen = data.filler;
      this.whsCodeDestino = data.toWhsCode;
      this.codTipTraslado = data.codTipTraslado;
      this.codMotTraslado = data.codMotTraslado;
      this.codTipSalida = data.codTipSalida;
      this.slpCode = data.slpCode;
    }, 10);

    const status = this.docStatus.find(x => x.statusCode === data.docStatus);

    this.modeloFormCab2.controls['docNum'].setValue( data.docNum );
    this.modeloFormCab2.controls['docStatus'].setValue({ label: status.statusName, value: status.statusCode });
    this.modeloFormCab2.controls['docDate'].setValue( data.docDate == null ?  null : new Date(data.docDate) );
    this.modeloFormCab2.controls['docDueDate'].setValue( data.docDueDate == null ?  null : new Date(data.docDueDate) );
    this.modeloFormCab2.controls['taxDate'].setValue( data.taxDate == null ?  null : new Date(data.taxDate) );
    this.modeloFormCab2.controls['read'].setValue( data.read === 'Y'? true : false );
    this.modeloFormPie1.controls['jrnlMemo'].setValue( data.jrnlMemo );
    this.modeloFormPie1.controls['comments'].setValue( data.comments );
  }

  getById(id: number) {
    this.isDisplay = true;
    this.solicitudTrasladoService.getById(id)
    .subscribe({next:(data: ISolicitudTraslado) => {
      setTimeout(() => {
        this.set(data);
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


  onClickSave() {
  }
  //#endregion

  onClickBack() {
    this.router.navigate(['/main/modulo-inv/panel-solicitud-traslado-list']);
  }
}
