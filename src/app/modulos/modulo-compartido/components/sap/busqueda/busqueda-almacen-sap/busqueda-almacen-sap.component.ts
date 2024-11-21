import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { IAlmacenSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/inventario/almacen-sap.interface';
import { AlmacenService } from 'src/app/modulos/modulo-gestion/services/sap/definiciones/inventario/almacen-sap.service';
import { FilterRequestModel } from 'src/app/models/filter-request.model';



@Component({
  selector: 'app-busqueda-almacen-sap',
  templateUrl: './busqueda-almacen-sap.component.html'
})
export class BusquedaAlmacenSapComponent implements OnInit, OnChanges {
  modeloFormBusqueda: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  isDisplay: Boolean = false;

  columnas: any[];
  lista: IAlmacenSap[] = [];
  params: FilterRequestModel = new FilterRequestModel();

  @Input() demandante: string;
  @Input() itemCode: string;
  @Input() inactive: string;

  @Output() eventoAceptar = new EventEmitter<IAlmacenSap>();
  @Output() eventoCancelar = new EventEmitter<IAlmacenSap>();
  @Output() eventoLimpiar = new EventEmitter<boolean>();

  constructor
  (
    private readonly fb: FormBuilder,
    private almacenService: AlmacenService
  ) { }

  ngOnChanges(changes: SimpleChanges): void{
  }

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
      { field: 'whsCode', header: 'Código' },
      { field: 'whsName', header: 'Nombre' },
      { field: 'onHand', header: 'Stock' },
    ];
  }

  getParams()
  {this.params = this.modeloFormBusqueda.getRawValue();
    this.params.cod1 = this.demandante;
    this.params.cod2 = this.itemCode;
    this.params.cod3 = this.inactive;
  }

  onToBuscar() {
    this.isDisplay = true;
    this.lista = [];
    this.getParams();
    this.almacenService.getListByFiltro(this.params)
    .subscribe({next:(data: IAlmacenSap[]) =>{
        this.isDisplay = false;
        this.lista = data;
      },error:(e)=>{
        this.lista = [];
        this.isDisplay = false;
        let swalWithBootstrapButtons = Swal.mixin({ customClass: { container: 'my-swal' }, target: document.getElementById('modal') });
        swalWithBootstrapButtons.fire(this.globalConstants.msgInfoSummary, e.error.resultadoDescripcion, 'error');
      }
    });
  }

  onToSelected(value: IAlmacenSap) {
    this.setClearFiltro();
    this.eventoAceptar.emit(value);
  }

  private setClearFiltro() {
    this.modeloFormBusqueda.patchValue({
      'text1': ''
    });
    this.lista = [];
  }
}
