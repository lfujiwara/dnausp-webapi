import { Prisma, PrismaClient } from '@prisma/client';

const build = async <T>(
  client: PrismaClient,
  data: T,
  countQuery: Prisma.Sql,
): Promise<{ data: T; count: number }> => {
  const countQueryRes = await client.$queryRaw(countQuery);

  return {
    data,
    count: countQueryRes[0].count,
  };
};

export const QueryResult = {
  build,
};
