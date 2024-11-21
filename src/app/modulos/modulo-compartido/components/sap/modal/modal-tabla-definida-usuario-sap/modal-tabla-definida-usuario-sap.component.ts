import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { ITablaDefinidaUsuarioSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/general/tabla-definida-usuario-sap.interface';
import { TablaDefinidaUsuarioSapService } from 'src/app/modulos/modulo-gestion/services/sap/definiciones/general/tabla-definida-usuario-sap.service';



@Component({
  selector: 'app-modal-tabla-definida-usuario-sap',
  templateUrl: './modal-tabla-definida-usuario-sap.component.html'
})
export class ModalTablaDefinidaUsuarioSapComponent implements OnInit, OnChanges {
  modeloFormVisor: FormGroup;
  modeloFormBusqueda: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  isDisplay: Boolean = false;
  isVisualizar: Boolean = false;

  columnas: any[];
  list: ITablaDefinidaUsuarioSap[] = [];
  params: FilterRequestModel = new FilterRequestModel();

  @Input() title: string;
  @Input() nomTabla: string;
  @Input() nomCampo: string;
  @Input() fldValue: string;
  @Input() placeholder: string;
  @Input() isHabilitaControl: boolean;
  @Input() isHabilitarButton: boolean;
  @Input() isVisibleLimpiar: boolean = false;

  @Output() eventoAceptar = new EventEmitter<ITablaDefinidaUsuarioSap>();
  @Output() eventoCancelar = new EventEmitter<ITablaDefinidaUsuarioSap>();
  @Output() eventoLimpiar = new EventEmitter<boolean>();

  constructor
  (
    private readonly fb: FormBuilder,
    private tablaDefinidaUsuarioSapService: TablaDefinidaUsuarioSapService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void{
    if (this.fldValue === undefined || this.fldValue === null || this.fldValue.trim() === '') {
      return;
    }

    this.modeloFormBusqueda.patchValue({
      'text1': ''
    });

    this.getByCode();
  }

  ngOnInit(): void {
    this.buildFormVisor();
    this.buildFormBusqueda();
    this.onBuildColum();
  }

  private buildFormVisor() {
    this.modeloFormVisor = this.fb.group({
      'fullDescr' : new FormControl({ value: '', disabled: true }),
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
      { field: 'fldValue',  header: 'Código' },
      { field: 'descr',     header: 'Nombre' },
    ];
  }

  getParams()
  {
    this.params = this.modeloFormBusqueda.getRawValue();
    this.params.cod1 = this.nomTabla;
    this.params.cod2 = this.nomCampo;
    this.params.cod3 = this.fldValue;
  }

  onToBuscar() {
    this.isDisplay = true;
    this.list = [];
    this.getParams();
    this.tablaDefinidaUsuarioSapService.getListByFiltro(this.params)
    .subscribe({next:(data: ITablaDefinidaUsuarioSap[]) =>{
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

  getByCode() {
    this.getParams();
    this.tablaDefinidaUsuarioSapService.getByCode(this.params)
    .subscribe({next:(value: ITablaDefinidaUsuarioSap) =>{
        this.modeloFormVisor.patchValue({
          'fullDescr': `${value.fullDescr}`
        });
        this.eventoAceptar.emit(value);
      },error:(e)=>{
        let swalWithBootstrapButtons = Swal.mixin({ customClass: { container: 'my-swal' }, target: document.getElementById('modal') });
        swalWithBootstrapButtons.fire(this.globalConstants.msgInfoSummary, e.error.resultadoDescripcion, 'error');
      }
    });
  }

  onToSelected(value: ITablaDefinidaUsuarioSap) {
    this.setClearFiltro();
    this.modeloFormVisor.patchValue({
      'fullDescr': `${value.fullDescr}`
    });
    this.isVisualizar = false;
    this.eventoAceptar.emit(value);
  }

  onVisible()
  {
    this.list = [];
    this.isVisualizar = true;
  }

  private setClearFiltro() {
    this.modeloFormBusqueda.patchValue({
      'text1': ''
    });
    this.list = [];
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
