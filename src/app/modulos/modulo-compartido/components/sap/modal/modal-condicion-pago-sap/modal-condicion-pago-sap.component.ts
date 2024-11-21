import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { ICondicionPagoSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/socio-negocios/condicion-pago-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { CondicionPagoSapService } from 'src/app/modulos/modulo-gestion/services/sap/definiciones/socio-negocios/condicion-pago-sap.service';



@Component({
  selector: 'app-modal-condicion-pago-sap',
  templateUrl: './modal-condicion-pago-sap.component.html'
})
export class ModalCondicionPagSapComponent implements OnInit, OnChanges {
  modeloFormVisor: FormGroup;
  modeloFormBusqueda: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  isDisplay: Boolean = false;
  isVisualizar: Boolean = false;

  columnas: any[];
  lista: ICondicionPagoSap[] = [];
  params: FilterRequestModel = new FilterRequestModel();

  @Input() groupNum: number;
  @Input() isHabilitaControl: boolean;
  @Input() isHabilitarButton: boolean;
  @Input() isVisibleLimpiar: boolean = false;

  @Output() eventoAceptar = new EventEmitter<ICondicionPagoSap>();
  @Output() eventoCancelar = new EventEmitter<ICondicionPagoSap>();
  @Output() eventoLimpiar = new EventEmitter<boolean>();

  constructor
  (
    private readonly fb: FormBuilder,
    private condicionPagoSapService: CondicionPagoSapService
  ) { }

  ngOnChanges(changes: SimpleChanges): void{
    if (this.groupNum === undefined || this.groupNum === null || this.groupNum === 0) {
      return;
    }

    this.getByCode(this.groupNum);
  }

  ngOnInit(): void {
    this.buildFormVisor();
    this.buildFormBusqueda();
    this.onBuildColum();
  }

  private buildFormVisor() {
    this.modeloFormVisor = this.fb.group({
      'condicionPago' : new FormControl({ value: '', disabled: false }),
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
      { field: 'groupNum',    header: 'Código' },
      { field: 'pymntGroup',  header: 'Nombre' }
    ];
  }

  getParams()
  {
    this.params = this.modeloFormBusqueda.getRawValue();
  }

  onToBuscar() {
    this.isDisplay = true;
    this.lista = [];
    this.getParams();
    this.condicionPagoSapService.getListByFiltro(this.params)
    .subscribe({next:(data: ICondicionPagoSap[]) =>{
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

  getByCode(groupNum: number) {
    this.condicionPagoSapService.getById(groupNum)
    .subscribe({next:(value: ICondicionPagoSap) =>{
        this.modeloFormVisor.patchValue({
          'condicionPago': value.pymntGroup
        });
        this.eventoAceptar.emit(value);
      },error:(e)=>{
        let swalWithBootstrapButtons = Swal.mixin({ customClass: { container: 'my-swal' }, target: document.getElementById('modal') });
        swalWithBootstrapButtons.fire(this.globalConstants.msgInfoSummary, e.error.resultadoDescripcion, 'error');
      }
    });
  }

  onToSelected(value: ICondicionPagoSap) {
    this.setClearFiltro();
    this.modeloFormVisor.patchValue({
      'condicionPago': value.pymntGroup
    });
    this.isVisualizar = false;
    this.eventoAceptar.emit(value);
  }

  private setClearFiltro() {
    this.modeloFormBusqueda.patchValue({
      'text1': ''
    });
    this.lista = [];
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
