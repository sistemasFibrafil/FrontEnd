import { saveAs } from 'file-saver';
import { SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';
import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';


import { IAlmacenSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/inventario/almacen-sap.interface';
import { IArticuloSap } from '../../../interfaces/sap/articulo-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { AlmacenService } from 'src/app/modulos/modulo-gestion/services/sap/definiciones/inventario/almacen-sap.service';
import { ArticuloSapService } from '../../../services/sap/articulo-sap.service';



@Component({
  selector: 'app-inv-panel-stock-general-by-almacen',
  templateUrl: './panel-stock-general-by-almacen.component.html',
  styleUrls: ['./panel-stock-general-by-almacen.component.css']
})
export class PanelStockGeneralByAlmacenComponent implements OnInit {
  modeloForm: FormGroup;

  // Titulo del componente
  titulo = 'Reporte - Stock General';
  subtitulo = 'Stock General';
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  // Opcion Buscar
  isDisplay: boolean = false;
  isVisualizarAlmacen: boolean = false;

  almacenList: SelectItem[];

  almacenSelected: IAlmacenSap[];

  list: IArticuloSap[];
  params: FilterRequestModel = new FilterRequestModel();

  columnas: any[];

  fecha: string = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
  nombreArchivo: string = 'Artículos - Stock -' + this.fecha;

  // Modal
  whsCode: string = '';
  itemCode: string = '';


  constructor
  (
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    public lenguageService: LanguageService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private almacenService: AlmacenService,
    private articuloSapService: ArticuloSapService,
  ) {}

  ngOnInit() {

    this.modeloForm = this.fb.group(
      {
        'excluirInactivos'  : new FormControl({value: true, disabled: false}),
        'excluirSinStock'   : new FormControl({value: true, disabled: false}),
        'msAlmacen'         : new FormControl('', Validators.compose([Validators.required])),
        'text1'              : new FormControl(''),
      }
    );

    // Iniciamos el acceso a las opciones con la que cuenta el usuario
    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-inv-panel-stock-general-by-almacen');

    this.columnas =
    [
      { field: 'itemCode',          header: 'Código' },
      { field: 'itemName',          header: 'Descripción' },
      { field: 'invntryUom',        header: 'UM' },
      { field: 'onHand',            header: 'Stock' },
      { field: 'isCommited',        header: 'Comprometido' },
      { field: 'onOrder',           header: 'Solicitado' },
      { field: 'available',         header: 'Disponible' },
      { field: 'pesoPromedioKg',    header: 'Peso Promedio Kg' },
      { field: 'pesoKg',            header: 'Peso Kg' },
      { field: 'fecProduccion',     header: 'Fecha de Producción' },
    ];

    this.getListAlamcen();
  }

  getListAlamcen() {
    const param: any = { cod1: 'N' }; // inactive
    this.almacenService.getListByEstado(param)
    .subscribe({next:(data: IAlmacenSap[]) =>{
        this.almacenList = [];
        for (let item of data) {
          this.almacenList.push({ label: item.fullDescr, value: { whsCode: item.whsCode, whsName: item.fullDescr } });
        }
        this.getListAlamcenProduccion();
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  getListAlamcenProduccion() {
    this.almacenService.getListAlmacenProduccion()
    .subscribe({next:(data: IAlmacenSap[]) =>{
        this.almacenSelected = [];
        for (let item of data) {
          this.almacenSelected.push({ whsCode: item.whsCode, whsName: item.fullDescr });
        }
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onSetParametro()
  {
    this.params = this.modeloForm.getRawValue();
    this.params.cod1 = this.almacenSelected.map(x=> x.whsCode).join(",");
    this.params.val1 = this.modeloForm.controls['excluirInactivos'].value === true ? 1 : 0;
    this.params.val2 = this.modeloForm.controls['excluirSinStock'].value === true ? 1 : 0;
  }

  onToBuscar() {
    this.onListar();
  }

  onListar() {
    this.isDisplay = true;
    this.list = [];
    this.onSetParametro();
    this.articuloSapService.getListStockGeneralByAlmacen(this.params)
    .subscribe({next:(data: IArticuloSap[]) =>{
      this.list = data;
      this.isDisplay = false;
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onToExcel() {
    this.isDisplay = true;
    this.onSetParametro();
    this.articuloSapService.getStockGeneralByAlmacenExcel(this.params)
    .subscribe({next:(response: any) => {
        saveAs(
          new Blob([response],
          {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
          this.nombreArchivo + this.fecha
        );
        this.isDisplay = false;
        this.swaCustomService.swaMsgExito(null);
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onToRowSelectView(modelo: IArticuloSap) {
    this.whsCode = this.almacenSelected.map(x=> x.whsCode).join(",");
    this.itemCode = modelo.itemCode;
    this.isVisualizarAlmacen = true;
  }

  onClickAlmacenClose()
  {
    this.isVisualizarAlmacen = false;
  }

  onToSalir()
  {
    this.router.navigate(['/main/bienvenido/bienvenido']);
  }
}
