import { MenuItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';
import { UserContextService } from 'src/app/services/user-context.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';

import { ISede } from 'src/app/modulos/modulo-gestion/interfaces/web/definiciones/inventario/sede.interface';
import { ISedeSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/inventario/sede-sap.interface';
import { SedeModel } from 'src/app/modulos/modulo-gestion/models/web/definiciones/inventario/sede.model';
import { SedeService } from 'src/app/modulos/modulo-gestion/services/web/definiciones/sede/sede.service';



@Component({
  selector: 'app-ges-panel-sede-create',
  templateUrl: './panel-sede-create.component.html',
  styleUrls: ['./panel-sede-create.component.css']
})
export class PanelSedeCreateComponent implements OnInit {
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  isSaving: boolean = false;
  isDisplay: Boolean = false;
  isVisualizar: Boolean = false;

  indexSede: number;

  columnas: any[];
  items: MenuItem[];
  listSede: ISede[] = [];
  listSedeDelete: ISede[] = [];
  sedeSelected: ISede;
  modeloSave: SedeModel = new SedeModel();

  constructor
  (
    private sedeService: SedeService,
    private userContextService: UserContextService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private readonly swaCustomService: SwaCustomService,
  ) {}

  ngOnInit() {
    this.onBuildColumn()
    this.getListContextMenu();
    this.onListar();
    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-ges-panel-sede-create');
  }

  onBuildColumn() {
    this.columnas =
    [
      { field: 'codSede', header: 'Código' },
      { field: 'nomSede', header: 'Nombre' },
    ];
  }

  getListContextMenu() {
    this.items =
    [
      {label: 'Añadir línea', icon: 'pi pi-plus',   command: () => this.addLine() },
      {label: 'Borrar línea', icon: 'pi pi-trash',  command: () => this.delete(this.sedeSelected) }
    ];
  }

  addLine()
  {
    let exiete: boolean = false;
    this.listSede.forEach(item=>{
      if(item.codSede === null){
        exiete = true;
        return;
      }
    });

    if(!exiete || this.listSede.length === 0)
    {
      this.listSede.push({ codSede: null, nomSede: '', record: 1 });
    }
  }

  delete(value: ISede)
  {
    if(value.record == 2)
    {
      // Se define como eliminado con "record = 3" caundo el registro se encuentra en la DB
      value.record = 3;
      this.listSedeDelete.push(value);
    }
    let index = this.listSede.indexOf(value);
    this.listSede.splice(+index, 1);

    if(this.listSede.length === 0)
    {
      this.addLine();
    }
  }

  onListar() {
    this.isDisplay = true;
    this.listSede = [];
    this.listSedeDelete = [];
    const params: any = { text1: '' };
    this.sedeService.getListByFiltro(params)
    .subscribe({next:(data: ISede[]) =>{
        this.listSede = data;
        if(this.listSede.length === 0)
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

  onClickSedeOpen(index: number)
  {
    this.indexSede = index;
    this.isVisualizar = !this.isVisualizar;
  }

  onToSedeItemSelected(value: ISedeSap)
  {
    if(this.listSede.filter(x => x.codSede === value.code).length > 0)
    {
      this.isVisualizar = !this.isVisualizar;
      this.swaCustomService.swaMsgWarning("Se duplica la Sede.");
      return;
    }

    this.listSede[this.indexSede].codSede = value.code;
    this.listSede[this.indexSede].nomSede = value.location;
    this.isVisualizar = !this.isVisualizar;
  }

  onClickSedeClose()
  {
    this.isVisualizar = !this.isVisualizar;
  }

  onToValidatedSave(){
    if(this.listSedeDelete.length === 0)
    {
      if (this.listSede.filter(x => x.codSede !== null).length === 0)
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

    for (let index = 0; index < this.listSede.length; index++) {
      if(this.listSede[index].codSede !== null)
      {
        this.modeloSave.linea.push
        ({
          codSede        : this.listSede[index].codSede,
          nomSede        : this.listSede[index].nomSede,
          idUsuario      : this.userContextService.getIdUsuario(),
          record         : this.listSede[index].record
        });
      }
    }

    for (let index = 0; index < this.listSedeDelete.length; index++) {
      if(this.listSedeDelete[index].codSede !== null)
      {
        this.modeloSave.linea.push
        ({
          codSede        : this.listSedeDelete[index].codSede,
          nomSede        : this.listSedeDelete[index].nomSede,
          idUsuario      : this.userContextService.getIdUsuario(),
          record         : this.listSedeDelete[index].record
        });
      }
    }

    this.sedeService.setAction(this.modeloSave)
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
