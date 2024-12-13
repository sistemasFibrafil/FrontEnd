import { SelectItem } from 'primeng/api';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { UtilService } from 'src/app/services/util.service';
import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { LayoutComponent } from 'src/app/layout/layout.component';

import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { UserContextService } from 'src/app/services/user-context.service';

import { IStatus } from 'src/app/modulos/modulo-gestion/interfaces/web/definiciones/general/status.interface';
import { IOrdenVentaSapPendienteByFiltro } from 'src/app/modulos/modulo-ventas/interfaces/orden-venta-sap.interface';
import { IOrdenVentaSodimac, IOrdenVentaSodimacDetalle } from 'src/app/modulos/modulo-ventas/interfaces/orden-venta-sodimac.interface';
import { OrdenVentaSodimacCreateModel } from 'src/app/modulos/modulo-ventas/models/orden-venta-sodimac.model';
import { StatusService } from 'src/app/modulos/modulo-gestion/services/web/definiciones/general/status.service';
import { OrdenVentaSodimacService } from 'src/app/modulos/modulo-ventas/services/web/orden-venta-sodimac.service';



@Component({
  selector: 'app-ven-panel-sodimac-ov-view',
  templateUrl: './panel-sodimac-ov-view.component.html',
  styleUrls: ['./panel-sodimac-ov-view.component.css']
})
export class PanelSodimacOrdenVentaViewComponent implements OnInit {

  // Titulo del componente
  titulo = 'Órden de Venta';

  modeloFormCab1: FormGroup;
  modeloFormCab2: FormGroup;
  buttonAcces: ButtonAcces = new ButtonAcces();
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  docEntry: number = 0;
  idOrdenVentaSodimac: number = 0;

  modeloSave: OrdenVentaSodimacCreateModel = new OrdenVentaSodimacCreateModel();
  listEstado: SelectItem[];

  //MODAL:
  isImport: Boolean = false;

  // MODAL: Progreso
  isDisplay: boolean = false;
  isSaving: boolean = false;

  // DETALLE
  columnas: any[];
  detail: IOrdenVentaSodimacDetalle[] = [];
  selectedItem: IOrdenVentaSodimacDetalle;


  constructor
  (
    private router: Router,
    private fb: FormBuilder,
    private userContextService: UserContextService,
    public app: LayoutComponent,
    public lenguageService: LanguageService,
    private readonly route: ActivatedRoute,
    public readonly utilService: UtilService,
    private readonly swaCustomService: SwaCustomService,
    private statusService: StatusService,
    private ordenVentaSodimacService: OrdenVentaSodimacService,
  ) {}

  ngOnInit() {
    this.onBuildForm();
    this.onBuildColumn();
    this.getListEstado();

    this.route.params.subscribe((params: Params) => {
      this.idOrdenVentaSodimac = params["id"];
      setTimeout(() => {
        this.getById(this.idOrdenVentaSodimac);
      }, 10);
    });
  }

  onBuildForm() {
    this.modeloFormCab1 = this.fb.group(
    {
      'cardCode'        : new FormControl({ value: '', disabled: true }),
      'cardName'        : new FormControl({ value: '', disabled: true }),
      'cntctCode'       : new FormControl({ value: '', disabled: true }),
      'cntctName'       : new FormControl({ value: '', disabled: true }),
      'address'         : new FormControl({ value: '', disabled: true })
    });
    this.modeloFormCab2 = this.fb.group(
    {
      'docEntry'          : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required])),
      'docNum'            : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required])),
      'numOrdenCompra'    : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required])),
      'estado'            : new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required])),
      'docDate'           : new FormControl({ value: null, disabled: true }, Validators.compose([Validators.required])),
      'docDueDate'        : new FormControl({ value: null, disabled: true }, Validators.compose([Validators.required])),
      'taxDate'           : new FormControl({ value: null, disabled: true }, Validators.compose([Validators.required])),
    });
  }

  onBuildColumn() {
    this.columnas = [
      { field: 'line', header: '#' },
      { field: 'itemCode', header: 'Código' },
      { field: 'sku', header: 'Sku' },
      { field: 'dscription', header: 'Descripción' },
      { field: 'dscriptionLarga', header: 'Descripción larga' },
      { field: 'nomLocal', header: 'Local' },
      { field: 'quantity', header: 'Cantidad' }
    ];
  }

  getListEstado() {
    this.statusService.getList()
    .subscribe({next:(data: IStatus[]) =>{
        this.listEstado = [];
        for (let item of data) {
          this.listEstado.push({ label: item.statusName, value: item.statusCode });
        }

        const item: any = this.listEstado.find(x=>x.value === '01');
        this.modeloFormCab2.controls['estado'].setValue({ label: item.label, value: item.value });
      },error:(e)=>{
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onToOrdenVentaSelected(value: IOrdenVentaSapPendienteByFiltro)
  {
    this.modeloFormCab1.patchValue
    ({
        cardCode    : value.cardCode,
        cardName    : value.cardName,
        cntctCode   : value.cntctCode,
        cntctName   : value.cntctName,
        address     : value.address2
    });

    this.modeloFormCab2.patchValue
    ({
        docEntry          : value.docEntry,
        docNum            : value.docNum,
        numOrdenCompra    : value.numOrdenCompra,
        docDate           : (value.docDate == null ?  null : new Date(value.docDate)),
        docDueDate        : (value.docDueDate == null ?  null : new Date(value.docDueDate)),
        taxDate           : (value.taxDate == null ?  null : new Date(value.taxDate)),
    });
  }

  set(value: IOrdenVentaSodimac)
  {
    this.docEntry = value.docEntry;
    this.detail = value.item;
  }

  getById(id: number) {
    this.isDisplay = true;
    this.ordenVentaSodimacService.getOrdenVentaSodimacById(id)
    .subscribe({next:(data: IOrdenVentaSodimac) =>{
        this.isDisplay = false;
        this.set(data);
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onToImportExcel() {

    if(!this.modeloFormCab2.controls['docNum'].value)
    {
      this.swaCustomService.swaMsgInfo('Selecione la órden de venta.');
      return;
    }

    if(this.modeloFormCab2.controls['docNum'].value)
    {
      if(!this.modeloFormCab2.controls['numOrdenCompra'].value)
      {
        this.swaCustomService.swaMsgInfo('La órden de venta seleccionada no tiene el número de OC asignado.');
        return;
      }
    }

    this.isImport = !this.isImport;
  }

  onToSelectedFile(data)
  {
    this.detail = [];
    this.detail = data;
    this.isImport = !this.isImport;
  }

  onToCancelImport(event)
  {
    this.isImport = !this.isImport;
  }

  onToValidatedSave(){
    if(!this.modeloFormCab1.controls['cardCode'].value)
    {
      this.swaCustomService.swaMsgInfo('El código de cliente no es válido.');
      return false;
    }

    if(!this.modeloFormCab1.controls['cardCode'].value)
    {
      this.swaCustomService.swaMsgInfo('El nombre de cliente no es válido.');
      return false;
    }

    if(!this.modeloFormCab2.controls['docNum'].value)
    {
      this.swaCustomService.swaMsgInfo('Selecione la órden de venta.');
      return false;
    }

    if(this.modeloFormCab2.controls['docNum'].value)
    {
      if(!this.modeloFormCab2.controls['numOrdenCompra'].value)
      {
        this.swaCustomService.swaMsgInfo('La órden de venta seleccionada no tiene el número de OC asignado.');
        return false;
      }
    }

    if (!this.modeloFormCab2.controls['estado'].value) {
      this.swaCustomService.swaMsgInfo('Seleccione el estado.');
      return false;
    }

    if(!this.modeloFormCab2.controls['docDate'].value)
    {
      this.swaCustomService.swaMsgInfo('La fecha de contabilización no es válida.');
      return false;
    }

    if(!this.modeloFormCab2.controls['docDueDate'].value)
    {
      this.swaCustomService.swaMsgInfo('La fecha de contabilización no es válida.');
      return false;
    }

    if(!this.modeloFormCab2.controls['taxDate'].value)
    {
      this.swaCustomService.swaMsgInfo('La fecha de contabilización no es válida.');
      return false;
    }

    return true;
  }

  onToSave() {
    this.isSaving = true;
    if(!this.onToValidatedSave()) return;

    // CAB 01: SOCIO NEGOCIO
    this.modeloSave.cardCode = this.modeloFormCab1.controls['cardCode'].value;
    this.modeloSave.cardName = this.modeloFormCab1.controls['cardName'].value;
    if (this.modeloFormCab1.controls['cntctCode'].value)
    {
      this.modeloSave.cntctCode = this.modeloFormCab1.controls['cntctCode'].value;
    }
    this.modeloSave.address = this.modeloFormCab1.controls['address'].value;

    // CAB 02: ORDEN DE VENTA
    this.modeloSave.docNum = this.modeloFormCab2.controls['docNum'].value;
    this.modeloSave.numOrdenCompra = this.modeloFormCab2.controls['numOrdenCompra'].value;

    if (this.modeloFormCab2.controls['estado'].value) {
      let itemEstado = this.modeloFormCab2.controls['estado'].value;
      this.modeloSave.docStatus = itemEstado.value;
    }
    this.modeloSave.docDate = this.modeloFormCab2.controls['docDate'].value;
    this.modeloSave.docDueDate = this.modeloFormCab2.controls['docDueDate'].value;
    this.modeloSave.taxDate = this.modeloFormCab2.controls['taxDate'].value;
    this.modeloSave.idUsuarioCreate = this.userContextService.getIdUsuario();

    // DETALLE
    this.modeloSave.item = [];
    for (let index = 0; index < this.detail.length; index++) {
      this.modeloSave.item.push
      ({
        id                  : 0,
        line                : this.detail[index].line,
        numLocal            : this.detail[index].numLocal,
        lineStatus          : this.detail[index].lineStatus,
        itemCode            : this.detail[index].itemCode,
        sku                 : this.detail[index].sku,
        dscription          : this.detail[index].dscription,
        dscriptionLarga     : this.detail[index].dscriptionLarga,
        ean                 : this.detail[index].ean,
        quantity            : this.detail[index].quantity
      });
    }

    this.ordenVentaSodimacService.setCreate(this.modeloSave)
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
    this.router.navigate(['/main/modulo-ven/panel-sodimac-ov-list']);
  }
}
