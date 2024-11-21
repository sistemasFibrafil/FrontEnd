import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { ITablaDefinidaUsuarioSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/general/tabla-definida-usuario-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';



@Injectable({providedIn: 'root'})
export class TablaDefinidaUsuarioSapService {
  constructor
  (
    private http: HttpClient
  ) { }

  getListByFiltro(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('text1', value.text1);
    return this.http.get<ITablaDefinidaUsuarioSap[]>(`${environment.url_api_fib}TablaDefinidaUsuarioSap/GetListByFiltro/`,{params: params});
  }

  getByCode(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('cod3', value.cod3);
    return this.http.get<ITablaDefinidaUsuarioSap>(`${environment.url_api_fib}TablaDefinidaUsuarioSap/GetByCode/`,{params: params});
  }
}
