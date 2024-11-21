import swal from 'sweetalert2';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { ISedeSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/inventario/sede-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { SedeSapService } from 'src/app/modulos/modulo-gestion/services/sap/definiciones/inventario/sede-sap.service';



@Component({
  selector: 'app-busqueda-sede-sap',
  templateUrl: './busqueda-sede-sap.component.html'
})
export class BusquedaSedeSapComponent implements OnInit {
  modeloFormBusqueda: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  isDisplay: Boolean = false;

  columnas: any[];
  list: ISedeSap[] = [];
  params: FilterRequestModel = new FilterRequestModel();

  @Output() eventoAceptar = new EventEmitter<ISedeSap>();
  @Output() eventoCancelar = new EventEmitter<ISedeSap>();
  @Output() eventoLimpiar = new EventEmitter<boolean>();


  constructor
  (
    private readonly fb: FormBuilder,
    private readonly swaCustomService: SwaCustomService,
    private sedeSapService: SedeSapService
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
      { field: 'code',      header: 'Código' },
      { field: 'location',  header: 'Nombre' },
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
    this.sedeSapService.getListByFiltro(this.params)
    .subscribe({next:(data: ISedeSap[]) =>{
        this.isDisplay = false;
        this.list = data;
      },error:(e)=>{
        this.list = [];
        this.isDisplay = false;
        let swalWithBootstrapButtons = swal.mixin({ customClass: { container: 'my-swal' }, target: document.getElementById('modal') });
        swalWithBootstrapButtons.fire(this.globalConstants.msgInfoSummary, e.error.resultadoDescripcion, 'error');
      }
    });
  }

  onToSelected(value: ISedeSap) {
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
