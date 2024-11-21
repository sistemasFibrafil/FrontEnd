import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';
import { UserContextService } from 'src/app/services/user-context.service';

import { ITipoDocumento } from 'src/app/modulos/modulo-gestion/interfaces/web/inicializacion-sistema/tipo-documento.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { TipoDocumentoService } from 'src/app/modulos/modulo-gestion/services/web/inicializacion-sistema/tipo-documento.service';



@Component({
  selector: 'app-modal-tipo-documento',
  templateUrl: './modal-tipo-documento.component.html'
})
export class ModalTipoDocumentoComponent implements OnInit, OnChanges {
  modeloFormVisor: FormGroup;
  modeloFormBusqueda: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  isDisplay: Boolean = false;
  isVisualizar: Boolean = false;

  columnas: any[];
  list: ITipoDocumento[] = [];
  params: FilterRequestModel = new FilterRequestModel();

  @Input() codSede: number = 0;
  @Input() codFormulario: number = 0;
  @Input() codTipoDocumento: string;
  @Input() isHabilitaControl: boolean;
  @Input() isHabilitarButton: boolean;
  @Input() isVisibleLimpiar: boolean = false;

  @Output() eventoAceptar = new EventEmitter<ITipoDocumento>();
  @Output() eventoCancelar = new EventEmitter<ITipoDocumento>();
  @Output() eventoLimpiar = new EventEmitter<boolean>();

  constructor
  (
    private readonly fb: FormBuilder,
    private userContextService: UserContextService,
    private tipoDocumentoService: TipoDocumentoService
  ) { }

  ngOnChanges(changes: SimpleChanges): void{
    if(this.modeloFormVisor !== undefined)
    {
      this.modeloFormVisor.patchValue({
        'codTipoDocumento': ''
      });
    }
    if(this.modeloFormBusqueda !== undefined)
    {
      this.modeloFormBusqueda.patchValue({
        'text1': ''
      });
    }

    if (this.codTipoDocumento === undefined || this.codTipoDocumento === null || this.codTipoDocumento.trim() === '') {
      return;
    }

    this.modeloFormVisor.patchValue({
      'codTipoDocumento': this.codTipoDocumento
    });
  }

  ngOnInit(): void {
    this.buildFormVisor();
    this.buildFormBusqueda();
    this.onBuildColum();
  }

  private buildFormVisor() {
    this.modeloFormVisor = this.fb.group({
      'codTipoDocumento' : new FormControl({ value: '', disabled: true }),
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
      { field: 'codTipoDocumento', header: 'Código' },
      { field: 'desTipoDocumento', header: 'Descripción' },
    ];
  }

  getParams()
  {
    this.params = this.modeloFormBusqueda.getRawValue();
    this.params.id1 = this.codSede;
    this.params.id2 = this.codFormulario;
  }

  onToBuscar() {
    this.isDisplay = true;
    this.list = [];
    this.getParams();
    this.tipoDocumentoService.getListByFiltro(this.params)
    .subscribe({next:(data: ITipoDocumento[]) =>{
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

  onToSelected(value: ITipoDocumento) {
    debugger
    this.setClearFiltro();
    this.modeloFormVisor.patchValue({
      'codTipoDocumento': value.codTipoDocumento
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
