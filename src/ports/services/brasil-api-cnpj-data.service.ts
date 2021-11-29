import { Injectable } from '@nestjs/common';
import { CNPJ } from '../../domain/cnpj';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class BrasilApiCnpjDataService {
  private static readonly URL = 'https://brasilapi.com.br/api';

  constructor(private readonly http: HttpService) {}

  getCnpjData(cnpj: CNPJ) {
    return lastValueFrom(
      this.http
        .get(`${BrasilApiCnpjDataService.URL}/cnpj/v1/${cnpj.get()}`)
        .pipe(map((res) => res.data as BrasilApiCnpjData)),
    );
  }
}

export interface BrasilApiCnaeSecundario {
  codigo: number;
  descricao: string;
}

export interface BrasilApiQsa {
  identificador_de_socio: number;
  nome_socio: string;
  cnpj_cpf_do_socio: string;
  codigo_qualificacao_socio: number;
  percentual_capital_social: number;
  data_entrada_sociedade: string;
  cpf_representante_legal?: any;
  nome_representante_legal?: any;
  codigo_qualificacao_representante_legal?: any;
}

export interface BrasilApiCnpjData {
  cnpj: string;
  identificador_matriz_filial: number;
  descricao_matriz_filial: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: number;
  descricao_situacao_cadastral: string;
  data_situacao_cadastral: string;
  motivo_situacao_cadastral: number;
  nome_cidade_exterior?: any;
  codigo_natureza_juridica: number;
  data_inicio_atividade: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  descricao_tipo_logradouro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: number;
  uf: string;
  codigo_municipio: number;
  municipio: string;
  ddd_telefone_1: string;
  ddd_telefone_2?: any;
  ddd_fax?: any;
  qualificacao_do_responsavel: number;
  capital_social: number;
  porte: number;
  descricao_porte: string;
  opcao_pelo_simples: boolean;
  data_opcao_pelo_simples?: any;
  data_exclusao_do_simples?: any;
  opcao_pelo_mei: boolean;
  situacao_especial?: any;
  data_situacao_especial?: any;
  cnaes_secundarios: BrasilApiCnaeSecundario[];
  qsa: BrasilApiQsa[];
}
