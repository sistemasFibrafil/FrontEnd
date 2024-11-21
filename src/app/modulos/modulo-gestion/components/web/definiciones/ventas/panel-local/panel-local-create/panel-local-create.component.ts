import { Router } from '@angular/router';
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


@Component({
  selector: 'app-ges-panel-local-create',
  templateUrl: './panel-local-create.component.html',
  styleUrls: ['./panel-local-create.component.css']
})
export class PanelLocalCreateComponent implements OnInit {
  // Titulo del componente
  titulo = 'Local';

  modeloForm: FormGroup;
  buttonAcces: ButtonAcces = new ButtonAcces();
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  modeloSave: LocalModel = new LocalModel();

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
    public readonly utilService: UtilService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private localService: LocalService,
  ) {}

  ngOnInit() {
    this.onBuildForm();
  }

  onBuildForm() {
    this.modeloForm = this.fb.group(
    {
      'numLocal'        : new FormControl({ value: '',    disabled: false }, Validators.compose([Validators.required])),
      'nomLocal'        : new FormControl({ value: '',    disabled: false }, Validators.compose([Validators.required])),
      'esOriente'       : new FormControl({ value: false, disabled: false }),
      'cardCode'        : new FormControl({ value: '',    disabled: true  }, Validators.compose([Validators.required])),
      'cardName'        : new FormControl({ value: '',    disabled: true  }, Validators.compose([Validators.required])),
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


  onToValidatedSave(){
    return true;
  }

  onToSave() {
    this.isSaving = true;

    this.modeloSave.numLocal = this.modeloForm.controls['numLocal'].value;
    this.modeloSave.nomLocal = this.modeloForm.controls['nomLocal'].value;
    this.modeloSave.esOriente= this.modeloForm.controls['esOriente'].value;
    this.modeloSave.cardCode = this.modeloForm.controls['cardCode'].value;
    this.modeloSave.cardName = this.modeloForm.controls['cardName'].value;

    this.modeloSave.idUsuarioCreate = this.userContextService.getIdUsuario();

    this.localService.setCreate(this.modeloSave)
    .subscribe({ next: (resp: any)=>{
        this.isSaving = false;
        this.swaCustomService.swaMsgExito(null);
        this.back();
      },
      error:(e)=>{
        this.isSaving = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onClickSave() {
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

  back() {
    this.router.navigate(['/main/modulo-ge/panel-local-list']);
  }
}
