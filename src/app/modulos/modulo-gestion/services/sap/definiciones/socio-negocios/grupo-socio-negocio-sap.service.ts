import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { IGrupoSocioNegocioSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/socio-negocios/grupo-socio-negocio.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';



@Injectable({providedIn: 'root'})
export class GrupoSocionegocioSapService {
  constructor
  (
    private http: HttpClient
  ) { }

  getListByGroupType(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    return this.http.get<IGrupoSocioNegocioSap[]>(`${environment.url_api_fib}GrupoSocioNegocioSap/GetListByGroupType/`,{params: params});
  }
}
