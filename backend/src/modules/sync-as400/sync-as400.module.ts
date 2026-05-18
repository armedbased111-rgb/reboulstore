import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { Variant } from '../../entities/variant.entity';
import { SyncAs400Service } from './sync-as400.service';
import { SyncAs400Controller } from './sync-as400.controller';
import { SyncAs400ExportGuard } from './sync-as400-export.guard';
import { SyncAs400Scheduler } from './sync-as400.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Variant])],
  controllers: [SyncAs400Controller],
  providers: [SyncAs400Service, SyncAs400ExportGuard, SyncAs400Scheduler],
  exports: [SyncAs400Service],
})
export class SyncAs400Module {}
