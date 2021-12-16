export abstract class GenderInferrerService {
  abstract get(name: string): Promise<'M' | 'F' | null>;
}
