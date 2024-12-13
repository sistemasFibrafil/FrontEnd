import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { ITipoOperacionSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/general/tipo-operacion-interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { TipoOperacionSapService } from 'src/app/modulos/modulo-gestion/services/sap/definiciones/general/tipo-operacion-sap.service';



@Component({
  selector: 'app-busqueda-tipo-operacion-sap',
  templateUrl: './busqueda-tipo-operacion-sap.component.html'
})
export class BusquedaTipoOperacionSapComponent implements OnInit {
  modeloFormBusqueda: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  isDisplay: Boolean = false;

  columnas: any[];
  list: ITipoOperacionSap[] = [];
  params: FilterRequestModel = new FilterRequestModel();

  @Input() title: string;
  @Input() nomTabla: string;
  @Input() nomCampo: string;
  @Input() fldValue: string;
  @Input() placeholder: string;
  @Input() isHabilitaControl: boolean;
  @Input() isHabilitarButton: boolean;
  @Input() isVisibleLimpiar: boolean = false;

  @Output() eventoAceptar = new EventEmitter<ITipoOperacionSap>();
  @Output() eventoCancelar = new EventEmitter<ITipoOperacionSap>();
  @Output() eventoLimpiar = new EventEmitter<boolean>();

  constructor
  (
    private readonly fb: FormBuilder,
    private tipoOperacionSapService: TipoOperacionSapService,
  ) { }

  ngOnInit(): void {
    this.buildFormBusqueda();
    this.onBuildColum();
  }

  private buildFormBusqueda() {
    this.modeloFormBusqueda = this.fb.group({
      'text1': new FormControl(''),
    });
  }

  onBuildColum() {
    this.columnas =
    [
      { field: 'codd',    header: 'Código' },
      { field: 'name',    header: 'Nombre' },
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
    this.tipoOperacionSapService.getListByFiltro(this.params)
    .subscribe({next:(data: ITipoOperacionSap[]) =>{
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

  onToSelected(value: ITipoOperacionSap) {
    this.setClearFiltro();
    this.eventoAceptar.emit(value);
  }

  private setClearFiltro() {
    this.modeloFormBusqueda.patchValue({
      'text1': ''
    });
    this.list = [];
  }
}
