import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';

import { IOrdenVentaPendienteByFecha } from '../../../interfaces/sap/orden-venta-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { OrdenVentaSapService } from '../../../services/sap/orden-venta-sap.service';



@Component({
  selector: 'app-ven-panel-ov-programacion-by-fecha',
  templateUrl: './panel-ov-programacion-by-fecha.component.html',
  styleUrls: ['./panel-ov-programacion-by-fecha.component.css']
})
export class PanelOrdenVentaProgramcionByFechaComponent implements OnInit {
  modeloForm: FormGroup;

  // Titulo del componente
  titulo = 'Reporte - Órdenes de Venta - Programación';
  subtitulo = 'Órdenes de Venta - Programación';
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  // Opcion Buscar
  isDisplay: boolean = false;

  reporteList: IOrdenVentaPendienteByFecha[];
  params: FilterRequestModel = new FilterRequestModel();

  fecha: string = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
  nombreArchivo: string = 'Órdenes de Venta - Programación - ' + this.fecha;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    public lenguageService: LanguageService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private ordenVentaSapService: OrdenVentaSapService
  ){}

  ngOnInit() {
    this.modeloForm = this.fb.group(
    {
      'dat1'      : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'dat2'      : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
      'text1'     : new FormControl(''),
    });

    // Iniciamos el acceso a las opciones con la que cuenta el usuario
    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-ven-panel-ov-programacion-by-fecha');
  }

  onToBuscar() {
    this.onListar();
  }

  onSetParametro()
  {
    this.params = this.modeloForm.getRawValue();
  }

  onListar() {
    this.isDisplay = true;
    this.reporteList = [];
    this.onSetParametro();
    this.ordenVentaSapService.getListOrdenVentaProgramacionByFecha(this.params)
    .subscribe({next:(data: IOrdenVentaPendienteByFecha[]) =>{
      if(data)
      {
        this.isDisplay = false;
        this.reporteList = data;
      }
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
    this.ordenVentaSapService.getOrdenVentaProgramacionExcelByFecha(this.params)
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
}
