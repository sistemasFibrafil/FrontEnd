import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { IEmpleadoVentaSap } from 'src/app/modulos/modulo-gestion/interfaces/sap/definiciones/general/empleado-venta.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';



@Injectable({providedIn: 'root'})
export class EmpleadoVentaSapService {
  constructor
  (
    private http: HttpClient
  ) { }

  getList() {
    return this.http.get<IEmpleadoVentaSap[]>(`${environment.url_api_fib}EmpleadoVentaSap/GetList/`);
  }

  getListByFiltro(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('text1', value.text1);
    return this.http.get<IEmpleadoVentaSap[]>(`${environment.url_api_fib}EmpleadoVentaSap/GetListByFiltro/`, {params: params});
  }

  getByCode(id: number) {
    return this.http.get<IEmpleadoVentaSap>(`${environment.url_api_fib}EmpleadoVentaSap/GetById/${id}`);
  }
}
