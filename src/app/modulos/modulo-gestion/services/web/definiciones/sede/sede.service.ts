import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { ISede } from 'src/app/modulos/modulo-gestion/interfaces/web/definiciones/inventario/sede.interface';
import { SedeModel } from 'src/app/modulos/modulo-gestion/models/web/definiciones/inventario/sede.model';
import { FilterRequestModel } from 'src/app/models/filter-request.model';



@Injectable({providedIn: 'root'})
export class SedeService {
  constructor
  (
    private http: HttpClient
  )
  { }

  getListByFiltro(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('text1', value.text1);
    return this.http.get<ISede[]>(`${environment.url_api_fib}Sede/GetListByFiltro`, { params: params });
  }

  setAction(value: SedeModel) {
    const param: string = JSON.stringify(value);
    return this.http.post<any[]>(`${environment.url_api_fib}Sede/SetAction/`, param);
  }
}
