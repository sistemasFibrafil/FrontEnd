import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { IDocumento } from 'src/app/modulos/modulo-ventas/interfaces/documento.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';



@Injectable({providedIn: 'root'})
export class DocumentoLecturaSapService {
  constructor
  (
    private http: HttpClient
  ) { }

  getListDocumentoPendienteByObjTypeAndCardCode(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);

    return this.http.get<IDocumento[]>(`${environment.url_api_fib}DocumentoLecturaSap/GetListPendienteByObjTypeAndCardCode/`,{params: params});
  }
}
