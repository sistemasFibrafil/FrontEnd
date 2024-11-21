import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { ITipoDocumento } from '../../../interfaces/web/inicializacion-sistema/tipo-documento.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';



@Injectable({providedIn: 'root'})
export class TipoDocumentoService {
  constructor
  (
    private http: HttpClient
  ) { }

  getListByFiltro(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('id1', value.id1);
    params = params.append('id2', value.id2);
    params = params.append('text1', value.text1);
    return this.http.get<ITipoDocumento[]>(`${environment.url_api_fib}TipoDocumento/GetListByFiltro/`,{params: params});
  }
}
