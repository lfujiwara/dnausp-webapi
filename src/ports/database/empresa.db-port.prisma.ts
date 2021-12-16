import { PrismaClient } from '@prisma/client';
import { Injectable, Optional } from '@nestjs/common';
import { CNPJ, Empresa, EmpresaDbPort } from '@dnausp/core';
import { Result } from 'typescript-monads';
import { EmpresaJsonSerializer } from '../serializers/json/empresa.json-serializer';
import { prismaClient } from './queries/prisma';
import { HistoricoFaturamentosJsonSerializer } from '../serializers/json/historico-faturamentos.json-serializer';
import { InvestimentosJsonSerializer } from '../serializers/json/investimentos.json-serializer';
import { HistoricoQuadroDeColaboradoresJsonSerializer } from '../serializers/json/historico-quadro-de-colaboradores.json-serializer';
import { IncubacaoJsonSerializer } from '../serializers/json/incubacao.json-serializer';
import { SocioJsonSerializer } from '../serializers/json/socio.json-serializer';
import { GenderInferrerService } from '../gender-inferrer/gender-inferrer.service';

const include = {
  historicoFaturamentos: true,
  historicoInvestimentos: true,
  historicoQuadroDeColaboradores: true,
  incubacoes: true,
  socios: true,
};

@Injectable()
export class EmpresaDbPortPrisma extends EmpresaDbPort {
  constructor(
    private readonly genderInferrer: GenderInferrerService,
    @Optional() readonly client: PrismaClient = prismaClient,
  ) {
    super();
  }

  findOneByIdentifiers(
    cnpj?: CNPJ,
    idEstrangeira?: number,
  ): Promise<Result<Empresa, string>> {
    return this.client.empresa
      .findFirst({
        where: {
          cnpj: cnpj?.unFormat() || null,
          idEstrangeira: idEstrangeira || null,
        },
        include,
      })
      .then((value) => {
        if (!value) return Result.fail('Empresa não encontrada');
        return Result.ok(EmpresaJsonSerializer.deserialize(value));
      });
  }

  getEmpresa(id: string): Promise<Result<Empresa, string>> {
    return this.client.empresa
      .findUnique({
        where: {
          id,
        },
        include,
      })
      .then((value) => {
        if (!value) return Result.fail('Empresa não encontrada');
        return Result.ok(EmpresaJsonSerializer.deserialize(value));
      });
  }

  async remove(id: string): Promise<Result<void, string>> {
    const res = await this.client.empresa.delete({
      where: { id },
    });

    if (!res) return Result.fail('Empresa não encontrada');
    return Result.ok(undefined);
  }

  async save(empresa): Promise<Result<Empresa, string>> {
    const prismaEmpresa = EmpresaJsonSerializer.serialize(empresa);

    const payload = Object.assign(prismaEmpresa, {
      historicoFaturamentos: {
        createMany: {
          data: HistoricoFaturamentosJsonSerializer.serialize(
            empresa.historicoFaturamentos,
          ),
        },
      },
      historicoInvestimentos: {
        createMany: {
          data: empresa.historicoInvestimentos.map(
            InvestimentosJsonSerializer.serialize,
          ),
        },
      },
      historicoQuadroDeColaboradores: {
        createMany: {
          data: HistoricoQuadroDeColaboradoresJsonSerializer.serialize(
            empresa.historicoQuadroDeColaboradores,
          ),
        },
      },
      incubacoes: {
        createMany: {
          data: empresa.incubacoes.map(IncubacaoJsonSerializer.serialize),
        },
      },
      socios: {
        createMany: {
          data: await Promise.all(
            empresa.socios.map(SocioJsonSerializer.serialize).map(async (s) => {
              const inferredGender = await this.genderInferrer
                .get(s.nome)
                .catch(() => null);
              let isMale: boolean | null;

              if (inferredGender !== null) isMale = inferredGender === 'M';
              else isMale = null;

              return {
                ...s,
                isMale,
              };
            }),
          ),
        },
      },
    });

    await this.client.$transaction([
      this.client.socio.deleteMany({ where: { empresaId: prismaEmpresa.id } }),
      this.client.incubacao.deleteMany({
        where: { empresaId: prismaEmpresa.id },
      }),
      this.client.faturamento.deleteMany({
        where: { empresaId: prismaEmpresa.id },
      }),
      this.client.investimento.deleteMany({
        where: { empresaId: prismaEmpresa.id },
      }),
      this.client.quadroDeColaboradores.deleteMany({
        where: { empresaId: prismaEmpresa.id },
      }),
      this.client.socio.deleteMany({
        where: { empresaId: prismaEmpresa.id },
      }),
      this.client.empresa.upsert({
        where: { id: prismaEmpresa.id },
        create: payload,
        update: prismaEmpresa,
        include,
      }),
    ]);

    const empresaRaw = await this.getEmpresa(prismaEmpresa.id);
    if (empresaRaw.isFail()) return Result.fail(empresaRaw.unwrapFail());

    return Result.ok(empresaRaw.unwrap());
  }
}
