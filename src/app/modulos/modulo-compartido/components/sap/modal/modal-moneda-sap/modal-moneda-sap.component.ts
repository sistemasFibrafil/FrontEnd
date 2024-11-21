import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { IMonedaSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/finanzas/moneda-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { MonedaSapService } from 'src/app/modulos/modulo-gestion/services/sap/definiciones/finanzas/moneda-sap.service';



@Component({
  selector: 'app-modal-moneda-sap',
  templateUrl: './modal-moneda-sap.component.html'
})
export class ModalMonedaSapComponent implements OnInit, OnChanges {
  modeloFormVisor: FormGroup;
  modeloFormBusqueda: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  isDisplay: Boolean = false;
  isVisualizar: Boolean = false;

  columnas: any[];
  list: IMonedaSap[] = [];
  params: FilterRequestModel = new FilterRequestModel();

  @Input() cardCode           : string;
  @Input() currCode           : string;
  @Input() mainCurncy         : string;
  @Input() isHabilitaControl  : boolean;
  @Input() isHabilitarButton  : boolean;
  @Input() isVisibleLimpiar   : boolean = false;

  @Output() eventoAceptar = new EventEmitter<IMonedaSap>();
  @Output() eventoCancelar = new EventEmitter<IMonedaSap>();
  @Output() eventoLimpiar = new EventEmitter<boolean>();

  constructor
  (
    private readonly fb: FormBuilder,
    private monedaSapService: MonedaSapService
  ) { }

  ngOnChanges(changes: SimpleChanges): void{
    if(this.modeloFormVisor !== undefined)
    {
      this.modeloFormVisor.patchValue({
        'currCode': ''
      });
    }
    if(this.modeloFormBusqueda !== undefined)
    {
      this.modeloFormBusqueda.patchValue({
        'text1': ''
      });
    }

    if (this.currCode === undefined || this.currCode === null || this.currCode === '') {
      return;
    }

    this.modeloFormVisor.patchValue({
      'currCode': this.currCode === '##' ? this.mainCurncy : this.currCode
    });
  }

  ngOnInit(): void {
    this.buildFormVisor();
    this.buildFormBusqueda();
    this.onBuildColum();
  }

  private buildFormVisor() {
    this.modeloFormVisor = this.fb.group({
      'currCode': new FormControl({ value: '', disabled: false }),
    });
  }

  private buildFormBusqueda() {
    this.modeloFormBusqueda = this.fb.group({
      'text1': new FormControl(''),
    });
  }

  onBuildColum() {
    this.columnas =
    [
      { field: 'currCode',  header: 'Código' },
      { field: 'currName',  header: 'Nombre' }
    ];
  }

  getParams()
  {
    this.params = this.modeloFormBusqueda.getRawValue();
    this.params.cod1 = this.currCode;
  }

  onToBuscar() {
    this.isDisplay = true;
    this.list = [];
    this.getParams();
    this.monedaSapService.getListByFiltro(this.params)
    .subscribe({next:(data: IMonedaSap[]) =>{
        this.isDisplay = false;
        this.list = data;
      },error:(e)=>{
        this.list = [];
        this.isDisplay = false;
        let swalWithBootstrapButtons = Swal.mixin({ customClass: { container: 'my-swal' }, target: document.getElementById('modal') });
        swalWithBootstrapButtons.fire(this.globalConstants.msgInfoSummary, e.error.resultadoDescripcion, 'error');
      }
    });
  }

  onToSelected(value: IMonedaSap) {
    this.setClearFiltro();
    this.modeloFormVisor.patchValue({
      'currCode': value.currCode
    });
    this.isVisualizar = false;
    this.eventoAceptar.emit(value);
  }

  private setClearFiltro() {
    this.modeloFormBusqueda.patchValue({
      'text1': ''
    });
    this.list = [];
  }

  onVisible()
  {
    this.isVisualizar = true;
  }

  onHide()
  {
    this.onClickClose();
  }

  onClickClose()
  {
    this.setClearFiltro();
    this.isVisualizar = false;
  }
}
