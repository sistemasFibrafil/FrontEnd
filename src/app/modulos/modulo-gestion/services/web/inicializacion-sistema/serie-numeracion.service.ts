import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { ISerieNumeracion } from '../../../interfaces/web/inicializacion-sistema/serie-numeracion.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { SerieNumeracionModel } from '../../../models/web/inicializacion-sistema/serie-numero.model';



@Injectable({providedIn: 'root'})
export class SerieNumeracionService {
  constructor
  (
    private http: HttpClient
  ) { }

  getListByFiltro(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('id1', value.id1);
    params = params.append('id2', value.id2);
    params = params.append('text1', value.text1);
    return this.http.get<ISerieNumeracion[]>(`${environment.url_api_fib}SerieNumeracion/GetListByFiltro/`,{params: params});
  }

  setAction(value: SerieNumeracionModel) {
    const param: string = JSON.stringify(value);
    return this.http.post<any[]>(`${environment.url_api_fib}SerieNumeracion/SetAction/`, param);
  }
}
