import { Injectable, Logger } from '@nestjs/common';
import { BrasilApiCnpjDataService } from '../../ports/services/brasil-api-cnpj-data.service';
import { EmpresaBrasilApiCnpjDataDbPortPrisma } from '../../ports/database/empresa-brasil-api-cnpj-data.db-port.prisma';
import { CNPJ } from '../../domain/cnpj';

@Injectable()
export class CnpjDataWorkerService {
  private dbBatchSize = 100;
  private httpBatchSize = 5;

  constructor(
    private readonly dataService: BrasilApiCnpjDataService,
    private readonly db: EmpresaBrasilApiCnpjDataDbPortPrisma,
    private readonly logger: Logger,
  ) {}

  onModuleInit() {
    this.process().then(() => this.logger.log('CNPJ data worker finished'));
  }

  async processCnpj(cnpj: CNPJ) {
    try {
      const data = await this.dataService.getCnpjData(cnpj);
      const result = await this.db.persistData(cnpj, data);

      if (result.isOk())
        this.logger.log(`CNPJ ${cnpj.get()} processado com sucesso`);
      else this.logger.error(`Falha ao processar CNPJ ${cnpj.get()}`);
    } catch (err) {
      this.logger.error(`Erro ao processar CNPJ ${cnpj.get()}`, err);
    }
  }

  async process() {
    this.logger.log('Iniciando processamento de CNPJ');
    let i = 0;
    let cnpjs: CNPJ[] = await this.db.getCnpjsToProcess(i, this.dbBatchSize);

    while (cnpjs.length > 0) {
      cnpjs = await this.db.getCnpjsToProcess(i, this.dbBatchSize);
      await this.processDbBatch(cnpjs);
      i += this.dbBatchSize;
    }
  }

  async processDbBatch(cnpjs: CNPJ[]) {
    let i = 0;
    let httpBatch: CNPJ[] = cnpjs.slice(i, i + this.httpBatchSize);

    while (httpBatch.length > 0) {
      await this.processHttpBatch(httpBatch);

      i += this.httpBatchSize;
      httpBatch = cnpjs.slice(i, i + this.httpBatchSize);
    }
  }

  async processHttpBatch(cnpjs: CNPJ[]) {
    return Promise.all(cnpjs.map(this.processCnpj.bind(this)));
  }
}
