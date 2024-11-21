import Swal from 'sweetalert2';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';

import { IArticuloAlmacenSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/inventario/articulo-almacen-sap.interface';
import { AlmacenService } from 'src/app/modulos/modulo-gestion/services/sap/definiciones/inventario/almacen-sap.service';



@Component({
  selector: 'app-busqueda-almacen-stock-sap',
  templateUrl: './busqueda-almacen-stock-sap.component.html'
})
export class BusquedaAlmacenStockSapComponent implements OnInit {
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  isDisplay: Boolean = false;

  columnas: any[];
  lista: IArticuloAlmacenSap[] = [];

  @Input() whsCode: string;
  @Input() itemCode: string;

  @Output() eventoAceptar = new EventEmitter<IArticuloAlmacenSap>();
  @Output() eventoCancelar = new EventEmitter<IArticuloAlmacenSap>();
  @Output() eventoLimpiar = new EventEmitter<boolean>();

  constructor
  (
    private almacenService: AlmacenService
  ) { }

  ngOnInit(): void {
    this.onBuildColum();
    this.onListar();
  }

  onBuildColum() {
    this.columnas =
    [
      { field: 'whsCode',     header: 'Código' },
      { field: 'whsName',     header: 'Nombre' },
      { field: 'onHand',      header: 'Stock' },
      { field: 'isCommited',  header: 'Comprometido' },
      { field: 'onOrder',     header: 'Solicitado' },
      { field: 'available',   header: 'Disponible' },
    ];
  }

  onListar() {
    this.isDisplay = true;
    this.lista = [];
    const params: any = { code1: this.whsCode, code2: this.itemCode };
    this.almacenService.getListByWhsCodeAndItemCode(params)
    .subscribe({next:(data: IArticuloAlmacenSap[]) =>{
        this.isDisplay = false;
        this.lista = data;
      },error:(e)=>{
        this.lista = [];
        this.isDisplay = false;
        let swalWithBootstrapButtons = Swal.mixin({ customClass: { container: 'my-swal' }, target: document.getElementById('modal') });
        swalWithBootstrapButtons.fire(this.globalConstants.msgInfoSummary, e.error.resultadoDescripcion, 'error');
      }
    });
  }
}
