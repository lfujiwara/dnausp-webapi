import { GenderInferrerService } from './gender-inferrer.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { PrismaClient } from '@prisma/client';
import { prismaClient } from '../database/queries/prisma';
import { Injectable, Optional } from '@nestjs/common';
import Queue from 'queue-promise';

const IBGEURL = 'https://servicodados.ibge.gov.br/api/v2/censos/nomes';

type ResponseIBGE = {
  res: {
    frequencia: number;
  }[];
}[];

/*
 * M / F => Male / Female
 * undefined => Not yet queried
 * null => Queried from IBGE, but nothing was returned
 * */
type InternalInferredGenderResponse = 'M' | 'F' | undefined | null;
type InferredGenderResponse = 'M' | 'F' | null;
type LocalCache = {
  [key: string]: InternalInferredGenderResponse;
};

@Injectable()
export class IBGEClient {
  private queue = new Queue({
    concurrent: 2,
  });

  constructor(private readonly http: HttpService) {}

  private static eval(maleFreq?: number, femaleFreq?: number) {
    if (maleFreq === undefined && femaleFreq === undefined) return null;

    if (maleFreq === undefined) return 'F';
    if (femaleFreq === undefined) return 'M';
    if (maleFreq > femaleFreq) return 'M';
    return 'F';
  }

  query(key: string): Promise<InferredGenderResponse> {
    return Promise.race([
      new Promise<InferredGenderResponse>((resolve) => {
        this.queue.enqueue(async () =>
          resolve(
            IBGEClient.eval(
              await this._query(key, 'M'),
              await this._query(key, 'F'),
            ),
          ),
        );
      }),
      new Promise((r) => setTimeout(r, 120000)).then(() => {
        throw new Error('TIMEOUT IBGE');
      }),
    ]);
  }

  protected _query(name: string, gender: 'M' | 'F') {
    return lastValueFrom(
      this.http.get<ResponseIBGE>(IBGEURL + `/${name}`, {
        params: {
          sexo: gender,
        },
      }),
    ).then(({ data }) => {
      if (data.length === 0 || data[0].res.length === 0) return undefined;
      return data[0].res.reduce((a, b) => a + b.frequencia, 0);
    });
  }
}

@Injectable()
export class GenderInferrerImplService extends GenderInferrerService {
  private cache: LocalCache = {};

  constructor(
    private readonly ibge: IBGEClient,
    @Optional()
    private client: PrismaClient = prismaClient,
  ) {
    super();
  }

  protected static normalize(name: string) {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .split(' ')[0];
  }

  async get(name: string): Promise<InferredGenderResponse> {
    name = GenderInferrerImplService.normalize(name);

    const dbResult = await this.queryFromDb(name);
    if (dbResult !== undefined) return dbResult;
    return this.saveAndPassThrough(name, await this.ibge.query(name));
  }

  protected queryFromDb(name: string): Promise<InternalInferredGenderResponse> {
    if (this.cache[name] !== undefined) {
      return Promise.resolve(this.cache[name]);
    }
    return this.client.genderInferrer
      .findFirst({
        where: {
          name: name,
        },
        rejectOnNotFound: false,
      })
      .then((res) => {
        if (!res) return undefined;
        if (res.isMale === null) return null;
        if (res.isMale) return 'M';
        return 'F';
      });
  }

  protected saveToDb(name: string, gender: InferredGenderResponse) {
    this.cache[name] = gender;
    let isMale = null;
    if (gender !== null) isMale = gender === 'M';

    return this.client.genderInferrer
      .create({
        data: {
          name,
          isMale,
        },
      })
      .catch(() => gender);
  }

  protected async saveAndPassThrough(
    name: string,
    gender: InferredGenderResponse,
  ) {
    await this.saveToDb(name, gender);
    return gender;
  }
}
