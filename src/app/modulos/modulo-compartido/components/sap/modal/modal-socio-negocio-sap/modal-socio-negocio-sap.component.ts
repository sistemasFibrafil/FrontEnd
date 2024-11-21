import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { ISocioNegocio } from 'src/app/modulos/modulo-socio-negocios/interfaces/socio-segocio.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { SocioNegocioSapService } from 'src/app/modulos/modulo-socio-negocios/services/socio-negocios.service';



@Component({
  selector: 'app-modal-socio-negocio-sap',
  templateUrl: './modal-socio-negocio-sap.component.html'
})
export class ModalSocioNegocioSapComponent implements OnInit, OnChanges {
  modeloFormVisor: FormGroup;
  modeloFormBusqueda: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  isDisplay: Boolean = false;
  isVisualizar: Boolean = false;

  columnas: any[];
  list: ISocioNegocio[] = [];
  params: FilterRequestModel = new FilterRequestModel();

  @Input() title: string;
  @Input() cardCode: string;
  @Input() cardType: string;
  @Input() transType: string;
  @Input() isHabilitaControl: boolean;
  @Input() isHabilitarButton: boolean;
  @Input() isVisibleLimpiar: boolean = false;

  @Output() eventoAceptar = new EventEmitter<ISocioNegocio>();
  @Output() eventoCancelar = new EventEmitter<ISocioNegocio>();
  @Output() eventoLimpiar = new EventEmitter<boolean>();

  constructor
  (
    private readonly fb: FormBuilder,
    private socioNegocioSapService: SocioNegocioSapService
  ) { }

  ngOnChanges(changes: SimpleChanges): void{
    if (this.cardCode === undefined || this.cardCode === null || this.cardCode.trim() === '') {
      return;
    }

    this.modeloFormVisor.patchValue({
      'cardCode': this.cardCode
    });

    this.modeloFormBusqueda.patchValue({
      'text1': ''
    });
  }

  ngOnInit(): void {
    this.buildFormVisor();
    this.buildFormBusqueda();
    this.onBuildColum();
  }

  private buildFormVisor() {
    this.modeloFormVisor = this.fb.group({
      'cardCode': new FormControl({ value: '', disabled: true }),
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
      { field: 'cardCode', header: 'Código' },
      { field: 'licTradNum', header: 'Número de documento' },
      { field: 'cardName', header: 'Nombre' },
    ];
  }

  getParams()
  {
    this.params = this.modeloFormBusqueda.getRawValue();
    this.params.cod1 = this.cardType;
    this.params.cod2 = this.transType;
  }

  onToBuscar() {
    this.isDisplay = true;
    this.list = [];
    this.getParams();
    this.socioNegocioSapService.getListByFiltro(this.params)
    .subscribe({next:(data: ISocioNegocio[]) =>{
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

  onToSelected(value: ISocioNegocio) {
    this.setClearFiltro();
    this.modeloFormVisor.patchValue({
      'cardCode': value.cardCode
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
