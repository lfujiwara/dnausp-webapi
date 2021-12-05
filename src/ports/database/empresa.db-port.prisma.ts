import {
  Empresa as PrismaEmpresa,
  Faturamento as PrismaFaturamento,
  Prisma,
  PrismaClient,
} from '@prisma/client';
import { Injectable, Optional } from '@nestjs/common';
import { CNAE, CNPJ, Empresa, EmpresaDbPort, Faturamento } from '@dnausp/core';
import { Result } from 'typescript-monads';

@Injectable()
export class EmpresaDbPortPrisma extends EmpresaDbPort {
  constructor(@Optional() readonly client: PrismaClient = new PrismaClient()) {
    super();
  }

  static empresaToDb(empresa: Empresa): Prisma.EmpresaCreateInput & {
    faturamentos: Prisma.FaturamentoCreateWithoutEmpresaInput[];
  } {
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
      faturamentos: empresa.faturamentos.map((f) => ({
        anoFiscal: f.anoFiscal,
        valor: f.valor,
      })),
    };
  }

  static empresaFromDb(
    empresa: PrismaEmpresa & { faturamentos: PrismaFaturamento[] },
  ): Empresa {
    return new Empresa({
      ...empresa,
      cnpj: empresa.cnpj && new CNPJ(empresa.cnpj),
      atividadePrincipal:
        empresa.atividadePrincipal && new CNAE(empresa.atividadePrincipal),
      atividadeSecundaria:
        (empresa.atividadesSecundarias &&
          empresa.atividadesSecundarias.map((as) => new CNAE(as))) ||
        [],
      faturamentos: empresa.faturamentos.map(
        ({ valor, anoFiscal }: PrismaFaturamento) =>
          new Faturamento(Number(valor), anoFiscal),
      ),
    });
  }

  async addFaturamentoToEmpresa(
    empresaId: string,
    faturamento: Faturamento[],
  ): Promise<Result<Empresa, string>> {
    await this.client.faturamento.createMany({
      data: faturamento.map((f) => ({
        empresaId,
        valor: f.valor,
        anoFiscal: f.anoFiscal,
      })),
    });

    const empresa = await this.client.empresa.findFirst({
      where: { id: empresaId },
      include: { faturamentos: true },
    });

    return Result.ok(EmpresaDbPortPrisma.empresaFromDb(empresa));
  }

  getEmpresa(id: string): Promise<Result<Empresa, string>> {
    return this.client.empresa
      .findFirst({ where: { id }, include: { faturamentos: true } })
      .then((empresa) =>
        empresa
          ? Result.ok(EmpresaDbPortPrisma.empresaFromDb(empresa))
          : Result.fail('Empresa não encontrada'),
      );
  }

  async upsertEmpresa(empresa: Empresa): Promise<Result<Empresa, string>> {
    const toDB = EmpresaDbPortPrisma.empresaToDb(empresa);

    try {
      const inDB = await this.client.empresa.findFirst({
        where: {
          OR: [{ cnpj: toDB.cnpj }, { idEstrangeira: toDB.idEstrangeira }],
        },
      });

      let fromDBData: PrismaEmpresa & { faturamentos: PrismaFaturamento[] };

      if (inDB) {
        toDB.id = undefined;
        fromDBData = await this.client.empresa.update({
          where: {
            id: inDB.id,
          },
          data: {
            ...toDB,
            faturamentos: {
              deleteMany: {
                empresaId: {
                  not: undefined,
                },
              },
              createMany: {
                data: toDB.faturamentos,
              },
            },
          },
          include: {
            faturamentos: true,
          },
        });
      } else
        fromDBData = await this.client.empresa.create({
          data: {
            ...toDB,
            faturamentos: {
              createMany: {
                data: toDB.faturamentos,
              },
            },
          },
          include: { faturamentos: true },
        });

      const fromDB = EmpresaDbPortPrisma.empresaFromDb(fromDBData);
      return Result.ok(fromDB);
    } catch (err) {
      return Result.fail(err?.toString());
    }
  }

  async removeFaturamentoFromEmpresa(
    empresaId: string,
    anosFiscais: number[],
  ): Promise<Result<Empresa, string>> {
    await this.client.faturamento.deleteMany({
      where: {
        empresaId,
        anoFiscal: {
          in: anosFiscais,
        },
      },
    });

    const empresa = await this.client.empresa.findFirst({
      where: { id: empresaId },
      include: { faturamentos: true },
    });

    return Result.ok(EmpresaDbPortPrisma.empresaFromDb(empresa));
  }
}
