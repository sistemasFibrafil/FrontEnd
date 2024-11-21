import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';

import { IDireccionSap } from '../interfaces/direccion.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';



@Injectable({providedIn: 'root'})
export class DireccionSapService {
  constructor
  (
    private http: HttpClient
  ) { }


  getListByFiltro(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('text1', value.text1);

    return this.http.get<IDireccionSap[]>(`${environment.url_api_fib}DireccionSap/GetListByFiltro/`,{params: params});
  }

  getByCode(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('cod3', value.cod3);

    return this.http.get<IDireccionSap>(`${environment.url_api_fib}DireccionSap/GetByCode/`,{params: params});
  }
}
