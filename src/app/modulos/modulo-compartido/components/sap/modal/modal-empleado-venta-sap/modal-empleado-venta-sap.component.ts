import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { IEmpleadoVentaSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/general/empleado-venta.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { EmpleadoVentaSapService } from 'src/app/modulos/modulo-gestion/services/sap/definiciones/general/empleado-venta-sap.service';



@Component({
  selector: 'app-modal-empleado-venta-sap',
  templateUrl: './modal-empleado-venta-sap.component.html'
})
export class ModalEmpleadoVentaSapComponent implements OnInit, OnChanges {
  modeloFormVisor: FormGroup;
  modeloFormBusqueda: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  isDisplay: Boolean = false;
  isVisualizar: Boolean = false;

  columnas: any[];
  list: IEmpleadoVentaSap[] = [];
  params: FilterRequestModel = new FilterRequestModel();

  @Input() slpCode: number;
  @Input() isHabilitaControl: boolean;
  @Input() isHabilitarButton: boolean;
  @Input() isVisibleLimpiar: boolean = false;

  @Output() eventoAceptar = new EventEmitter<IEmpleadoVentaSap>();
  @Output() eventoCancelar = new EventEmitter<IEmpleadoVentaSap>();
  @Output() eventoLimpiar = new EventEmitter<boolean>();

  constructor
  (
    private readonly fb: FormBuilder,
    private empleadoVentaSapService: EmpleadoVentaSapService
  ) { }

  ngOnChanges(changes: SimpleChanges): void{
    if(this.modeloFormVisor !== undefined)
    {
      this.modeloFormVisor.patchValue({
        'slpName': ''
      });
    }
    if(this.modeloFormBusqueda !== undefined)
    {
      this.modeloFormBusqueda.patchValue({
        'text1': ''
      });
    }

    if (this.slpCode === undefined || this.slpCode === null || this.slpCode === 0) {
      return;
    }

    this.getByCode(this.slpCode);
  }

  ngOnInit(): void {
    this.buildFormVisor();
    this.buildFormBusqueda();
    this.onBuildColum();
  }

  private buildFormVisor() {
    this.modeloFormVisor = this.fb.group({
      'slpName' : new FormControl({ value: '', disabled: true }),
    });
  }

  private buildFormBusqueda() {
    this.modeloFormBusqueda = this.fb.group({
      'text1' : new FormControl(''),
    });
  }

  onBuildColum() {
    this.columnas =
    [
      { field: 'slpCode', header: 'Código' },
      { field: 'slpName', header: 'Nombre' }
    ];
  }

  getParams()
  {
    this.params = this.modeloFormBusqueda.getRawValue();
  }

  onToBuscar() {
    this.isDisplay = true;
    this.list = [];
    this.getParams();
    this.empleadoVentaSapService.getListByFiltro(this.params)
    .subscribe({next:(data: IEmpleadoVentaSap[]) =>{
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

  getByCode(slpCode: number) {
    this.empleadoVentaSapService.getByCode(slpCode)
    .subscribe({next:(value: IEmpleadoVentaSap) =>{
        this.modeloFormVisor.patchValue({
          'slpName': value.slpName
        });
        this.eventoAceptar.emit(value);
      },error:(e)=>{
        let swalWithBootstrapButtons = Swal.mixin({ customClass: { container: 'my-swal' }, target: document.getElementById('modal') });
        swalWithBootstrapButtons.fire(this.globalConstants.msgInfoSummary, e.error.resultadoDescripcion, 'error');
      }
    });
  }

  onToSelected(value: IEmpleadoVentaSap) {
    this.setClearFiltro();
    this.modeloFormVisor.patchValue({
      'slpName': value.slpName
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
