import { Component, OnInit, OnDestroy } from '@angular/core';
import { PersonaModel } from '../../models/persona.model';
import { SeguridadService } from '../../services/seguridad.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalsConstantsForm } from '../../../../constants/globals-constants-form';
import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { AccesoOpcionesService } from '../../../../services/acceso-opciones.service';
import { SwaCustomService } from '../../../../services/swa-custom.service';

@Component({
  selector: 'app-seg-panel-persona',
  templateUrl: './panel-persona.component.html',
  styleUrls: ['./panel-persona.component.css']
})
export class PanelPersonaComponent implements OnInit, OnDestroy {

  // Titulo del componente
  titulo = 'Usuario';
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  // Opcion Buscar
  descripcionFind = '';
  modeloFind: PersonaModel;
  listModelo: PersonaModel[];

  columnas: any[];

  // Opcion Eliminar
  modeloEliminar: PersonaModel;

  subscription: Subscription;

  constructor(private seguridadService: SeguridadService,
              private router: Router,
              private readonly accesoOpcionesService: AccesoOpcionesService,
              private readonly swaCustomService: SwaCustomService
              ) {}

  ngOnInit() {

    // Iniciamos el acceso a las opciones con la que cuenta el usuario
    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-seg-panel-persona');

    this.columnas = [
      { header: 'Usuario' },
      { header: 'Apellidos y Nombres' },
      { header: 'Nro Documento' },
      { header: 'Perfil' },
      { header: 'Activo' }
    ];

    if(!this.buttonAcces.btnBuscar){this.onListar();}
  }

  onToBuscar() {
    this.onListar();
  }

  onListar() {

    this.modeloFind = {nombre: this.descripcionFind};
    this.subscription = new Subscription();
    this.subscription = this.seguridadService.getPersona(this.modeloFind)
    .subscribe((resp: PersonaModel[]) => {
      if (resp) {
          this.listModelo = resp;
        }
      },
      (error) => {
        this.swaCustomService.swaMsgError(error.error.resultadoDescripcion);
      }
    );
  }

  onToRowSelectEdit(modelo: PersonaModel) {
    this.router.navigate(['/main/modulo-seg/persona-update', modelo.idPersona]);
  }

  onToRowSelectDelete(modelo: PersonaModel) {
    this.modeloEliminar = modelo;
    this.onConfirmDelete();
  }

  onToCreate() {
    this.router.navigate(['/main/modulo-seg/persona-create']);
  }

  onConfirmDelete() {
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

  onToDelete() {
    this.subscription = new Subscription();
    this.subscription = this.seguridadService.setDeletePersona(this.modeloEliminar)
    .subscribe((resp: any) => {
      debugger
      this.listModelo = this.listModelo.filter(datafilter => datafilter.idPersona !== this.modeloEliminar.idPersona );
      this.swaCustomService.swaMsgExito(resp.resultadoDescripcion);
    },
      (error) => {
        debugger
        this.swaCustomService.swaMsgError(error.error.resultadoDescripcion);
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
