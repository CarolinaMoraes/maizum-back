import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import TestUtils from './utils/testUtils';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/createUserInput';
import { UpdateUserInput } from './dto/updateUserInput';

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When searching an user by id', () => {
    it('should find an existing user', async () => {
      const user = TestUtils.getValidUser();
      mockRepository.findOne.mockReturnValue(user);

      const foundUser = await service.findUserById(
        'ffb2b189-fcbf-420a-8ee0-ced4f9366817',
      );
      expect(foundUser).toBe(user);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it("should throw an exception if a user isn't found", async () => {
      mockRepository.findOne.mockReturnValue(null);

      expect(
        service.findUserById('ffb2b189-fcbf-420a-8ee0-ced4f9366817'),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When searching an user by email', () => {
    it('should find an existing user', async () => {
      const user = TestUtils.getValidUser();
      mockRepository.findOne.mockReturnValue(user);

      const foundUser = await service.findUserByEmail('valid@email.com');
      expect(foundUser).toBe(user);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it("should throw an exception if a user isn't found", async () => {
      mockRepository.findOne.mockReturnValue(null);

      expect(
        service.findUserByEmail('invalid@email.com'),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When creating an user', () => {
    const newUserInputData = new CreateUserInput();

    it('should create a user if all data is valid', async () => {
      newUserInputData.name = 'New User';
      newUserInputData.email = 'user@example.com';
      newUserInputData.password = 'password12345678!';
      newUserInputData.username = 'mine_user';

      mockRepository.create.mockReturnValue(newUserInputData);
      mockRepository.save.mockReturnValue(newUserInputData);

      const savedUser = await service.create(newUserInputData);
      expect(savedUser).toBe(newUserInputData);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception if there is an internal server error', async () => {
      const newUserInputData = new CreateUserInput();
      newUserInputData.name = 'New User';
      newUserInputData.email = 'user@example.com';
      newUserInputData.password = 'password12345678!';
      newUserInputData.username = 'mine_user';

      mockRepository.create.mockReturnValue(newUserInputData);
      mockRepository.save.mockImplementation(() => {
        throw new Error('oops');
      });

      expect(service.create(newUserInputData)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('When updating an existing user', () => {
    it('should update the user if the user exists', async () => {
      const originalUser = TestUtils.getValidUser();
      const dataToUpdate = new UpdateUserInput();
      dataToUpdate.name = 'Fernandinha';
      dataToUpdate.username = 'fer_nandinha';

      mockRepository.findOne.mockReturnValue(originalUser);
      mockRepository.create.mockReturnValue({
        ...originalUser,
        ...dataToUpdate,
      });

      const updatedUser = await service.update(originalUser.id, dataToUpdate);

      expect(updatedUser).toMatchObject({ ...originalUser, ...dataToUpdate });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });
  });
});
