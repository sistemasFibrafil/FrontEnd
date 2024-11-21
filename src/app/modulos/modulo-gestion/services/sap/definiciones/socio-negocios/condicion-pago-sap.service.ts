import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { ICondicionPagoSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/socio-negocios/condicion-pago-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';


@Injectable({providedIn: 'root'})
export class CondicionPagoSapService {
  constructor
  (
    private http: HttpClient
  ) { }

  getListByFiltro(value: FilterRequestModel) {
    debugger
    let params = new HttpParams();
    params = params.append('text1', value.text1);
    return this.http.get<ICondicionPagoSap[]>(`${environment.url_api_fib}CondicionPagoSap/GetListByFiltro/`,{params: params});
  }

  getById(id: number) {
    return this.http.get<ICondicionPagoSap>(`${environment.url_api_fib}CondicionPagoSap/GetById/${id}`);
  }
}
