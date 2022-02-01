import { Optional } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { prismaClient } from '../prisma';

export class QtdEmpresasDbQueryPort {
  static provider = {
    provide: QtdEmpresasDbQueryPort,
    useClass: QtdEmpresasDbQueryPort,
  };

  constructor(@Optional() readonly client: PrismaClient = prismaClient) {}

  async execute(): Promise<number> {
    return this.client.empresa.count();
  }
}
