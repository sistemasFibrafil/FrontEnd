import swal from 'sweetalert2';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { IArticuloSap } from 'src/app/modulos/modulo-inventario/interfaces/articulo-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { ArticuloSapService } from 'src/app/modulos/modulo-inventario/services/sap/articulo-sap.service';



@Component({
  selector: 'app-busqueda-articulo-sap',
  templateUrl: './busqueda-articulo-sap.component.html'
})
export class BusquedaArticuloSapComponent implements OnInit {
  modeloFormBusqueda: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  isDisplay: Boolean = false;

  columnas: any[];
  list: IArticuloSap[] = [];
  params: FilterRequestModel = new FilterRequestModel();

  @Input() artInv: string;
  @Input() artVen: string;
  @Input() artCom: string;

  @Output() eventoAceptar = new EventEmitter<IArticuloSap>();
  @Output() eventoCancelar = new EventEmitter<IArticuloSap>();
  @Output() eventoLimpiar = new EventEmitter<boolean>();

  constructor
  (
    private readonly fb: FormBuilder,
    private readonly swaCustomService: SwaCustomService,
    private articuloSapService: ArticuloSapService
  ) { }

  ngOnInit(): void {
    this.buildFormBusqueda();
    this.onBuildColum();
  }

  private buildFormBusqueda() {
    this.modeloFormBusqueda = this.fb.group({
      'text1' : new FormControl(''),
    });
  }

  onBuildColum() {
    this.columnas =
    [
      { field: 'itemCode', header: 'Código' },
      { field: 'itemName', header: 'Descripción' },
      { field: 'onHand', header: 'Stock' },
      { field: 'statusName', header: 'Estado' },
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
    this.articuloSapService.getListByFiltro(this.params)
    .subscribe({next:(data: IArticuloSap[]) =>{
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

  onToSelected(value: IArticuloSap) {
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
