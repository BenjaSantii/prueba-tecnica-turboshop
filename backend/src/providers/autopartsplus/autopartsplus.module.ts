import { Module } from '@nestjs/common'
import { AutoPartsPlusService } from './autopartsplus.service'

@Module({
  providers: [AutoPartsPlusService],
  exports:   [AutoPartsPlusService],
})
export class AutoPartsPlusModule {}
