import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { ISedeSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/inventario/sede-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';



@Injectable({providedIn: 'root'})
export class SedeSapService {
  constructor
  (
    private http: HttpClient
  )
  { }

  getListByFiltro(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('text1', value.text1);
    return this.http.get<ISedeSap[]>(`${environment.url_api_fib}SedeSap/GetListByFiltro`, { params: params });
  }
}
