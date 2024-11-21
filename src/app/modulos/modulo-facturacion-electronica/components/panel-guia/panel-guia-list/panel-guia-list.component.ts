import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ButtonAcces } from 'src/app/models/acceso-button.model';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';

import { IEntregaLocalElectronica } from '../../../interfaces/entrega.interface';
import { EntregaEnviarModel } from '../../../models/entrega.model';
import { EntregaService } from '../../../services/entrega.service';
import { PackingListService } from '../../../services/packingList.service';
import { FilterRequestModel } from 'src/app/models/filter-request.model';



@Component({
  selector: 'app-fac-panel-guia-list',
  templateUrl: './panel-guia-list.component.html',
  styleUrls: ['./panel-guia-list.component.css']
})
export class PanelGuiaListComponent implements OnInit {
  modeloForm: FormGroup;

  // Titulo del componente
  titulo = 'Guías';
  // Acceso de botones
  buttonAcces: ButtonAcces = new ButtonAcces();
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  // Opcion Buscar
  isDisplay: boolean = false;
  isDisplayVisor: boolean = false;
  isDisplayGenerandoVisor: boolean = false;

  isDataBlob: Blob;

  listEntrega: IEntregaLocalElectronica[];
  params: FilterRequestModel = new FilterRequestModel();

  columnas: any[];

  // Enviar
  entregaEnviarModel: EntregaEnviarModel = new EntregaEnviarModel();


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private entregaService: EntregaService,
    public lenguageService: LanguageService,
    private packingListService: PackingListService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService) {}

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
    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones('app-fac-panel-guia-list');

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
    this.params = this.modeloForm.getRawValue();
    this.entregaService.getListGuiaElectronicaByFechaAndNumero(this.params)
    .subscribe({ next:(data: IEntregaLocalElectronica[]) => {
        this.isDisplay = false;
        this.listEntrega = data;
      },error:(e)=>{
        this.isDisplay = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
    });
  }

  onToRowSelectEnviar(modelo: IEntregaLocalElectronica) {
    this.isDisplay = true;
    this.entregaEnviarModel.docEntry = modelo.docEntry;
    this.entregaService.setEnviarGuiaElectronica(this.entregaEnviarModel)
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

  onToRowSelectPrint(modelo: IEntregaLocalElectronica) {
    this.isDisplayGenerandoVisor = true;
    this.packingListService.getPackingListPdfByDocEntry(modelo.docEntry)
    .subscribe({next:(resp: any) => {
      switch (resp.type) {
        case HttpEventType.DownloadProgress:
          break;
        case HttpEventType.Response:
          this.isDataBlob = new Blob([resp.body], {type: resp.body.type});
          this.isDisplayGenerandoVisor = false;
          this.isDisplayVisor = true;
          break;
      }
      },error:(e)=>{
        this.isDisplayGenerandoVisor = false;
        this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
      }
  });
  }
}
