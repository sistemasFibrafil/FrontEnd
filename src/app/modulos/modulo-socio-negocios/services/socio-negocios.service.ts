import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ISocioNegocio } from '../interfaces/socio-segocio.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';



@Injectable({providedIn: 'root'})
export class SocioNegocioSapService {
  constructor
  (
    private http: HttpClient
  ) { }

  getListByFiltro(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('text1', value.text1);
    return this.http.get<ISocioNegocio[]>(`${environment.url_api_fib}SocioNegocioSap/GetListByFiltro/`,{params: params});
  }

  getByCardCode(cardCode: string) {
    let params = new HttpParams();
    params = params.append('cardCode', cardCode);
    return this.http.get<ISocioNegocio>(`${environment.url_api_fib}SocioNegocioSap/GetByCardCode/`,{params: params});
  }

  getLitClienteBySectorEstado(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('text1', value.text1);

    return this.http.get<ISocioNegocio[]>(`${environment.url_api_fib}SocioNegocioSap/GetLitClienteBySectorEstado/`,{params: params});
  }

  getLitClienteExcelBySectorEstado(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('text1', value.text1);

    return this.http.get(`${environment.url_api_fib}SocioNegocioSap/GetClienteExcelBySectorEstado/`,{params: params, responseType: 'arraybuffer'});
  }
}
