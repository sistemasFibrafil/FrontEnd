import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { ISerieNumeracionSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/inicializacion-sistema/serie-numeracion-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';



@Injectable({providedIn: 'root'})
export class SerieNumeracionSapService {
  constructor
  (
    private http: HttpClient
  ) { }

  getListByFiltro(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('text1', value.text1);
    return this.http.get<ISerieNumeracionSap[]>(`${environment.url_api_fib}SerieNumeracionSap/GetListByFiltro/`,{params: params});
  }

  getNumDocumentoByTipoAndSerie(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    return this.http.get<ISerieNumeracionSap>(`${environment.url_api_fib}SerieNumeracionSap/GetNumDocumentoByTipoAndSerie/`,{params: params});
  }
}
