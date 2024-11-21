import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { IAlmacenSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/inventario/almacen-sap.interface';
import { IArticuloAlmacenSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/inventario/articulo-almacen-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';



@Injectable({providedIn: 'root'})
export class AlmacenService {
  constructor
  (
    private http: HttpClient
  ) { }

  getListAlmacenProduccion() {
    return this.http.get<IAlmacenSap[]>(`${environment.url_api_fib}AlmacenSap/GetListAlmacenProduccion/`);
  }

  getByCode(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    return this.http.get<IAlmacenSap>(`${environment.url_api_fib}AlmacenSap/GetByCode/`, {params: params});
  }

  getListByFiltro(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('cod3', value.cod3);
    params = params.append('text1', value.text1);

    return this.http.get<IAlmacenSap[]>(`${environment.url_api_fib}AlmacenSap/GetListByFiltro/`, {params: params});
  }

  getListByEstado(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    return this.http.get<IAlmacenSap[]>(`${environment.url_api_fib}AlmacenSap/GetListByEstado/`, {params: params});
  }

  getListByWhsCodeAndItemCode(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);

    return this.http.get<IArticuloAlmacenSap[]>(`${environment.url_api_fib}AlmacenSap/GetListByWhsCodeAndItemCode/`, {params: params});
  }
}
