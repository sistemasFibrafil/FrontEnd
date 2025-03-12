import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { UserContextService } from 'src/app/services/user-context.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';

import { IPickingVentaByFiltro } from '../../../interfaces/picking-venta.interface';
import { PickingVentaService } from '../../../services/web/picking-venta.service';



@Component({
  selector: 'app-ven-panel-orden-venta-list',
  templateUrl: './panel-orden-venta-list.component.html',
  styleUrls: ['./panel-orden-venta-list.component.css']
})
export class PanelOrdenVentaListComponent implements OnInit {
  modeloForm: FormGroup;

  // Titulo del componente
  titulo = 'Órden de Venta';
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  columnas: any[];
  opciones: any = [];

  modeloDelete: IPickingVentaByFiltro;
  modeloSelected: IPickingVentaByFiltro;
  listPicking: IPickingVentaByFiltro[] = [];

  isDisplay: Boolean = false;
  isDeleting: boolean = false;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    public lenguageService: LanguageService,
    private userContextService: UserContextService,
    private pickingVentaService: PickingVentaService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService
  ) {}


  ngOnInit() {
    this.onBuildForm();
    this.onBuildColumn();
    this.opcionesTabla();
  }

  onBuildForm() {
    this.modeloForm = this.fb.group(
    {
      'fecInicial'  : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'fecFinal'    : new FormControl(new Date(new Date()), Validators.compose([Validators.required]))
    });

    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-ven-panel-orden-venta-list');
  }

  onBuildColumn() {
    this.columnas = [
      { field: 'numPicking',      header: 'Número' },
      { field: 'numPicking',      header: 'Fecha' },
      { field: 'nomTipoPicking',  header: 'Tipo' },
      { field: 'nomEstado',       header: 'Estado' },
      { field: 'cardCode',        header: 'Código de Cliente' },
      { field: 'cardName',        header: 'Nombre de Cliente' }
    ];
  }

  opcionesTabla() {
    this.opciones = [
      { label: 'Vizualizar',  icon: 'pi pi-eye',            command: () => { this.ver() } },
      { label: 'Editar',      icon: 'pi pi-pencil',         command: () => { this.editar() } },
      { label: 'Eliminar',    icon: 'pi pi-trash',          command: () => { this.eliminar() } },
    ];
  }

  onListar() {
    this.isDisplay = true;
    const find = this.modeloForm.getRawValue();
    this.pickingVentaService.getListPickingVentaByFiltro(find)
    .subscribe({next:(data: IPickingVentaByFiltro[]) =>
    {
      this.isDisplay = false;
      this.listPicking = data;
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
    this.router.navigate(['/main/modulo-ven/panel-orden-venta-create']);
  }

  onToItemSelected(modelo: IPickingVentaByFiltro) {
    this.modeloSelected = modelo;
    if(this.buttonAcces.btnEditar || modelo.codEstado === '02' || modelo.codEstado === '03'){
      this.opciones.find(x => x.label == "Editar").visible = false;
    } else {
      this.opciones.find(x => x.label == "Editar").visible = true;
    }

    if(this.buttonAcces.btnEliminar || modelo.codEstado === '02' || modelo.codEstado === '03'){
      this.opciones.find(x => x.label == "Eliminar").visible = false;
    } else {
      this.opciones.find(x => x.label == "Eliminar").visible = true;
    }
  }

  ver(){
    this.router.navigate(['/main/modulo-ven/panel-orden-venta-view', this.modeloSelected.idPicking]);
  }

  editar(){
    this.router.navigate(['/main/modulo-ven/panel-orden-venta-update', this.modeloSelected.idPicking]);
  }

  onToDelete() {
    this.isDeleting = true;
    const param: any = { idPicking: this.modeloSelected.idPicking, idUsuario: this.userContextService.getIdUsuario() };
    this.pickingVentaService.setDelete(param)
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
