import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { UtilService } from 'src/app/services/util.service';
import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { LayoutComponent } from 'src/app/layout/layout.component';

import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { UserContextService } from 'src/app/services/user-context.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';

import { ISocioNegocio } from 'src/app/modulos/modulo-socio-negocios/interfaces/socio-segocio.interface';
import { LocalModel } from 'src/app/modulos/modulo-gestion/models/web/definiciones/ventas/local.model';
import { LocalService } from 'src/app/modulos/modulo-gestion/services/web/definiciones/ventas/local.service';
import { ILocal } from 'src/app/modulos/modulo-gestion/interfaces/web/definiciones/ventas/local.interface';


@Component({
  selector: 'app-ges-panel-local-view',
  templateUrl: './panel-local-view.component.html',
  styleUrls: ['./panel-local-view.component.css']
})
export class PanelLocalViewComponent implements OnInit {
  // Titulo del componente
  titulo = 'Local';

  modeloForm: FormGroup;
  buttonAcces: ButtonAcces = new ButtonAcces();
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  modeloView: ILocal;
  modeloSave: LocalModel = new LocalModel();

  numLocal: string = '';

  // MODAL: Progreso
  isDisplay: boolean = false;
  isSaving: boolean = false;
  isDeleting: boolean = false;

  // MODAL: CLiente
  cardCode: string = '';
  clienteSelected: ISocioNegocio;


  constructor
  (
    private router: Router,
    private fb: FormBuilder,
    private userContextService: UserContextService,
    public app: LayoutComponent,
    public lenguageService: LanguageService,
    private readonly route: ActivatedRoute,
    public readonly utilService: UtilService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private localService: LocalService,
  ) {}

  ngOnInit() {
    this.onBuildForm();

    this.route.params.subscribe((params: Params) => {
      this.numLocal = params["id"];
      setTimeout(() => {
        this.getById(this.numLocal);
      }, 10);
    });
  }

  onBuildForm() {
    this.modeloForm = this.fb.group(
    {
      'numLocal'        : new FormControl({ value: '',    disabled: true }),
      'nomLocal'        : new FormControl({ value: '',    disabled: true }),
      'esOriente'       : new FormControl({ value: false, disabled: true}),
      'cardCode'        : new FormControl({ value: '',    disabled: true }),
      'cardName'        : new FormControl({ value: '',    disabled: true }),
    });


    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-ges-panel-local-list');
  }

  //#region <<< MODAL: Cliente >>>
  onToSelectedCliente(value) {
    this.clienteSelected = value;
    this.cardCode = this.clienteSelected.cardCode;
    this.modeloForm.patchValue({ cardCode : this.clienteSelected.cardCode, cardName: this.clienteSelected.cardName });
  }
  //#endregion


  setView(data: ILocal)
  {
    this.cardCode = data.cardCode;
    this.modeloForm.patchValue
    ({
      numLocal    : data.numLocal,
      nomLocal    : data.nomLocal,
      esOriente   : data.esOriente,
      cardCode    : data.cardCode,
      cardName    : data.cardName
    });
  }

  getById(numLocal: string) {
    this.isDisplay = true;
    this.localService.getByNumLocal(numLocal)
    .subscribe({next:(data: ILocal) =>{
        this.isDisplay = false;
        this.modeloView = data;
        this.setView(this.modeloView);
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  back() {
    this.router.navigate(['/main/modulo-ge/panel-local-list']);
  }
}
