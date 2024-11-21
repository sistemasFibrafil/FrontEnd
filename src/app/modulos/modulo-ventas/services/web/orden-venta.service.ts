import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';

import { IOrdenVenta } from '../../interfaces/orden-venta.interface';
import { OrdenVentaCreateModel } from '../../models/orden-venta.model';



@Injectable({providedIn: 'root'})
export class OrdenVentaService {
  constructor
  (
    private http: HttpClient,
    private datePipe: DatePipe
  ){ }

  getNumero() {
    return this.http.get<IOrdenVenta>(`${environment.url_api_fib}OrdenVenta/GetNumero/`);
  }

  setCreate(value: OrdenVentaCreateModel) {
    const param: string = JSON.stringify(value);

    if(value.idOrdenVenta == 0 || value.idOrdenVenta === undefined)
    {
        return this.http.post(`${environment.url_api_fib}OrdenVenta/SetCreate/`, param);
    }
    else
    {
      return this.http.put(`${environment.url_api_fib}OrdenVenta/SetUpdate/`, param);
    }
  }

}
