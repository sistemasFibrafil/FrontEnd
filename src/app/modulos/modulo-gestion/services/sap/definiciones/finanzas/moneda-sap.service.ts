import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { IMonedaSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/finanzas/moneda-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';



@Injectable({providedIn: 'root'})
export class MonedaSapService {
  constructor
  (
    private http: HttpClient
  ) { }

  getListByFiltro(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('text1', value.text1);

    return this.http.get<IMonedaSap[]>(`${environment.url_api_fib}MonedaSap/GetListByFiltro/`, { params: params });
  }

  getByCode(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);

    return this.http.get<IMonedaSap>(`${environment.url_api_fib}MonedaSap/GetByCode/`, { params: params });
  }
}