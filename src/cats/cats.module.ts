import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from './cat.entity';
import { CatService } from './cats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cat])],
  providers: [CatService],
  exports: [CatService],
})
export class CatsModule {}
