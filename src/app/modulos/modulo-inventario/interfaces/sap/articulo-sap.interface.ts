export interface IArticuloSap {
  itemCode        : string;
  itemName        : string;
  dfltWH          : string;
  whsCode         : string;
  whsName         : string;
  buyUnitMsr      : string;
  salUnitMsr      : string;
  invntryUom      : string;
  onHand          : number;
  isCommited      : number;
  onOrder         : number;
  available       : number;
  pesoPromedioKg  : number;
  pesoKg          : number;
  statusCode      : string;
  statusName      : string;
  fecProduccion?  : Date;
}

export interface IMovimientoStockByFechaSede {
  nomTipoMovimiento: string;
  numeroGuiaSAP: number;
  numeroGuiaSUNAT: string;
  docDate: Date;
  cardCode: string;
  cardName: string;
  usuario: string;
  itemCode: string;
  itemName: string;
  sede: string;
  centroCosto: string;
  almacenOrigen: string;
  almacenDestino: string;
  bulto: number;
  totalKg: number;
  unidadMedida: string;
  quantity: number;
  numeroPedido: number;
  fechaPedido: Date;
  numeroFacturaSAP: number;
  numeroFacturaSUNAT: string;
  nomTransportista: string;
  rucTransportista: string;
  placaTransportista: string;
  nomConductor: string;
  lincenciaConductor: string;
}

export interface IArticuloVentaStockByGrupoSubGrupo {
  itemCode: string;
  itemName: string;
  nomGrupo: string;
  nomSubGrupo: string;
  nomSubGrupo2: string;
  unidadVenta: string;
  stock: number;
  comprometido: number;
  solicitado: number;
  disponible: number;
  pesoPromedioKg: number;
}

export interface IArticuloVentaByGrupoSubGrupoEstado {
  itemCode: string;
  itemName: string;
  nomGrupo: string;
  nomSubGrupo: string;
  nomSubGrupo2: string;
  nomEstado: string;
  unidadVenta: string;
  pesoItem: number;
  pesoPromedioKg: number;
}

export interface IArticuloDocumentoSap {
  itemCode        : string;
  itemName        : string;
  dfltWH          : string;
  buyUnitMsr      : string;
  salUnitMsr      : string;
  invntryUom      : string;
  onHand          : number;
  quantity        : number;
  openQty         : number;
  openQtyRead     : number;
  currency        : string;
  priceBefDi      : number;
  discPrcnt       : number;
  price           : number;
  taxCode         : string;
  vatPrcnt        : number;
  lineTotal       : number;
  vatSum          : number;
}
