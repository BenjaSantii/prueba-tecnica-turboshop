import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PartsModule } from './parts/parts.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PartsModule,
  ],
})
export class AppModule {}
