import { Injectable, Optional } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CNPJ } from '../../domain/cnpj';
import { Result } from 'typescript-monads';

@Injectable()
export class EmpresaBrasilApiCnpjDataDbPortPrisma {
  constructor(@Optional() readonly client: PrismaClient = new PrismaClient()) {}

  async getCnpjsToProcess(skip: number, take: number) {
    return this.client.empresa
      .findMany({
        select: {
          cnpj: true,
        },
        where: { dadosBrasilAPI: undefined, cnpj: { not: null } },
        skip,
        take,
      })
      .then((res) =>
        res
          .map((r) => CNPJ.create(r.cnpj))
          .filter((r) => r.isOk())
          .map((r) => r.unwrap()),
      );
  }

  async persistData(cnpj: CNPJ, data: any) {
    const result = await this.client.empresa.update({
      where: { cnpj: cnpj.get() },
      data: {
        dadosBrasilAPI: data,
      },
    });

    if (!result) return Result.fail('Não foi possível persistir os dados');
    return Result.ok(result);
  }
}
