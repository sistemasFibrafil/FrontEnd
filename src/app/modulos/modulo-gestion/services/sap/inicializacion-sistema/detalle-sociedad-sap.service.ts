import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { IDetalleSociedadSap } from '../../../interfaces/sap/inicializacion-sistema/detalle-sociedad-sap.interface';

@Injectable({providedIn: 'root'})
export class DetalleSociedadSapService {
  constructor
  (
    private http: HttpClient
  ) { }

  getDetalleSociedad() {
    return this.http.get<IDetalleSociedadSap>(`${environment.url_api_fib}DetalleSociedadSap/GetDetalleSociedad/`);
  }
}
