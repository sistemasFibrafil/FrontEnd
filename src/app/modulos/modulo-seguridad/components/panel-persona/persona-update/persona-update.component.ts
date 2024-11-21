import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PersonaModel } from '../../../models/persona.model';
import { PerfilModel } from '../../../models/pefil.model';
import { SelectItem } from 'primeng/api';
import { SeguridadService } from '../../../services/seguridad.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LayoutComponent } from '../../../../../layout/layout.component';
import { Subscription } from 'rxjs';
import { CifrarDataService } from '../../../../../services/cifrar-data.service';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { UtilService } from '../../../../../services/util.service';
import { ConstantesGenerales } from 'src/app/constants/Constantes-generales';
import { SwaCustomService } from '../../../../../services/swa-custom.service';
import { ParametroSistemaModel } from '../../../models/parametro-sistema.model';
import { UsuarioModel } from '../../../models/usuario.model';
import { SedeService } from 'src/app/modulos/modulo-gestion/services/web/definiciones/sede/sede.service';
import { ISede } from 'src/app/modulos/modulo-gestion/interfaces/web/definiciones/inventario/sede.interface';


@Component({
  selector: 'app-seg-persona-update',
  templateUrl: './persona-update.component.html',
  styleUrls: ['./persona-update.component.css']
})
export class PersonaUpdateComponent implements OnInit, OnDestroy {

  // Titulo del componente
  titulo = 'Usuario';

  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  modeloForm: FormGroup;

  modelo: PersonaModel = new PersonaModel();
  modeloSistema: ParametroSistemaModel = new ParametroSistemaModel();
  modeloPerfil: PerfilModel = new PerfilModel();

  themes: any[];

  listItemSede: SelectItem[];
  listItemPerfil: SelectItem[];

  idPersona: number;

  // Imagen
  sellersPermitString: string;
  sellersPermitFile;

  subscription: Subscription;

  // Centro de Costo
  isActivateBusquedaCentroCosto = false;
  itemCentroCostoSeleccionado: any;
  isActivateBusquedaCentro: boolean = false;
  isDimension: number;
  isHabilitarView: boolean;

  constructor
  (
    private router: Router,
    private fb: FormBuilder,
    public app: LayoutComponent,
    private sedeService: SedeService,
    private seguridadService: SeguridadService,
    private readonly route: ActivatedRoute,
    private readonly utilService: UtilService,
    private readonly swaCustomService: SwaCustomService,
    private readonly cifrarDataService: CifrarDataService,
  ) {}

  ngOnInit() {
    this.isDimension = ConstantesGenerales.DIMENSION_DEFAULT;
    this.themes = [
      {label: 'green'}
    ];
    this.onBuildForm();
    this.onBuildColumn();
    this.getListSede();
    this.getToObtienePerfil();
    this.onObtieneRegistro();


    this.route.params.subscribe((params: Params) => {
      this.idPersona = params['id'];
      this.getToObtienePersonaPorId();
    });
  }

  onInicializar() {
    this.modelo.entidadUsuario = new UsuarioModel();
  }

  onBuildForm() {
    this.modeloForm = this.fb.group(
      {
        'apellidoPaterno' : new FormControl(this.modelo.apellidoPaterno, Validators.compose([Validators.required, Validators.maxLength(50), Validators.minLength(2)])),
        'apellidoMaterno' : new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50), Validators.minLength(2)])),
        'nombre' : new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50), Validators.minLength(2)])),
        'numeroDocumento' : new FormControl('', Validators.compose([Validators.required])),
        'numeroTelefono' : new FormControl(''),
        'sede' : new FormControl(null),
        'flgEstado' : new FormControl(true, Validators.compose([Validators.required])),
        'usuario' : new FormControl({value: '', disabled: true}, Validators.compose([Validators.required, Validators.maxLength(20), Validators.minLength(2)])),
        'password' : new FormControl('', Validators.compose([Validators.maxLength(15), Validators.minLength(6)])),
        'email' : new FormControl('', Validators.compose([Validators.required, Validators.email])),
        'perfil' : new FormControl(''),
        'foto' : new FormControl(''),
        'dark' : new FormControl('true'),
        'menu' : new FormControl('static'),
        'theme' : new FormControl('green')
      }
    );
  }

  onBuildColumn() {
  }

  onObtieneRegistro() {
    this.subscription = new Subscription();
    this.subscription = this.seguridadService.getParametroSistemaPorId()
    .subscribe(resp => {
      if (resp) {
        this.modeloSistema = resp;
        }
      },
      (error) => {
        this.swaCustomService.swaMsgError(error.error.resultadoDescripcion);
      }
    );
  }

  getToObtienePersonaPorId() {
    this.isHabilitarView = true;
    this.subscription = new Subscription();
    this.subscription = this.seguridadService.getPersonaPorId(this.idPersona)
    .subscribe(data => {
      this.modelo = data;
      this.modeloForm.controls['apellidoPaterno'].setValue(this.modelo.apellidoPaterno);
      this.modeloForm.controls['apellidoMaterno'].setValue(this.modelo.apellidoMaterno);
      this.modeloForm.controls['nombre'].setValue(this.modelo.nombre);
      this.modeloForm.controls['numeroDocumento'].setValue(this.modelo.nroDocumento);
      this.modeloForm.controls['numeroTelefono'].setValue(this.modelo.nroTelefono);
      this.modeloForm.controls['sede'].setValue({ label: this.modelo.nomSede, value: this.modelo.codSede });
      this.modeloForm.controls['flgEstado'].setValue(this.modelo.flgActivo);
      this.modeloForm.controls['usuario'].setValue(this.modelo.entidadUsuario.usuario);
      this.modeloForm.controls['password'].setValue(this.cifrarDataService.decrypt(this.modelo.entidadUsuario.claveOrigen));
      this.modeloForm.controls['email'].setValue(this.modelo.entidadUsuario.email);

      this.modeloForm.controls['perfil'].setValue({ label: this.modelo.entidadUsuario.descripcionPerfil, value: this.modelo.entidadUsuario.idPerfil });

      this.modeloForm.controls['foto'].setValue(this.modelo.entidadUsuario.imagen);
      this.sellersPermitString = this.modelo.entidadUsuario.imagen;
      this.modeloForm.controls['dark'].setValue(this.modelo.entidadUsuario.themeDark);
      this.modeloForm.controls['menu'].setValue(this.modelo.entidadUsuario.typeMenu);
      this.modeloForm.controls['theme'].setValue(this.modelo.entidadUsuario.themeColor);

      this.isHabilitarView = false;
    });
  }

  getListSede() {
    this.listItemSede = [];
    const param: any = { text1: '' };
    this.sedeService.getListByFiltro(param)
    .subscribe({next:(data: ISede[]) =>{
        this.listItemSede = [];
        for (let item of data) {
          this.listItemSede.push({ label: item.nomSede, value: item.codSede });
        }
      },error:(e)=>{
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  getToObtienePerfil() {
    this.subscription = new Subscription();
    this.subscription = this.seguridadService.getPerfil(this.modeloPerfil)
    .subscribe((data: PerfilModel[]) => {
      this.listItemPerfil = [];
      for (let item of data) {
        this.listItemPerfil.push({ label: item.descripcionPerfil, value: item.idPerfil });
      }
    });
  }

  onBasicUpload(event: any) {
    let fileList: FileList = event.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.sellersPermitFile = file;
      this.handleInputChange(file);
    } else {
      alert("No file selected");
    }
  }

  handleInputChange(files) {
    let file = files;
    let pattern = /image-*/;
    let reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    let base64result = reader.result
    this.sellersPermitString = base64result;
    this.modeloForm.controls['foto'].setValue(this.sellersPermitString);
  }

  onClearUpload() {
    this.modeloForm.controls['foto'].setValue(this.modelo.entidadUsuario.imagen);
    this.sellersPermitString = this.modelo.entidadUsuario.imagen;
  }

  centroCostoSeleccionado(event: any) {
    this.itemCentroCostoSeleccionado = event;
    this.modeloForm.patchValue({
      codCentroCosto: event.codCentroCosto,
      desCentroCosto: event.desCentroCosto,
    });

    this.activarModalCentroCosto();
  }

  activarModalCentroCosto() {
    this.isActivateBusquedaCentroCosto = !this.isActivateBusquedaCentroCosto;
  }

  centroSeleccionado(event: any) {
    debugger
    this.modeloForm.patchValue({
      codCentro: event.codcentro,
      desCentro: event.nombre,
    });

    this.activarModalCentro();
  }

  activarModalCentro() {
    this.isActivateBusquedaCentro = !this.isActivateBusquedaCentro;
  }

  onClickSave() {
    this.modelo.apellidoPaterno = this.utilService.convertirMayuscula(this.modeloForm.controls['apellidoPaterno'].value);
    this.modelo.apellidoMaterno = this.utilService.convertirMayuscula(this.modeloForm.controls['apellidoMaterno'].value);
    this.modelo.nombre = this.utilService.convertirMayuscula(this.modeloForm.controls['nombre'].value);
    this.modelo.nroDocumento = this.modeloForm.controls['numeroDocumento'].value.toString();
    this.modelo.nroTelefono = this.modeloForm.controls['numeroTelefono'].value.toString();
    if (this.modeloForm.controls['sede'].value) {
      let itemSede = this.modeloForm.controls['sede'].value;
      this.modelo.codSede = itemSede.value;
    }
    this.modelo.flgActivo = this.modeloForm.controls['flgEstado'].value;
    this.modelo.entidadUsuario.imagen = this.modeloForm.controls['foto'].value;
    this.modelo.entidadUsuario.usuario = this.utilService.convertirMayuscula(this.modeloForm.controls['usuario'].value);

    if (this.modeloSistema.tipoAutenticacion === 'AUTO-NORMAL') {

      let password = this.modeloForm.controls['password'].value === null || this.modeloForm.controls['password'].value === undefined || this.modeloForm.controls['password'].value === '' ? '' : this.modeloForm.controls['password'].value;

      if (password === '') {
        this.swaCustomService.swaMsgInfo('INGRESAR CONTRASEÑA');
        return;
      }

      this.modelo.entidadUsuario.claveOrigen = this.cifrarDataService.encrypt(this.modeloForm.controls['password'].value);
    } else {
      this.modelo.entidadUsuario.claveOrigen = this.cifrarDataService.encrypt(ConstantesGenerales.PASSWORD_DEFAULT);
    }

    this.modelo.entidadUsuario.email = this.utilService.convertirMayuscula(this.modeloForm.controls['email'].value);

    if (this.modeloForm.controls['perfil'].value) {
      let itemPerfil = this.modeloForm.controls['perfil'].value;
      this.modelo.entidadUsuario.idPerfil = itemPerfil.value;
    }
    this.modelo.entidadUsuario.imagen = this.modeloForm.controls['foto'].value;
    this.modelo.entidadUsuario.themeDark = Boolean(this.modeloForm.controls['dark'].value);
    this.modelo.entidadUsuario.typeMenu = this.modeloForm.controls['menu'].value;
    this.modelo.entidadUsuario.themeColor = this.modeloForm.controls['theme'].value;

    this.subscription = new Subscription();
    this.subscription = this.seguridadService.setUpdatePersona(this.modelo)
    .subscribe(() =>  {
      this.swaCustomService.swaMsgExito(null);
      this.back(); },
      (error) => {
        this.swaCustomService.swaMsgError(error.error.resultadoDescripcion);
    });
  }

  back() {
    this.router.navigate(['/main/modulo-seg/panel-persona']);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
