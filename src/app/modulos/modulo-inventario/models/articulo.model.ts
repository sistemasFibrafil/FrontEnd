export class ArticuloFiltroFindModel {
  itemCode: string;
  itemName: string;

  constructor(){
      this.itemCode = '';
      this.itemName = '';
  }
}


export class ArticuloVentaByGrupoSubGrupoEstadoFindModel {
  grupo: string;
  subGrupo: string;
  subGrupo2: string;
  estado: string;

  constructor(){
      this.grupo = '';
      this.subGrupo = '';
      this.subGrupo2 = '';
      this.estado = '';
  }
}


export class ArticuloSapForSodimacBySkuModel {
  linea                           : ArticuloSapForSodimacBySkuItemModel[];

  constructor(){
      this.linea                  = [];
  }
}

export class ArticuloSapForSodimacBySkuItemModel {
  line                           : number;
  numLocal                       : number;
  nomLocal                       : string;
  codEstado                      : string;
  sku                            : string;
  dscriptionLarga                : string;
  ean                            : string;
  quantity                       : number;

  constructor(){
      this.line                  = 0;
      this.numLocal              = 0;
      this.nomLocal              = '';
      this.codEstado             = '';
      this.sku                   = '';
      this.dscriptionLarga       = '';
      this.ean                   = '';
      this.quantity              = 0;
  }
}



