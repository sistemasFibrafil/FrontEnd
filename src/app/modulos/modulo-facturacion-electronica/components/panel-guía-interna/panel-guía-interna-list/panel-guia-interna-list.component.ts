import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';

import { ITransferenciaStock } from '../../../interfaces/transferenciaStock.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { TransferenciaStockEnviarModel } from '../../../models/transferenciaStock.model';
import { TransferenciaStockService } from '../../../services/transferenciaStock.service';



@Component({
  selector: 'app-fac-panel-guia-interna-list',
  templateUrl: './panel-guia-interna-list.component.html',
  styleUrls: ['./panel-guia-interna-list.component.css']
})
export class PanelGuiaInternaListComponent implements OnInit {
  modeloForm: FormGroup;

  // Titulo del componente
  titulo = 'Guías Internas';
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  // Opcion Buscar
  isDisplay: boolean = false;
  listTransferenciaStock: ITransferenciaStock[];
  params: FilterRequestModel = new FilterRequestModel();

  columnas: any[];

  // Enviar
  transferenciaStockEnviarModel: TransferenciaStockEnviarModel = new TransferenciaStockEnviarModel();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public lenguageService: LanguageService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService,
    private transferenciaStockService: TransferenciaStockService) {}

  ngOnInit() {

    this.modeloForm = this.fb.group(
      {
        'dat1'        : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
        'dat2'        : new FormControl(new Date(new Date()), Validators.compose([Validators.required])),
        'text1'       : new FormControl(''),
        'text2'       : new FormControl(''),
      }
    );

    // Iniciamos el acceso a las opciones con la que cuenta el usuario
    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-fac-panel-guia-interna-list');

    this.columnas = [
      { field: 'docNum', header: 'Número SAP' },
      { field: 'serieDocumento', header: 'Serie' },
      { field: 'numeroDocumento', header: 'Número' },
      { field: 'fechaEmision', header: 'Fecha Emisión' },
      { field: 'fechaEntrega', header: 'Fecha Entrega' },
      { field: 'clienteNumeroDocumento', header: 'RUC' },
      { field: 'clienteDenominacion', header: 'Nombre Cliente' }
    ];
  }

  onToBuscar() {
    this.onListar();
  }

  onListar() {
    this.isDisplay = true;
    this.params = this.modeloForm.getRawValue();;
    this.transferenciaStockService.getListGuiaInternaElectronicaByFechaAndNumero(this.params)
    .subscribe({ next:(data: ITransferenciaStock[]) => {
        this.isDisplay = false;
        this.listTransferenciaStock = data;
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onToRowSelectEnviar(modelo: ITransferenciaStock) {
    this.isDisplay = true;
    this.transferenciaStockEnviarModel.docEntry = modelo.docEntry;

    this.transferenciaStockService.setEnviarGuiaElectronica(this.transferenciaStockEnviarModel)
    .subscribe({ next:(data: any) => {
      this.isDisplay = false;
      this.swaCustomService.swaMsgExito(null);
      this.onListar();
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }
}
