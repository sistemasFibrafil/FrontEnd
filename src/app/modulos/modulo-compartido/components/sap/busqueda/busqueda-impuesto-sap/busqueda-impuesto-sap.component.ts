import swal from 'sweetalert2';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { IImpuestoSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/finanzas/impuesto-sap.iterface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { ImpuestoSapService } from 'src/app/modulos/modulo-gestion/services/sap/definiciones/finanzas/impuesto-sap.service';



@Component({
  selector: 'app-busqueda-impuesto-sap',
  templateUrl: './busqueda-impuesto-sap.component.html'
})
export class BusquedaImpuestoSapComponent implements OnInit {
  modeloFormBusqueda: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  isDisplay: Boolean = false;

  columnas: any[];
  list: IImpuestoSap[] = [];
  params: FilterRequestModel = new FilterRequestModel();

  @Input() artInv: string;
  @Input() artVen: string;
  @Input() artCom: string;

  @Output() eventoAceptar = new EventEmitter<IImpuestoSap>();
  @Output() eventoCancelar = new EventEmitter<IImpuestoSap>();
  @Output() eventoLimpiar = new EventEmitter<boolean>();


  constructor
  (
    private readonly fb: FormBuilder,
    private readonly swaCustomService: SwaCustomService,
    private impuestoSapService: ImpuestoSapService
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
      { field: 'code',    header: 'Código' },
      { field: 'name',    header: 'Nombre' },
      { field: 'rate',    header: 'Tasa' }
    ];
  }

  getParams()
  {
    this.params = this.modeloFormBusqueda.getRawValue();
    this.params.cod1 = this.artInv;
    this.params.cod2 = this.artVen;
    this.params.cod3 = this.artCom;
  }

  onToBuscar() {
    this.isDisplay = true;
    this.list = [];
    this.getParams();
    this.impuestoSapService.getListByFiltro(this.params)
    .subscribe({next:(data: IImpuestoSap[]) =>{
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

  onToSelected(value: IImpuestoSap) {
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
