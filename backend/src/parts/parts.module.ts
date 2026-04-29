import { Module } from '@nestjs/common'
import { PartsController } from './parts.controller'
import { PartsService } from './parts.service'
import { SyncService } from './sync.service'
import { GlobalpartsModule } from '../providers/globalparts/globalparts.module'
import { RepuestosMaxModule } from '../providers/repuestosmax/repuestosmax.module'
import { AutoPartsPlusModule } from '../providers/autopartsplus/autopartsplus.module'

@Module({
  imports: [
    GlobalpartsModule,
    RepuestosMaxModule,
    AutoPartsPlusModule,
  ],
  controllers: [PartsController],
  providers:   [PartsService, SyncService],
})
export class PartsModule {}