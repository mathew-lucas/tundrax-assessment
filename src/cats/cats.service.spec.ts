import { Test, TestingModule } from '@nestjs/testing';
import { CatService } from './cats.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cat } from './cat.entity';
import { NotFoundException } from '@nestjs/common';

describe('CatService', () => {
  let catService: CatService;
  let catRepository: Repository<Cat>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatService,
        {
          provide: getRepositoryToken(Cat),
          useClass: Repository,
        },
      ],
    }).compile();

    catService = module.get<CatService>(CatService);
    catRepository = module.get<Repository<Cat>>(getRepositoryToken(Cat));
  });

  it('should be defined', () => {
    expect(catService).toBeDefined();
  });

  describe('create', () => {
    it('should create a cat', async () => {
      const mockCatData = { name: 'Whiskers', age: 3, breed: 'Tabby' };
      const mockCreatedCat = { id: 1, ...mockCatData };
      jest
        .spyOn(catRepository, 'create')
        .mockReturnValueOnce(mockCreatedCat as Cat);
      jest
        .spyOn(catRepository, 'save')
        .mockResolvedValueOnce(mockCreatedCat as Cat);

      const cat = await catService.create(mockCatData);

      expect(cat).toEqual(mockCreatedCat);
    });
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const mockCats = [
        { id: 1, name: 'Whiskers', age: 3, breed: 'Tabby' },
        { id: 2, name: 'Snowball', age: 2, breed: 'Persian' },
      ];
      jest.spyOn(catRepository, 'find').mockResolvedValue(mockCats as Cat[]);

      const cats = await catService.findAll();

      expect(cats).toEqual(mockCats);
    });
  });

  describe('findOne', () => {
    it('should return a cat if found', async () => {
      const mockCat = { id: 1, name: 'Whiskers', age: 3, breed: 'Tabby' };
      jest.spyOn(catRepository, 'findOne').mockResolvedValue(mockCat as Cat);

      const cat = await catService.findOne(1);

      expect(cat).toEqual(mockCat);
    });

    it('should throw NotFoundException if cat is not found', async () => {
      jest.spyOn(catRepository, 'findOne').mockResolvedValue(null);

      await expect(catService.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a cat', async () => {
      const mockCat = { id: 1, name: 'Whiskers', age: 3, breed: 'Tabby' };
      const updatedCatData = { name: 'Snowball', age: 4 };
      const updatedCat = { id: 1, ...updatedCatData };
      jest.spyOn(catRepository, 'findOne').mockResolvedValue(mockCat as Cat);
      jest.spyOn(catRepository, 'update').mockResolvedValue({} as any);
      jest.spyOn(catService, 'findOne').mockResolvedValue(updatedCat as Cat);

      const cat = await catService.update(1, updatedCatData);

      expect(cat).toEqual(updatedCat);
    });
  });

  describe('remove', () => {
    it('should remove a cat', async () => {
      jest
        .spyOn(catRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await catService.remove(1);

      expect(catRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
