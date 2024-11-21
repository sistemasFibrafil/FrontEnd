import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { UserContextService } from 'src/app/services/user-context.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';

import { ILocal } from 'src/app/modulos/modulo-gestion/interfaces/web/definiciones/ventas/local.interface';
import { LocalService } from 'src/app/modulos/modulo-gestion/services/web/definiciones/ventas/local.service';
import { FilterRequestModel } from 'src/app/models/filter-request.model';




@Component({
  selector: 'app-ges-panel-local-list',
  templateUrl: './panel-local-list.component.html',
  styleUrls: ['./panel-local-list.component.css']
})
export class PanelLocalListComponent implements OnInit {
  modeloForm: FormGroup;

  // Titulo del componente
  titulo = 'Local';
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  columnas: any[];
  opciones: any = [];

  modeloDelete: ILocal;
  modeloSelected: ILocal;
  list: ILocal[] = [];

  params: FilterRequestModel = new FilterRequestModel();
  isDisplay: Boolean = false;
  isDeleting: boolean = false;


  constructor
  (
    private router: Router,
    private fb: FormBuilder,
    public lenguageService: LanguageService,
    private userContextService: UserContextService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private localService: LocalService,
  ) {}


  ngOnInit() {
    this.onBuildForm();
    this.onBuildColumn();
    this.opcionesTabla();
  }

  onBuildForm() {
    this.modeloForm = this.fb.group(
    {
      'text1'   : new FormControl(''),
    });

    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-ges-panel-local-list');
  }

  onBuildColumn() {
    this.columnas = [
      { field: 'numLocal',       header: 'Código' },
      { field: 'nomLocal',       header: 'Nombre' },
      { field: 'cardCode',       header: 'Código del cliente' },
      { field: 'cardName',       header: 'Nombre del cliente' },
    ];
  }

  opcionesTabla() {
    this.opciones = [
      { label: 'Editar',      icon: 'pi pi-pencil',         command: () => { this.editar() } },
      { label: 'Vizualizar',  icon: 'pi pi-eye',            command: () => { this.ver() } },
      { label: 'Eliminar',    icon: 'pi pi-trash',          command: () => { this.eliminar() } },
    ];
  }

  onSetParametro()
  {
    this.params = this.modeloForm.getRawValue();
  }

  onListar() {
    this.isDisplay = true;
    this.onSetParametro();
    this.localService.getListByFiltro(this.params)
    .subscribe({next:(data: ILocal[]) =>
    {
      this.isDisplay = false;
      this.list = data;
    },error:(e)=>{
      this.isDisplay = false;
      this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
    }
    });
  }

  onToBuscar() {
    this.onListar();
  }

  onToCreate() {
    this.router.navigate(['/main/modulo-ge/panel-local-create']);
  }

  onToItemSelected(modelo: ILocal) {
    this.modeloSelected = modelo;
    if(this.buttonAcces.btnEditar){
      this.opciones.find(x => x.label == "Editar").visible = false;
    } else {
      this.opciones.find(x => x.label == "Editar").visible = true;
    }

    if(this.buttonAcces.btnVizualizar){
      this.opciones.find(x => x.label == "Vizualizar").visible = false;
    } else {
      this.opciones.find(x => x.label == "Vizualizar").visible = true;
    }

    if(this.buttonAcces.btnEliminar){
      this.opciones.find(x => x.label == "Eliminar").visible = false;
    } else {
      this.opciones.find(x => x.label == "Eliminar").visible = true;
    }
  }

  editar(){
    this.router.navigate(['/main/modulo-ge/panel-local-update', this.modeloSelected.numLocal]);
  }

  ver(){
    this.router.navigate(['/main/modulo-ge/panel-local-view', this.modeloSelected.numLocal]);
  }

  onToDelete() {
    this.isDeleting = true;
    this.localService.setDelete(this.modeloSelected.numLocal)
    .subscribe({ next: (resp:any)=>{
        this.onListar();
        this.isDeleting = false;
        this.swaCustomService.swaMsgExito(null);
      },
      error:(e)=>{
        this.isDeleting = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  eliminar()
  {
    this.swaCustomService.swaConfirmation(
      this.globalConstants.titleEliminar,
      this.globalConstants.subTitleEliminar,
      this.globalConstants.icoSwalQuestion
    ).then((result) => {
      if (result.isConfirmed) {
        this.onToDelete();
      }
    });
  }
}
