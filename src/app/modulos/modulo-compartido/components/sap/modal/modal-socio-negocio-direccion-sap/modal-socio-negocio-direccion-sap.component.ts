import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { IDireccionSap } from 'src/app/modulos/modulo-socio-negocios/interfaces/direccion.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { DireccionSapService } from 'src/app/modulos/modulo-socio-negocios/services/direccion.service';



@Component({
  selector: 'app-modal-socio-negocio-direccion-sap',
  templateUrl: './modal-socio-negocio-direccion-sap.component.html'
})
export class ModalDireccionSocioNegocioSapComponent implements OnInit, OnChanges {
  modeloFormVisor: FormGroup;
  modeloFormBusqueda: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  isDisplay: Boolean = false;
  isVisualizar: Boolean = false;

  columnas: any[];
  list: IDireccionSap[] = [];
  params: FilterRequestModel = new FilterRequestModel();

  @Input() cardCode: string;
  @Input() address: string;
  @Input() adresType: string;
  @Input() isHabilitaControl: boolean;
  @Input() isHabilitarButton: boolean;
  @Input() isVisibleLimpiar: boolean = false;

  @Output() eventoAceptar = new EventEmitter<IDireccionSap>();
  @Output() eventoCancelar = new EventEmitter<IDireccionSap>();
  @Output() eventoLimpiar = new EventEmitter<boolean>();

  constructor
  (
    private readonly fb: FormBuilder,
    private direccionSapService: DireccionSapService
  ) { }

  ngOnChanges(changes: SimpleChanges): void{
    if(this.modeloFormVisor !== undefined)
    {
      this.modeloFormVisor.patchValue({
        'address': ''
      });
    }
    if(this.modeloFormBusqueda !== undefined)
    {
      this.modeloFormBusqueda.patchValue({
        'text1': ''
      });
    }
    if (this.address === undefined || this.address === null || this.address.trim() === '') {
      return;
    }

    this.modeloFormVisor.patchValue({
      'address': this.address
    });
  }

  ngOnInit(): void {
    this.buildFormVisor();
    this.buildFormBusqueda();
    this.onBuildColum();
  }

  private buildFormVisor() {
    this.modeloFormVisor = this.fb.group({
      'address': new FormControl({ value: '', disabled: false }),
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
      { field: 'address', header: 'Código' },
      { field: 'street', header: 'Dirección' },
      { field: 'glblLocNum', header: 'Ubigeo' },
    ];
  }

  getParams()
  {
    this.params = this.modeloFormBusqueda.getRawValue();
    this.params.cod1 = this.cardCode;
    this.params.cod2 = this.adresType;
    this.params.cod3 = this.address;
  }

  onToBuscar() {
    this.isDisplay = true;
    this.list = [];
    this.getParams();
    this.direccionSapService.getListByFiltro(this.params)
    .subscribe({next:(data: IDireccionSap[]) =>{
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

  onToSelected(value: IDireccionSap) {
    this.setClearFiltro();
    this.modeloFormVisor.patchValue({
      'address': value.address
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
