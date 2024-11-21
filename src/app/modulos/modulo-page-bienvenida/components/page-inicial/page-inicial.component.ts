import { Component, OnInit } from '@angular/core';
import { GlobalsConstantsForm } from 'src/app/constants/globals-constants-form';
import { Subscription } from 'rxjs';
import { SwaCustomService } from 'src/app/services/swa-custom.service';

import { IVentaProyeccionByFecha } from 'src/app/modulos/modulo-ventas/interfaces/factura-venta.interface';
import { FacturaVentaService } from 'src/app/modulos/modulo-ventas/services/sap/factura-venta-sap.service';


@Component({
  selector: 'app-page-inicial',
  templateUrl: './page-inicial.component.html',
  styleUrls: ['./page-inicial.component.css']
})
export class PageInicialComponent implements OnInit {
  subscription: Subscription;
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();


  // Modal
  isDisplay: boolean = false;
  isDashboard: boolean = false;


  data02: any;
  chartOpciones02:any;
  isDisplayUp: boolean = false;

  totalVentaMesAnioAnterior: number = 0;
  totalCuotaMesAnioAnterior: number = 0;
  totalVariacionMesAnioAnterior: number = 0;
  totalAvanceMesAnioAnterior: number = 0;

  totalVentaAnioAnterior: number = 0;
  totalCuotaAnioAnterior: number = 0;
  totalVariacionAnioAnterior: number = 0;
  totalAvanceAnioAnterior: number = 0;

  totalVentaMesAnterior: number = 0;
  totalCuotaMesAnterior: number = 0;
  totalVariacionMesAnterior: number = 0;
  totalAvanceMesAnterior: number = 0;

  totalVentaMesActual: number = 0;
  totalCuotaMesActual: number = 0;
  totalVariacionMesActual: number = 0;
  totalAvanceMesActual: number = 0;

  totalVentaAnioActual: number = 0;
  totalCuotaAnioActual: number = 0;
  totalVariacionAnioActual: number = 0;
  totalAvanceAnioActual: number = 0;


  lista: IVentaProyeccionByFecha[];

  constructor(
    private readonly swaCustomService: SwaCustomService,
    private facturaVentaService: FacturaVentaService) { }

  ngOnInit(): void {
    //this.onListar();
  }

  onListar() {
    this.isDisplay = true;
    this.lista = [];
    var param: any = { dat1: new Date(new Date().getFullYear(), new Date().getMonth(), 1), dat2: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0) };
    this.facturaVentaService.getListVentaProyeccionByFecha(param)
    .subscribe({next:(data: IVentaProyeccionByFecha[]) =>
    {
      this.lista = data;
      this.lista.forEach(item => {
        this.totalVentaMesAnioAnterior += item.ventaMesAnioAnterior;
        this.totalCuotaMesAnioAnterior += item.cuotaMesAnioAnterior;

        this.totalVentaAnioAnterior += item.ventaAnioAnterior;
        this.totalCuotaAnioAnterior += item.cuotaAnioAnterior;

        this.totalVentaMesAnterior += item.ventaMesAnterior;
        this.totalCuotaMesAnterior += item.cuotaMesAnterior;

        this.totalVentaMesActual += item.ventaMesActual;
        this.totalCuotaMesActual += item.cuotaMesActual;

        this.totalVentaAnioActual += item.ventaAnioActual;
        this.totalCuotaAnioActual += item.cuotaAnioActual;
      });

      this.totalVariacionMesAnioAnterior = (this.totalVentaMesAnioAnterior - this.totalCuotaMesAnioAnterior);
      this.totalAvanceMesAnioAnterior = (this.totalVentaMesAnioAnterior/this.totalCuotaMesAnioAnterior);

      this.totalVariacionAnioAnterior = (this.totalVentaAnioAnterior - this.totalCuotaAnioAnterior);
      this.totalAvanceAnioAnterior = (this.totalVentaAnioAnterior/this.totalCuotaAnioAnterior);

      this.totalVariacionMesAnterior = (this.totalVentaMesAnterior - this.totalCuotaMesAnterior);
      this.totalAvanceMesAnterior = (this.totalVentaMesAnterior/this.totalCuotaMesAnterior);

      this.totalVariacionMesActual = (this.totalVentaMesActual - this.totalCuotaMesActual);
      this.totalAvanceMesActual = (this.totalVentaMesActual/this.totalCuotaMesActual);

      this.totalVariacionAnioActual = (this.totalVentaAnioActual - this.totalCuotaAnioActual);
      this.totalAvanceAnioActual = (this.totalVentaAnioActual/this.totalCuotaAnioActual);

      this.isDisplay = false;
      this.isDashboard = true;
    },error:(e)=>{
      this.isDisplay = false;
      this.swaCustomService.swaMsgError(e.error.resultadoDescripcion);
    }
    });
  }
}
