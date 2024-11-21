import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';
import { UserContextService } from 'src/app/services/user-context.service';

import { ITipoDocumento } from 'src/app/modulos/modulo-gestion/interfaces/web/inicializacion-sistema/tipo-documento.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { TipoDocumentoService } from 'src/app/modulos/modulo-gestion/services/web/inicializacion-sistema/tipo-documento.service';
import { SerieNumeracionService } from 'src/app/modulos/modulo-gestion/services/web/inicializacion-sistema/serie-numeracion.service';
import { ISerieNumeracion } from 'src/app/modulos/modulo-gestion/interfaces/web/inicializacion-sistema/serie-numeracion.interface';



@Component({
  selector: 'app-modal-serie-documento',
  templateUrl: './modal-serie-documento.component.html'
})
export class ModalSerieDocumentoComponent implements OnInit, OnChanges {
  modeloFormVisor: FormGroup;
  modeloFormBusqueda: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  isDisplay: Boolean = false;
  isVisualizar: Boolean = false;

  columnas: any[];
  list: ISerieNumeracion[] = [];
  params: FilterRequestModel = new FilterRequestModel();

  @Input() codSede: number = 0;
  @Input() codFormulario: number = 0;
  @Input() tipDocumento: string;
  @Input() serDocumento: string;
  @Input() isHabilitaControl: boolean;
  @Input() isHabilitarButton: boolean;
  @Input() isVisibleLimpiar: boolean = false;

  @Output() eventoAceptar = new EventEmitter<ISerieNumeracion>();
  @Output() eventoCancelar = new EventEmitter<ISerieNumeracion>();
  @Output() eventoLimpiar = new EventEmitter<boolean>();

  constructor
  (
    private readonly fb: FormBuilder,
    private serieNumeracionService: SerieNumeracionService
  ) { }

  ngOnChanges(changes: SimpleChanges): void{
    if(this.modeloFormVisor !== undefined)
    {
      this.modeloFormVisor.patchValue({
        'serDocumento': ''
      });
    }
    if(this.modeloFormBusqueda !== undefined)
    {
      this.modeloFormBusqueda.patchValue({
        'text1': ''
      });
    }

    if (this.serDocumento === undefined || this.serDocumento === null || this.serDocumento.trim() === '') {
      return;
    }

    this.modeloFormVisor.patchValue({
      'serDocumento': this.serDocumento
    });
  }

  ngOnInit(): void {
    this.buildFormVisor();
    this.buildFormBusqueda();
    this.onBuildColum();
  }

  private buildFormVisor() {
    this.modeloFormVisor = this.fb.group({
      'serDocumento' : new FormControl({ value: '', disabled: true }),
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
      { field: 'tipDocumento', header: 'Tipo de documento' },
      { field: 'serDocumento', header: 'Serie de documento' },
      { field: 'NumDocumento', header: 'Número de documento' },
    ];
  }

  getParams()
  {
    this.params = this.modeloFormBusqueda.getRawValue();
    this.params.id1 = this.codSede;
    this.params.id2 = this.codFormulario;
    this.params.cod1 = this.tipDocumento;
  }

  onToBuscar() {
    this.isDisplay = true;
    this.list = [];
    this.getParams();
    this.serieNumeracionService.getListByFiltro(this.params)
    .subscribe({next:(data: ISerieNumeracion[]) =>{
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

  onToSelected(value: ISerieNumeracion) {
    debugger
    this.setClearFiltro();
    this.modeloFormVisor.patchValue({
      'serDocumento': value.serDocumento
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
