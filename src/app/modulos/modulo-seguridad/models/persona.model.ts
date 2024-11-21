import { UsuarioModel } from './usuario.model';
export class PersonaModel {
    idPersona?: number;
    nombre: string;
    usuario?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    nombreCompleto?: string;
    nroDocumento?: string;
    nroTelefono?: string;
    codSede?: number;
    nomSede?: string
    flgActivo?: boolean;
    codCentroCosto?: string;
    desCentroCosto?: string;
    descripcionPerfil?: string;
    entidadUsuario?: UsuarioModel;
    codCentro?: string;
    desCentro?: string;
    // Auditoria
    regUsuario?: number;
    regEstacion?: string;

    constructor(){
        this.idPersona = 0;
        this.nombre = '';
        this.usuario = '';
        this.apellidoPaterno = '';
        this.apellidoMaterno = '';
        this.nombreCompleto = '';
        this.nroDocumento = '';
        this.nroTelefono = '';
        this.codCentroCosto = '';
        this.desCentroCosto = '';
        this.codSede = null;
        this.nomSede = '';
        this.flgActivo = true;
        this.descripcionPerfil = '';
        this.codCentro = '';
        this.desCentro = '';
        this.regUsuario = 0;
        this.regEstacion = '';
    }
}
