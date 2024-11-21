import swal from 'sweetalert2';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { IFormulario } from 'src/app/modulos/modulo-gestion/interfaces/web/inicializacion-sistema/formulario.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { FormularioService } from 'src/app/modulos/modulo-gestion/services/web/inicializacion-sistema/formulario.service';



@Component({
  selector: 'app-busqueda-formulario',
  templateUrl: './busqueda-formulario.component.html'
})
export class BusquedaFormularioComponent implements OnInit {
  modeloFormBusqueda: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  isDisplay: Boolean = false;

  columnas: any[];
  list: IFormulario[] = [];
  params: FilterRequestModel = new FilterRequestModel();

  @Output() eventoAceptar = new EventEmitter<IFormulario>();
  @Output() eventoCancelar = new EventEmitter<IFormulario>();
  @Output() eventoLimpiar = new EventEmitter<boolean>();


  constructor
  (
    private readonly fb: FormBuilder,
    private formularioService: FormularioService
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
      { field: 'codFormulario',   header: 'Código' },
      { field: 'nomFormulario',   header: 'Nombre' },
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
    this.formularioService.getListByFiltro(this.params)
    .subscribe({next:(data: IFormulario[]) =>{
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

  onToSelected(value: IFormulario) {
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
