import swal from 'sweetalert2';
import { read, utils } from 'xlsx';
import { Router } from '@angular/router';
import { FormBuilder} from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { LanguageService } from 'src/app/services/language.service';
import { SwaCustomService } from 'src/app/services/swa-custom.service';
import { UserContextService } from 'src/app/services/user-context.service';
import { AccesoOpcionesService } from 'src/app/services/acceso-opciones.service';

import { IForcastVenta } from '../../../interfaces/web/forcast-venta.interface';
import { ForcastventaImportModel } from '../../../models/web/forcast-venta.model';
import { ForCastVentaService } from '../../../services/web/forcast-venta.service';



@Component({
  selector: 'app-ven-panel-forcast-import',
  templateUrl: './panel-forcast-import.component.html',
  styleUrls: ['./panel-forcast-import.component.css']
})
export class PanelForcastImportComponent implements OnInit {
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  progress: number = 0;
  lista: any[];
  uploadFile: any[] = [];
  isEnvioArchivo: Boolean;
  isSaving: boolean = false;
  isDisplay: Boolean = false;
  listForcastVenta: IForcastVenta[];
  param: ForcastventaImportModel = new ForcastventaImportModel();
  fileString:any= "";

  @Output() eventoAceptar = new EventEmitter<boolean>();
  @Output() eventoCancelar = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public lenguageService: LanguageService,
    private userContextService: UserContextService,
    private forCastVentaService: ForCastVentaService,
    private readonly swaCustomService: SwaCustomService,
    private readonly accesoOpcionesService: AccesoOpcionesService
  ) {}

  ngOnInit() {
  }

  onToUpload(event, fileUpload) {
  }

  onChange(event:any) {
    debugger
    //this.lista = [];
    // let swalWithBootstrapButtons = swal.mixin({ customClass: { container: 'my-swal' }, target: document.getElementById('modal-import') });

    // if (event.files === undefined) {
    //   swalWithBootstrapButtons.fire(this.globalConstants.msgInfoSummary, 'Seleccione el archivo.', 'info');
    //   return;
    // }

    // if (event.files.length === 0) {
    //   swalWithBootstrapButtons.fire(this.globalConstants.msgInfoSummary, 'Seleccione el archivo.', 'info');
    //   return;
    // }

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];

      if (file) {
          const fileReader = new FileReader();
          fileReader.onload = () => {
            const fileContent = fileReader.result as string;
            const rows = fileContent.split('');
            const csvData: any[] = [];

            for (let i = 0; i < rows.length; i++) {
                const columns = rows[i].split(',');
                csvData.push(columns);
            }
            console.log(csvData);
          };
          fileReader.readAsText(file);
      }
    });


20
    // const reader = new FileReader();
    // reader.onload = (event: any) => {
    //   const wb = read(event.target.result);
    //   const sheets = wb.SheetNames;
    //   if (sheets.length) {
    //     const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
    //     this.lista = rows;
    //     console.log("TABLA: ",this.lista);
    //     this.onToImport();
    //   }
    // }
    // reader.readAsArrayBuffer(file);
    // fileUpload.clear();
  }

  onToImport() {
    console.log("TABLA 2: ",this.lista);
    this.isSaving = true;
    this.param = { idUsuario: this.userContextService.getIdUsuario() , item: this.lista };
    let swalWithBootstrapButtons = swal.mixin({ customClass: { container: 'my-swal' }, target: document.getElementById('modal-import') });

    this.forCastVentaService.setImport(this.param)
    .subscribe({ next: (data:any)=>{
        this.isSaving = false;
        swalWithBootstrapButtons.fire(this.globalConstants.msgInfoSummary,'', 'success');
      },
      error:(e)=>{
        this.isSaving = false;
        swalWithBootstrapButtons.fire(this.globalConstants.msgInfoSummary, e.error.resultadoDescripcion, 'error');
      }
    });

  }

  onToCancelUpload(fileUpload) {
    fileUpload.clear();
    this.eventoCancelar.emit(false);
  }
}
