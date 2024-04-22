import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cat } from './cat.entity';

@Injectable()
export class CatService {
  constructor(
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>,
  ) {}

  async create(catData: Partial<Cat>): Promise<Cat> {
    const cat = this.catRepository.create(catData);
    return this.catRepository.save(cat);
  }

  async findAll(): Promise<Cat[]> {
    return this.catRepository.find();
  }

  async findOne(id: number): Promise<Cat> {
    const cat = await this.catRepository.findOne({ where: { id } });
    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }
    return cat;
  }

  async update(id: number, catData: Partial<Cat>): Promise<Cat> {
    await this.catRepository.update(id, catData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.catRepository.delete(id);
  }
}
