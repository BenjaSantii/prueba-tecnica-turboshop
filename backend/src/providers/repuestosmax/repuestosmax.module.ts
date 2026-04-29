import { Module } from '@nestjs/common'
import { RepuestosMaxService } from './repuestosmax.service'

@Module({
  providers: [RepuestosMaxService],
  exports:   [RepuestosMaxService],
})
export class RepuestosMaxModule {}