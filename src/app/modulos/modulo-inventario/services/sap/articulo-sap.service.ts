import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';

import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { IArticuloDocumentoSap, IArticuloSap, IArticuloVentaByGrupoSubGrupoEstado, IArticuloVentaStockByGrupoSubGrupo, IMovimientoStockByFechaSede } from '../../interfaces/articulo-sap.interface';
import { ArticuloSapForSodimacBySkuModel } from '../../models/articulo.model';


@Injectable({providedIn: 'root'})
export class ArticuloSapService {
  constructor
  (
    private http: HttpClient,
    private datePipe: DatePipe
  ) { }

  getListByFiltro(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('cod3', value.cod3);
    params = params.append('text1', value.text1);

    return this.http.get<IArticuloSap[]>(`${environment.url_api_fib}ArticuloSap/GetListByFiltro/`,{params: params});
  }

  getByCode(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    return this.http.get<IArticuloSap>(`${environment.url_api_fib}ArticuloSap/GetByCode/`,{params: params});
  }

  getListStockGeneralByAlmacen(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('val1', value.val1.toString());
    params = params.append('val2', value.val2.toString());
    params = params.append('text1', value.text1);
    return this.http.get<IArticuloSap[]>(`${environment.url_api_fib}ArticuloSap/GetListStockGeneralByAlmacen/`,{params: params});
  }

  getStockGeneralByAlmacenExcel(value: FilterRequestModel){
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('val1', value.val1.toString());
    params = params.append('val2', value.val2.toString());
    params = params.append('text1', value.text1);

    return this.http.get(`${environment.url_api_fib}ArticuloSap/GetStockGeneralByAlmacenExcel/`,{params: params, responseType: 'arraybuffer'});
  }

  getListStockGeneralDetalladoAlmacenByAlmacen(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('val1', value.val1.toString());
    params = params.append('val2', value.val2.toString());
    params = params.append('text1', value.text1);
    return this.http.get<IArticuloSap[]>(`${environment.url_api_fib}ArticuloSap/GetListStockGeneralDetalladoAlmacenByAlmacen/`,{params: params});
  }

  getStockGeneralDetalladoAlmacenByAlmacenExcel(value: FilterRequestModel){
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('val1', value.val1.toString());
    params = params.append('val2', value.val2.toString());
    params = params.append('text1', value.text1);

    return this.http.get(`${environment.url_api_fib}ArticuloSap/GetStockGeneralDetalladoAlmacenByAlmacenExcel/`,{params: params, responseType: 'arraybuffer'});
  }

  getListArticuloVentaByGrupoSubGrupoEstado(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('cod3', value.cod3);
    params = params.append('cod4', value.cod4);

    return this.http.get<IArticuloVentaByGrupoSubGrupoEstado[]>(`${environment.url_api_fib}ArticuloSap/GetListArticuloVentaByGrupoSubGrupoEstado/`,{params: params});
  }

  getArticuloVentaExcelByGrupoSubGrupoEstado(value: FilterRequestModel){
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('cod3', value.cod3);
    params = params.append('cod4', value.cod4);

    return this.http.get(`${environment.url_api_fib}ArticuloSap/GetArticuloVentaExcelByGrupoSubGrupoEstado/`,{params: params, responseType: 'arraybuffer'});
  }

  getListArticuloVentaStockByGrupoSubGrupo(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('cod3', value.cod3);

    return this.http.get<IArticuloVentaStockByGrupoSubGrupo[]>(`${environment.url_api_fib}ArticuloSap/GetListArticuloVentaStockByGrupoSubGrupo/`,{params: params});
  }

  getArticuloVentaStockExcelByGrupoSubGrupo(value: FilterRequestModel){
    let params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('cod3', value.cod3);

    return this.http.get(`${environment.url_api_fib}ArticuloSap/GetArticuloVentaStockExcelByGrupoSubGrupo/`,{params: params, responseType: 'arraybuffer'});
  }

  getListMovimientoStockByFechaSede(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('text1', value.text1);

    return this.http.get<IMovimientoStockByFechaSede[]>(`${environment.url_api_fib}ArticuloSap/GetListMovimientoStockByFechaSede/`,{params: params});
  }

  getMovimientoStockExcelByFechaSede(value: FilterRequestModel){
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('text1', value.text1);

    return this.http.get(`${environment.url_api_fib}ArticuloSap/GetMovimientoStockExcelByFechaSede/`,{params: params, responseType: 'arraybuffer'});
  }

  getArticuloForOrdenVentaSodimacBySku(value: ArticuloSapForSodimacBySkuModel) {
    const param: string = JSON.stringify(value);
    return this.http.post<any[]>(`${environment.url_api_fib}ArticuloSap/GetArticuloForOrdenVentaSodimacBySku/`,param);
  }

  getArticuloVentaByCode(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('id1', value.id1.toString());
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('cod3', value.cod3);

    return this.http.get<IArticuloDocumentoSap>(`${environment.url_api_fib}ArticuloSap/GetArticuloVentaByCode/`,{params: params});
  }
}
