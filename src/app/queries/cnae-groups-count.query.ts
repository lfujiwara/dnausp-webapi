export type CnaeGroupsCountQueryInput = {
  anoMin?: number;
  anoMax?: number;
};

export type CnaeGroupsCountQueryOutput = {
  cnae: string;
  count: number;
}[];

export abstract class CnaeGroupsCountQuery {
  abstract execute(
    input: CnaeGroupsCountQueryInput,
  ): Promise<CnaeGroupsCountQueryOutput>;
}
