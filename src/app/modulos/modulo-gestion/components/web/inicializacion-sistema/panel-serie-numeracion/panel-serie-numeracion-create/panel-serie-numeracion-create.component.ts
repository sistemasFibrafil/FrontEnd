import { MenuItem, SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { UserContextService } from 'src/app/services/user-context.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';

import { ISede } from 'src/app/modulos/modulo-gestion/interfaces/web/definiciones/inventario/sede.interface';
import { IFormulario } from 'src/app/modulos/modulo-gestion/interfaces/web/inicializacion-sistema/formulario.interface';
import { ISerieNumeracion } from 'src/app/modulos/modulo-gestion/interfaces/web/inicializacion-sistema/serie-numeracion.interface';
import { ISerieNumeracionSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/inicializacion-sistema/serie-numeracion-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { SerieNumeracionModel } from 'src/app/modulos/modulo-gestion/models/web/inicializacion-sistema/serie-numero.model';
import { SedeService } from 'src/app/modulos/modulo-gestion/services/web/definiciones/sede/sede.service';
import { SerieNumeracionService } from 'src/app/modulos/modulo-gestion/services/web/inicializacion-sistema/serie-numeracion.service';



@Component({
  selector: 'app-ges-panel-serie-numeracion-create',
  templateUrl: './panel-serie-numeracion-create.component.html',
  styleUrls: ['./panel-serie-numeracion-create.component.css']
})
export class PanelSerieNumeracionCreateComponent implements OnInit {
  modeloForm: FormGroup;
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  // Titulo del componente
  titulo = 'Serie - Numeración';

  isSaving: boolean = false;
  isDisplay: Boolean = false;
  isVisualizarFormulario: Boolean = false;
  isVisualizarSerieNumeracion: Boolean = false;

  indexFormulario: number;
  indexSerieNumeracion: number;

  columnas: any[];
  items: MenuItem[];
  listSede: SelectItem[];
  listSerieNumeracion: ISerieNumeracion[] = [];
  listSerieNumeracionDelete: ISerieNumeracion[] = [];
  serieNumeracionSelected: ISerieNumeracion;
  params: FilterRequestModel = new FilterRequestModel();
  modeloSave: SerieNumeracionModel = new SerieNumeracionModel();

  constructor
  (
    private router: Router,
    private fb: FormBuilder,
    private sedeService: SedeService,
    private userContextService: UserContextService,
    private serieNumeracionService: SerieNumeracionService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
  ) {}

  ngOnInit() {
    this.onBuildForm();
    this.onBuildColumn()
    this.getListSede();
    this.getListContextMenu();
    this.onListar();

    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-ges-panel-sede-create');
  }

  onBuildForm() {
    this.modeloForm = this.fb.group(
    {
      'sede'   : new FormControl('', Validators.compose([Validators.required])),
    });
  }

  onBuildColumn() {
    this.columnas =
    [
      { field: 'code',            header: 'Código' },
      { field: 'tipDoc',          header: 'Tipo de documento' },
      { field: 'serDoc',          header: 'Serie de documento' },
      { field: 'numDoc',          header: 'Número de documento' },
      { field: 'maxNumDoc',       header: 'Máximo número habilitado' },
      { field: 'nomFormulario',   header: 'Formulario' },
    ];
  }

  getListContextMenu() {
    this.items =
    [
      {label: 'Añadir línea', icon: 'pi pi-plus',   command: () => this.addLine() },
      {label: 'Borrar línea', icon: 'pi pi-trash',  command: () => this.delete(this.serieNumeracionSelected) }
    ];
  }

  getListSede() {
    this.listSede = [];
    const param: any = { text1: '' };
    this.sedeService.getListByFiltro(param)
    .subscribe({next:(data: ISede[]) =>{
        this.listSede = [];
        for (let item of data) {
          this.listSede.push({ label: item.nomSede, value: item.codSede });
        }
      },error:(e)=>{
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  getParams()
  {
    let codSede: number = 0;
    this.params = this.modeloForm.getRawValue();
    if (this.modeloForm.controls['sede'].value) {
      let itemSede = this.modeloForm.controls['sede'].value;
      codSede = Number(itemSede.value);
    }
    this.params.id1 = codSede;
    this.params.id2 = 0;
  }

  onListar() {
    this.isDisplay = true;
    this.listSerieNumeracion = [];
    this.getParams();
    this.serieNumeracionService.getListByFiltro(this.params)
    .subscribe({next:(data: ISerieNumeracion[]) =>{
        this.listSerieNumeracion = data;
        if(this.listSerieNumeracion.length === 0)
        {
          this.addLine();
        }
        this.isDisplay = false;
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onChangeSede()
  {
    this.onListar();
  }

  addLine()
  {
    let exiete: boolean = false;
    this.listSerieNumeracion.forEach(item=>{
      if(item.codSerieNumeracion === ''){
        exiete = true;
        return;
      }
    });

    if(!exiete || this.listSerieNumeracion.length === 0)
    {
      this.listSerieNumeracion.push({ codSerieNumeracion: '', tipDocumento: '', serDocumento: '', numDocumento: '', maxNumDocumento: '', codSede: null, codFormulario: null, nomFormulario: '' , record: 1 });
    }
  }

  delete(value: ISerieNumeracion)
  {
    if(value.record == 2)
    {
      // Se define como eliminado con "record = 3" caundo el registro se encuentra en la DB
      value.record = 3;
      this.listSerieNumeracionDelete.push(value);
    }
    let index = this.listSerieNumeracion.indexOf(value);
    this.listSerieNumeracion.splice(+index, 1);

    if(this.listSerieNumeracion.length === 0)
    {
      this.addLine();
    }
  }

  onClickSerieNumeracionOpen(index: number)
  {
    this.indexSerieNumeracion = index;
    this.isVisualizarSerieNumeracion = !this.isVisualizarSerieNumeracion;
  }

  onToSerieNumeracionItemSelected(value: ISerieNumeracionSap)
  {
    let codSede: number = 0;

    if(this.listSerieNumeracion.filter(x => x.codSerieNumeracion === value.code).length > 0)
    {
      this.isVisualizarSerieNumeracion = !this.isVisualizarSerieNumeracion;
      this.swaCustomService.swaMsgWarning("Se duplica la Serie - Numeración.");
      return;
    }

    this.params = this.modeloForm.getRawValue();
    if (this.modeloForm.controls['sede'].value) {
      let itemSede = this.modeloForm.controls['sede'].value;
      codSede = Number(itemSede.value);
    }

    this.listSerieNumeracion[this.indexSerieNumeracion].codSerieNumeracion  = value.code;
    this.listSerieNumeracion[this.indexSerieNumeracion].tipDocumento        = value.tipDocumento;
    this.listSerieNumeracion[this.indexSerieNumeracion].serDocumento        = value.serDocumento;
    this.listSerieNumeracion[this.indexSerieNumeracion].numDocumento        = value.numDocumento;
    this.listSerieNumeracion[this.indexSerieNumeracion].maxNumDocumento     = value.maxNumDocumento;
    this.listSerieNumeracion[this.indexSerieNumeracion].codSede             = codSede;
    this.isVisualizarSerieNumeracion = !this.isVisualizarSerieNumeracion;
  }

  onClickSerieNumeracionClose()
  {
    this.isVisualizarSerieNumeracion = !this.isVisualizarSerieNumeracion;
  }

  onClickFormularioOpen(index: number)
  {
    this.indexFormulario = index;
    this.isVisualizarFormulario = !this.isVisualizarFormulario;
  }

  onToFormularioItemSelected(value: IFormulario)
  {
    this.listSerieNumeracion[this.indexFormulario].codFormulario  = value.codFormulario;
    this.listSerieNumeracion[this.indexFormulario].nomFormulario  = value.nomFormulario;
    this.isVisualizarFormulario = !this.isVisualizarFormulario;
  }

  onClickFormularioClose()
  {
    this.isVisualizarFormulario = !this.isVisualizarFormulario;
  }

  onToValidatedSave(){
    if(this.listSerieNumeracionDelete.length === 0)
    {
      if (this.listSerieNumeracion.filter(x => x.codSerieNumeracion !== '').length === 0)
      {
        this.isSaving = false;
        this.swaCustomService.swaMsgInfo('Ingrese los datos en el detalle de la solicitud.');
        return false;
      }
    }

    return true;
  }

  onToSave()
  {
    this.isSaving = true;
    if(!this.onToValidatedSave()) return;

    this.modeloSave.linea = [];

    for (let index = 0; index < this.listSerieNumeracion.length; index++) {
      if(this.listSerieNumeracion[index].codSerieNumeracion !== '')
      {
        this.modeloSave.linea.push
        ({
          codSerieNumeracion  : this.listSerieNumeracion[index].codSerieNumeracion,
          tipDocumento        : this.listSerieNumeracion[index].tipDocumento,
          serDocumento        : this.listSerieNumeracion[index].serDocumento,
          numDocumento        : this.listSerieNumeracion[index].numDocumento,
          maxNumDocumento     : this.listSerieNumeracion[index].maxNumDocumento,
          codSede             : this.listSerieNumeracion[index].codSede,
          codFormulario       : this.listSerieNumeracion[index].codFormulario,
          idUsuario           : this.userContextService.getIdUsuario(),
          record              : this.listSerieNumeracion[index].record
        });
      }
    }

    for (let index = 0; index < this.listSerieNumeracionDelete.length; index++) {
      if(this.listSerieNumeracionDelete[index].codSede !== null)
      {
        this.modeloSave.linea.push
        ({
          codSerieNumeracion  : this.listSerieNumeracion[index].codSerieNumeracion,
          tipDocumento        : this.listSerieNumeracion[index].tipDocumento,
          serDocumento        : this.listSerieNumeracion[index].serDocumento,
          numDocumento        : this.listSerieNumeracion[index].numDocumento,
          maxNumDocumento     : this.listSerieNumeracion[index].maxNumDocumento,
          codSede             : this.listSerieNumeracion[index].codSede,
          codFormulario       : this.listSerieNumeracion[index].codFormulario,
          idUsuario           : this.userContextService.getIdUsuario(),
          record              : this.listSerieNumeracionDelete[index].record
        });
      }
    }

    this.serieNumeracionService.setAction(this.modeloSave)
    .subscribe({ next: (data:any)=>{
        this.isSaving = false;
        this.swaCustomService.swaMsgExito(null);
        this.onListar();
      },
      error:(e)=>{
        this.isSaving = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onClickSave()
  {
    this.swaCustomService.swaConfirmation(
      this.globalConstants.titleGrabar,
      this.globalConstants.subTitleGrabar,
      this.globalConstants.icoSwalQuestion
    ).then((result) => {
      if (result.isConfirmed) {
        this.onToSave();
      }
    });
  }
}
