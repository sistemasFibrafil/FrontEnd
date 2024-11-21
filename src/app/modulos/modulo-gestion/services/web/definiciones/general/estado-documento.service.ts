import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { IEstadoDocumento } from 'src/app/modulos/modulo-gestion/interfaces/web/definiciones/general/estado-documento.interface';

@Injectable({providedIn: 'root'})
export class EstadoDocumentoService {
  constructor
  (
    private http: HttpClient
  ) { }

  getListAll() {
    return this.http.get<IEstadoDocumento[]>(`${environment.url_api_fib}EstadoDocumento/GetListAll/`);
  }
}
