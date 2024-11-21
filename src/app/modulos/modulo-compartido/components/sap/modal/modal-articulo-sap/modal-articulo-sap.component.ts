import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { IArticuloSap } from 'src/app/modulos/modulo-inventario/interfaces/articulo-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { ArticuloSapService } from 'src/app/modulos/modulo-inventario/services/sap/articulo-sap.service';



@Component({
  selector: 'app-modal-articulo-sap',
  templateUrl: './modal-articulo-sap.component.html'
})
export class ModalArticuloSapComponent implements OnInit, OnChanges {
  modeloFormVisor: FormGroup;
  modeloFormBusqueda: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  isDisplay: Boolean = false;
  isVisualizar: Boolean = false;

  columnas: any[];
  list: IArticuloSap[] = [];
  params: FilterRequestModel = new FilterRequestModel();

  @Input() artInv: string;
  @Input() artVen: string;
  @Input() artCom: string;
  @Input() itemCode: string;
  @Input() isHabilitaControl: boolean;
  @Input() isHabilitarButton: boolean;
  @Input() isVisibleLimpiar: boolean = false;

  @Output() eventoAceptar = new EventEmitter<IArticuloSap>();
  @Output() eventoCancelar = new EventEmitter<IArticuloSap>();
  @Output() eventoLimpiar = new EventEmitter<boolean>();

  constructor
  (
    private readonly fb: FormBuilder,
    private articuloSapService: ArticuloSapService
  ) { }

  ngOnChanges(changes: SimpleChanges): void{
    if (this.itemCode === undefined || this.itemCode === null || this.itemCode.trim() === '') {
      return;
    }

    this.modeloFormVisor.patchValue({
      'itemCode': this.itemCode
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
      'itemCode' : new FormControl({ value: '', disabled: true }),
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
      { field: 'itemCode', header: 'Código' },
      { field: 'itemName', header: 'Nombre' },
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
        let swalWithBootstrapButtons = Swal.mixin({ customClass: { container: 'my-swal' }, target: document.getElementById('modal') });
        swalWithBootstrapButtons.fire(this.globalConstants.msgInfoSummary, e.error.resultadoDescripcion, 'error');
      }
    });
  }

  onToSelected(value: IArticuloSap) {
    this.setClearFiltro();
    this.modeloFormVisor.patchValue({
      'itemCode': value.itemCode
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
