import { EmpresaDbPort } from '../../app/database/empresa.db-port';
import { Empresa } from '../../domain/empresa';
import { Result } from 'typescript-monads';
import { CNPJ } from '../../domain/cnpj';
import { CNAE } from '../../domain/cnae';
import { Empresa as PrismaEmpresa, Prisma, PrismaClient } from '@prisma/client';

export class EmpresaDbPortPrisma extends EmpresaDbPort {
  constructor(readonly client: PrismaClient = new PrismaClient()) {
    super();
  }

  static empresaToDb(empresa: Empresa): Prisma.EmpresaCreateInput {
    return {
      id: empresa.id,
      anoFundacao: empresa.anoFundacao,
      atividadePrincipal: empresa.atividadePrincipal.get(),
      atividadesSecundarias: empresa.atividadeSecundaria.map((as) => as.get()),
      cnpj: empresa.cnpj.get(),
      estrangeira: empresa.estrangeira,
      idEstrangeira: empresa.idEstrangeira,
      nomeFantasia: empresa.nomeFantasia,
      razaoSocial: empresa.razaoSocial,
      situacao: empresa.situacao,
    };
  }

  static empresaFromDb(empresa: PrismaEmpresa): Empresa {
    return new Empresa({
      ...empresa,
      cnpj: empresa.cnpj && new CNPJ(empresa.cnpj),
      atividadePrincipal:
        empresa.atividadePrincipal && new CNAE(empresa.atividadePrincipal),
      atividadeSecundaria:
        (empresa.atividadesSecundarias &&
          empresa.atividadesSecundarias.map((as) => new CNAE(as))) ||
        [],
    });
  }

  async upsertEmpresa(empresa: Empresa): Promise<Result<Empresa, string>> {
    const toDB = EmpresaDbPortPrisma.empresaToDb(empresa);

    try {
      const inDB = await this.client.empresa.findFirst({
        where: {
          OR: [{ cnpj: toDB.cnpj }, { idEstrangeira: toDB.idEstrangeira }],
        },
      });

      let fromDBData: PrismaEmpresa;

      if (inDB) {
        toDB.id = undefined;
        fromDBData = await this.client.empresa.update({
          where: {
            id: inDB.id,
          },
          data: toDB,
        });
      } else fromDBData = await this.client.empresa.create({ data: toDB });

      const fromDB = EmpresaDbPortPrisma.empresaFromDb(fromDBData);
      return Result.ok(fromDB);
    } catch (err) {
      return Result.fail(err?.toString());
    }
  }
}
