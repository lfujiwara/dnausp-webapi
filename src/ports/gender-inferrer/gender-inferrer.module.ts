import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GenderInferrerService } from './gender-inferrer.service';
import {
  GenderInferrerImplService,
  IBGEClient,
} from './gender-inferrer-impl.service';

@Module({
  imports: [HttpModule],
  providers: [
    IBGEClient,
    {
      provide: GenderInferrerService,
      useClass: GenderInferrerImplService,
    },
  ],
  exports: [GenderInferrerService],
})
export class GenderInferrerModule {}
