import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { ISerieNumeracion } from '../../../interfaces/web/inicializacion-sistema/serie-numeracion.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';



@Injectable({providedIn: 'root'})
export class FormularioService {
  constructor
  (
    private http: HttpClient
  ) { }

  getListByFiltro(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('text1', value.text1);
    return this.http.get<ISerieNumeracion[]>(`${environment.url_api_fib}Formulario/GetListByFiltro/`,{params: params});
  }
}
