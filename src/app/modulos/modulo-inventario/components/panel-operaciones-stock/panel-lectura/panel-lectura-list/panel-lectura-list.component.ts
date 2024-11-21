import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';
import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { UserContextService } from 'src/app/services/user-context.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';

import { ILectura } from 'src/app/modulos/modulo-inventario/interfaces/lectura.inteface';
import { LecturaFindModel } from 'src/app/modulos/modulo-inventario/models/lectura.model';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { LecturaService } from 'src/app/modulos/modulo-inventario/services/web/lectura.service';
import { EstadoDocumentoService } from 'src/app/modulos/modulo-gestion/services/web/definiciones/general/estado-documento.service';

interface DocStatus {
  statusCode  : string,
  statusName  : string
}



@Component({
  selector: 'app-inv-panel-lectura-list',
  templateUrl: './panel-lectura-list.component.html',
  styleUrls: ['./panel-lectura-list.component.css']
})
export class PanelLecturaListComponent implements OnInit {
  modeloForm: FormGroup;

  // Titulo del componente
  titulo = 'Lectura';
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  columnas: any[];
  opciones1: any = [];
  opciones2: any = [];

  modeloDelete: ILectura;
  modeloSelected: ILectura;
  listObjType: SelectItem[];
  lecturaList: ILectura[] = [];
  lecturaSelected: ILectura[] = [];

  docStatus: DocStatus[];
  docStatusList: SelectItem[];
  docStatusSelected: any[];

  isDisplay: Boolean = false;
  isDeleting: boolean = false;
  params: FilterRequestModel = new FilterRequestModel();
  paramsLectura: LecturaFindModel = new LecturaFindModel();


  constructor
  (
    private router: Router,
    private fb: FormBuilder,
    public lenguageService: LanguageService,
    private userContextService: UserContextService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private lecturaService: LecturaService,
  ) {}


  ngOnInit() {
    this.onBuildForm();
    this.onBuildColumn();
    this.opcionesTabla();
    this.getListTipoDocumento();
    this.getListEstado();
  }

  onBuildForm() {
    this.modeloForm = this.fb.group(
    {
      'dat1'            : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'dat2'            : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'objType'         : new FormControl('', Validators.compose([Validators.required])),
      'msDocStatus'     : new FormControl('', Validators.compose([Validators.required])),
    });

    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-inv-panel-lectura-list');
  }

  onBuildColumn() {
    this.columnas = [
      { field: 'numBase',         header: 'Número' },
      { field: 'baseNum',         header: 'SAP' },
      { field: 'baseLine',        header: 'Línea' },
      { field: 'itemCode',        header: 'Código' },
      { field: 'dscription',      header: 'Descripción' },
      { field: 'return',          header: 'Devuelto' },
      { field: 'quantity',        header: 'Cantidad' },
      { field: 'peso',            header: 'Peso' },
    ];
  }

  opcionesTabla() {
    this.opciones1 = [
      { label: 'Visualizar',  icon: 'pi pi-eye',            command: () => {  } },
      { label: 'Eliminar',    icon: 'pi pi-trash',          command: () => { this.onToDelete() } },
    ];
    this.opciones2 = [
      { label: 'Despacho',    icon: 'pi pi-plus',           command: () => { this.onToCopy() } },
    ];
  }

  getListTipoDocumento()
  {
    this.listObjType =
    [
      { label: 'Solicitud de Traslado',   value: '1250000001' },
      { label: 'Órden de Venta',          value: '17' },
      { label: 'Factura de Reserva',      value: '13' },
    ];

    const item: any = this.listObjType.find(x=>x.value === '1250000001');
    this.modeloForm.controls['objType'].setValue({ label: item.label, value: item.value });
  }

  getListEstado() {
    this.docStatusList = [];
    this.docStatusSelected = [];
    this.docStatus =
    [
      { statusCode  : '01', statusName: 'Abierto'},
      { statusCode  : '02', statusName: 'Cerrado'},
    ];
    for (let lina of this.docStatus) {
      this.docStatusSelected.push({ statusCode: lina.statusCode, statusName: lina.statusName });
      this.docStatusList.push({ label: lina.statusName, value: { statusCode: lina.statusCode, statusName: lina.statusName } });
    }
  }

  onSetParametro()
  {
    let objType: string = '';

    if (this.modeloForm.controls['objType'].value) {
      let itemTipobjType = this.modeloForm.controls['objType'].value;
      objType = itemTipobjType.value;
    }

    this.params = this.modeloForm.getRawValue();
    this.params.cod1 = objType;
    this.params.cod2 = this.docStatusSelected.map(x=> x.statusCode).join(",");
  }

  onListar() {
    this.isDisplay = true;
    this.onSetParametro();
    this.lecturaService.getListFiltro(this.params)
    .subscribe({next:(data: ILectura[]) =>{
      this.isDisplay = false;
      this.lecturaList = data;
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
    this.router.navigate(['/main/modulo-inv/panel-lectura-create']);
  }

  onToItemSelected(modelo: ILectura) {
    this.modeloSelected = modelo;
    if(this.buttonAcces.btnVizualizar || modelo.docStatus === '03'){
      this.opciones1.find(x => x.label == "Visualizar").visible = false;
    } else {
      this.opciones1.find(x => x.label == "Visualizar").visible = true;
    }
    if(this.buttonAcces.btnEditar || modelo.docStatus === '02' || modelo.docStatus === '03'){
      this.opciones1.find(x => x.label == "Eliminar").visible = false;
    } else {
      this.opciones1.find(x => x.label == "Eliminar").visible = true;
    }
  }

  delete() {
    this.isDeleting = true;
    const param: any = { objType: this.modeloSelected.baseType, docEntry: this.modeloSelected.baseEntry };
    this.lecturaService.setDeleteMultiple(param)
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

  onToDelete()
  {
    this.swaCustomService.swaConfirmation(
      this.globalConstants.titleEliminar,
      this.globalConstants.subTitleEliminar,
      this.globalConstants.icoSwalQuestion
    ).then((result) => {
      if (result.isConfirmed) {
        this.delete();
      }
    });
  }

  onToCopy()
  {
    if(this.lecturaSelected.length>0)
    {
      this.paramsLectura.idBase = this.lecturaSelected[0].idBase;
      this.paramsLectura.baseType = this.lecturaSelected[0].baseType;

      this.paramsLectura.linea = [];

      for (let index = 0; index < this.lecturaSelected.length; index++) {
        if(this.lecturaSelected[index].idBase !== 0)
        {
          this.paramsLectura.linea.push
          ({
            idBase              : this.lecturaSelected[index].idBase,
            lineBase            : this.lecturaSelected[index].lineBase,
            baseType            : this.lecturaSelected[index].baseType,
            return              : this.lecturaSelected[index].return,
          });
        }
      }
      // let miArray: any[] = [];
      // const json = JSON.stringify(this.paramsLectura);
      // console.log("Json: ", json);
      // miArray = JSON.parse(json);
      // console.log("Array: ", miArray);
      this.router.navigate(['/main/modulo-inv/panel-transferencia-stock-create', JSON.stringify(this.paramsLectura)]);
    }
  }
}
