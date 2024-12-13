import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';
import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';

import { IArticuloSap, IArticuloVentaStockByGrupoSubGrupo } from '../../../interfaces/articulo-sap.interface';
import { IGrupoArticulo, ISubGrupoArticulo2, ISubGrupoArticulo } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/inventario/grupo-articulo-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { ArticuloSapService } from '../../../services/sap/articulo-sap.service';
import { GrupoArticuloService } from '../../../../modulo-gestion/services/sap/definiciones/inventario/grupo-articulo-sap.service';
import { SubGrupoArticuloService } from 'src/app/modulos/modulo-gestion/services/sap/definiciones/inventario/sub-grupo-articulo-sap.service';
import { SubGrupoArticulo2Service } from 'src/app/modulos/modulo-gestion/services/sap/definiciones/inventario/sub-grupo-articulo2-sap.service';



@Component({
  selector: 'app-inv-panel-articulo-by-grupo-sub-grupo-filtro',
  templateUrl: './panel-articulo-by-grupo-sub-grupo-filtro.component.html',
  styleUrls: ['./panel-articulo-by-grupo-sub-grupo-filtro.component.css']
})
export class PanelArticuloByGrupoSubGrupoFiltroComponent implements OnInit, OnDestroy {
  modeloForm: FormGroup;
  subscription: Subscription;

  // Titulo del componente
  titulo = 'Reporte - Artículos por grupo - subgrupo';
  subtitulo = 'Artículos por grupo - subgrupo';
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  // Opcion Buscar
  isDisplay: boolean = false;

  grupoArticuloList: SelectItem[];
  subGrupoArticuloList: SelectItem[];
  subGrupoArticulo2List: SelectItem[];

  grupoArticuloSelected: IGrupoArticulo[];
  subGrupoArticuloSelected: ISubGrupoArticulo[];
  subGrupoArticulo2Selected: ISubGrupoArticulo2[];

  reporteList: IArticuloSap[];
  params: FilterRequestModel = new FilterRequestModel();

  columnas: any[];

  fecha: string = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
  nombreArchivo: string = 'Artículos por grupo - subgrupo -' + this.fecha;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    public lenguageService: LanguageService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private articuloSapService: ArticuloSapService,
    private grupoArticuloService: GrupoArticuloService,
    private subGrupoArticuloService: SubGrupoArticuloService,
    private subGrupoArticulo2Service: SubGrupoArticulo2Service) {}

  ngOnInit() {

    this.modeloForm = this.fb.group(
      {
        'excluirInactivos'    : new FormControl({value: true,   disabled: false}),
        'excluirSinStock'     : new FormControl({value: true,   disabled: false}),
        'invntItem'           : new FormControl({value: true,   disabled: false}),
        'sellItem'            : new FormControl({value: false,  disabled: false}),
        'prchseItem'          : new FormControl({value: false,  disabled: false}),
        'msGrupo'             : new FormControl('', Validators.compose([Validators.required])),
        'msSubGrupo'          : new FormControl('', Validators.compose([Validators.required])),
        'msSubGrupo2'         : new FormControl('', Validators.compose([Validators.required])),
        'text1'               : new FormControl(''),
      }
    );

    // Iniciamos el acceso a las opciones con la que cuenta el usuario
    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-inv-panel-articulo-by-grupo-sub-grupo-filtro');

    this.columnas = [
      { field: 'itemCode',        header: 'Código' },
      { field: 'itemName',        header: 'Descripción' },
      { field: 'nomGrupo',        header: 'Grupo' },
      { field: 'nomSubGrupo',     header: 'SubGrupo' },
      { field: 'nomSubGrupo2',    header: 'SubGrupo 2' },
      { field: 'salUnitMsr',      header: 'UM' },
      { field: 'onHand',          header: 'Stock' },
      { field: 'isCommited',      header: 'Comprometido' },
      { field: 'onOrder',         header: 'Solicitado' },
      { field: 'available',       header: 'Disponible' },
      { field: 'PesoPromedioKg',  header: 'Peso Promedio Kg' }
    ];

    this.reporteList = [];

    this.getListGrupoArticulo();
    this.getListSubGrupoArticulo();
    this.getListSubGrupoArticulo2();
  }

  getListGrupoArticulo() {
    this.subscription = new Subscription();
    this.grupoArticuloService.getList()
    .subscribe({next:(data: IGrupoArticulo[]) =>{
        this.grupoArticuloList = [];
        this.grupoArticuloSelected = [];

        for (let item of data) {
          this.grupoArticuloSelected.push({ itmsGrpCod: item.itmsGrpCod, itmsGrpNam: item.itmsGrpNam });
          this.grupoArticuloList.push({ label: item.itmsGrpNam, value: { itmsGrpCod: item.itmsGrpCod, itmsGrpNam: item.itmsGrpNam } });
        }
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  getListSubGrupoArticulo() {
    this.subscription = new Subscription();
    this.subGrupoArticuloService.getList()
    .subscribe({next:(data: ISubGrupoArticulo[]) =>{
        this.subGrupoArticuloList = [];
        this.subGrupoArticuloSelected = [];

        for (let item of data) {
          this.subGrupoArticuloSelected.push({ code: item.code, name: item.name });
          this.subGrupoArticuloList.push({ label: item.name, value: { code: item.code, name: item.name } });
        }
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  getListSubGrupoArticulo2() {
    this.subscription = new Subscription();
    this.subGrupoArticulo2Service.getList()
    .subscribe({next:(data: ISubGrupoArticulo2[]) =>{
        this.subGrupoArticulo2List = [];
        this.subGrupoArticulo2Selected = [];

        for (let item of data) {
          this.subGrupoArticulo2Selected.push({ code: item.code, name: item.name });
          this.subGrupoArticulo2List.push({ label: item.name, value: { code: item.code, name: item.name } });
        }
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onToBuscar() {
    this.onListar();
  }

  onSetParametro()
  {
    this.params = this.modeloForm.getRawValue();
    this.params.val1 = this.modeloForm.controls['excluirInactivos'].value === true ? 1 : 0;
    this.params.val2 = this.modeloForm.controls['excluirSinStock'].value  === true ? 1 : 0;
    this.params.val4 = this.modeloForm.controls['invntItem'].value        === true ? 1 : 0;
    this.params.val3 = this.modeloForm.controls['sellItem'].value         === true ? 1 : 0;
    this.params.val5 = this.modeloForm.controls['prchseItem'].value       === true ? 1 : 0;
    this.params.cod1 = this.grupoArticuloSelected.map(x=> x.itmsGrpCod).join(",");
    this.params.cod2 = this.subGrupoArticuloSelected.map(x=> x.code).join(",");
    this.params.cod3 = this.subGrupoArticulo2Selected.map(x=> x.code).join(",");
  }

  onListar() {
    this.isDisplay = true;
    this.reporteList = [];
    this.onSetParametro();
    this.articuloSapService.getListArticuloByGrupoSubGrupoFiltro(this.params)
    .subscribe({next:(data: IArticuloSap[]) =>{
        this.isDisplay = false;
        this.reporteList = data;
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onToExcel() {
    this.isDisplay = true;
    this.onSetParametro();
    this.subscription = new Subscription();
    this.articuloSapService.getListArticuloExcelByGrupoSubGrupoFiltro(this.params)
    .subscribe({next:(response: any) => {
        saveAs(
          new Blob([response],
          {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
          this.nombreArchivo
        );
        this.isDisplay = false;
        this.swaCustomService.swaMsgExito(null);
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onToSalir()
  {
    this.router.navigate(['/main/bienvenido/bienvenido']);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
