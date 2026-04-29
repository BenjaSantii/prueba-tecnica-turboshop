import { Module } from '@nestjs/common'
import { GlobalpartsService } from './globalparts.service'

@Module({
  providers: [GlobalpartsService],
  exports:   [GlobalpartsService],
})
export class GlobalpartsModule {}