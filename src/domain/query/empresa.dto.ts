export class EmpresaDto {
  id: string;
  idEstrangeira?: number;
  estrangeira: boolean;
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  anoFundacao?: number;
  atividadePrincipal?: string;
  atividadeSecundaria: string[];
  situacao?: string;

  constructor(
    id,
    idEstrangeira,
    estrangeira,
    cnpj,
    razaoSocial,
    nomeFantasia,
    anoFundacao,
    atividadePrincipal,
    atividadeSecundaria,
    situacao,
  ) {
    this.id = id;
    this.idEstrangeira = idEstrangeira;
    this.estrangeira = estrangeira;
    this.cnpj = cnpj;
    this.razaoSocial = razaoSocial;
    this.nomeFantasia = nomeFantasia;
    this.anoFundacao = anoFundacao;
    this.atividadePrincipal = atividadePrincipal;
    this.atividadeSecundaria = atividadeSecundaria;
    this.situacao = situacao;
  }
}
