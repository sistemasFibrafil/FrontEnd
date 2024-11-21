import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { ISerieNumeracionSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/inicializacion-sistema/serie-numeracion-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { SerieNumeracionSapService } from 'src/app/modulos/modulo-gestion/services/sap/inicializacion-sistema/serie-numeracion-sap.service';



@Component({
  selector: 'app-busqueda-serie-numeracion-sap',
  templateUrl: './busqueda-serie-numeracion-sap.component.html'
})
export class BusquedaSerieNumeracionSapComponent implements OnInit {
  modeloFormBusqueda: FormGroup;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();


  isDisplay: Boolean = false;
  isVisualizar: Boolean = false;

  columnas: any[];
  list: ISerieNumeracionSap[] = [];
  params: FilterRequestModel = new FilterRequestModel();

  @Output() eventoAceptar = new EventEmitter<ISerieNumeracionSap>();
  @Output() eventoCancelar = new EventEmitter<ISerieNumeracionSap>();
  @Output() eventoLimpiar = new EventEmitter<boolean>();

  constructor
  (
    private readonly fb: FormBuilder,
    private readonly swaCustomService: SwaCustomService,
    private serieNumeracionSapService: SerieNumeracionSapService
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
      { field: 'code',              header: 'Código' },
      { field: 'tipDocumento',      header: 'Tipo de documento' },
      { field: 'serDocumento',      header: 'Serie de documento' },
      { field: 'numDocumento',      header: 'Número de documento' },
      { field: 'maxNumDocumento',   header: 'Máximo número habilitado' },
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
    this.serieNumeracionSapService.getListByFiltro(this.params)
    .subscribe({next:(data: ISerieNumeracionSap[]) =>{
      this.list = data;
      this.isDisplay = false;
    },error:(e)=>{
      this.isDisplay = false;
      this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
     }
    });
  }

  onToSelected(value: ISerieNumeracionSap) {
    this.isVisualizar = false;
    this.eventoAceptar.emit(value);
  }

  onClickClose()
  {
    this.isVisualizar = false;
  }
}
