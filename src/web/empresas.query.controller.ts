import { Controller, Get, Query } from '@nestjs/common';
import {
  DistribuicaoCnaePorAnoFundacaoQuery,
  DistribuicaoCnaePorInstitutoQuery,
  DistribuicaoCnaeQuery,
  DistribuicaoGeneroPorAnoFundacaoQuery,
  DistribuicaoGeneroPorInstitutoQuery,
  DistribuicaoGeneroQuery,
  DistribuicaoInstitutoPorCnaeQuery,
  FaturamentoQuery,
} from '@dnausp/core';
import { FilterEmpresaPipe } from './pipes/filter-empresa.pipe';

@Controller('empresas/query')
export class EmpresasQueryController {
  constructor(
    private distribuicaoCnae: DistribuicaoCnaeQuery,
    private distribuicaoCnaePorAnoFundacao: DistribuicaoCnaePorAnoFundacaoQuery,
    private distribuicaoCnaePorInstituto: DistribuicaoCnaePorInstitutoQuery,
    private distribuicaoGenero: DistribuicaoGeneroQuery,
    private distribuicaoGeneroPorAnoFundacao: DistribuicaoGeneroPorAnoFundacaoQuery,
    private distribuicaoGeneroPorInstituto: DistribuicaoGeneroPorInstitutoQuery,
    private distribuicaoInstitutoPorCnae: DistribuicaoInstitutoPorCnaeQuery,
    private faturamento: FaturamentoQuery,
  ) {}

  @Get()
  getRoot(@Query(FilterEmpresaPipe) filter) {
    return this.distribuicaoCnae.execute(filter);
  }

  @Get('distribuicao-cnae')
  getDistribuicaoCnae(@Query(FilterEmpresaPipe) filter) {
    return this.distribuicaoCnae.execute(filter);
  }

  @Get('distribuicao-cnae-por-ano-fundacao')
  getDistribuicaoCnaePorAnoFundacao() {
    return this.distribuicaoCnaePorAnoFundacao.execute();
  }

  @Get('distribuicao-cnae-por-instituto')
  getDistribuicaoCnaePorInstituto() {
    return this.distribuicaoCnaePorInstituto.execute();
  }

  @Get('distribuicao-genero')
  getDistribuicaoGenero() {
    return this.distribuicaoGenero.execute();
  }

  @Get('distribuicao-genero-por-ano-fundacao')
  getDistribuicaoGeneroPorAnoFundacao() {
    return this.distribuicaoGeneroPorAnoFundacao.execute();
  }

  @Get('distribuicao-genero-por-instituto')
  getDistribuicaoGeneroPorInstituto() {
    return this.distribuicaoGeneroPorInstituto.execute();
  }

  @Get('distribuicao-instituto-por-cnae')
  getDistribuicaoInstitutoPorCnae() {
    return this.distribuicaoInstitutoPorCnae.execute();
  }

  @Get('faturamento')
  getFaturamento(@Query(FilterEmpresaPipe) filter) {
    return this.faturamento.execute(filter);
  }
}
