import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { IAlmacenSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/inventario/almacen-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { AlmacenService } from 'src/app/modulos/modulo-gestion/services/sap/definiciones/inventario/almacen-sap.service';



@Component({
  selector: 'app-modal-almacen-sap',
  templateUrl: './modal-almacen-sap.component.html'
})
export class ModalAlmacenSapComponent implements OnInit, OnChanges {
  modeloFormVisor: FormGroup;
  modeloFormBusqueda: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  isDisplay: Boolean = false;
  isVisualizar: Boolean = false;

  columnas: any[];
  list: IAlmacenSap[] = [];
  params: FilterRequestModel = new FilterRequestModel();

  @Input() whsCode: string;
  @Input() demandante: string;
  @Input() itemCode: string;
  @Input() inactive: string;
  @Input() isHabilitaControl: boolean;
  @Input() isHabilitarButton: boolean;
  @Input() isVisibleLimpiar: boolean = false;

  @Output() eventoAceptar = new EventEmitter<IAlmacenSap>();
  @Output() eventoCancelar = new EventEmitter<IAlmacenSap>();
  @Output() eventoLimpiar = new EventEmitter<boolean>();

  constructor
  (
    private readonly fb: FormBuilder,
    private almacenService: AlmacenService
  ) { }

  ngOnChanges(changes: SimpleChanges): void{
    if (this.whsCode === undefined || this.whsCode === null || this.whsCode.trim() === '') {
      return;
    }

    this.modeloFormBusqueda.patchValue({
      'text1': ''
    });

    this.getByCode(this.whsCode);
  }

  ngOnInit(): void {
    this.buildFormVisor();
    this.buildFormBusqueda();
    this.onBuildColum();
  }

  private buildFormVisor() {
    this.modeloFormVisor = this.fb.group({
      'whsCode': new FormControl({ value: '', disabled: true }),
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
      { field: 'whsCode', header: 'Código' },
      { field: 'whsName', header: 'Nombre' }
    ];
  }

  getParams()
  {
    this.params = this.modeloFormBusqueda.getRawValue();
    this.params.cod1 = this.demandante;
    this.params.cod2 = this.itemCode;
    this.params.cod3 = this.inactive;
  }

  onToBuscar() {
    this.isDisplay = true;
    this.list = [];
    this.getParams();
    this.almacenService.getListByFiltro(this.params)
    .subscribe({next:(data: IAlmacenSap[]) =>{
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

  getByCode(code) {
    const param: any = {cod1: code };
    this.almacenService.getByCode(param)
    .subscribe({next:(value: IAlmacenSap) =>{
        this.modeloFormVisor.patchValue({
          'whsCode': `${value.whsCode} - ${value.whsName}`
        });
        this.eventoAceptar.emit(value);
      },error:(e)=>{
        let swalWithBootstrapButtons = Swal.mixin({ customClass: { container: 'my-swal' }, target: document.getElementById('modal') });
        swalWithBootstrapButtons.fire(this.globalConstants.msgInfoSummary, e.error.resultadoDescripcion, 'error');
      }
    });
  }

  onToSelected(value: IAlmacenSap) {
    this.setClearFiltro();
    this.modeloFormVisor.patchValue({
      'whsCode': `${value.whsCode} - ${value.whsName}`
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

  onClickClose()
  {
    this.setClearFiltro();
    this.isVisualizar = false;
  }
}
