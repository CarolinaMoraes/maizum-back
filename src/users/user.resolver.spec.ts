import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import TestUtils from './utils/testUtils';
import { CreateUserInput } from './dto/createUserInput';
import { UpdateUserInput } from './dto/updateUserInput';
import { UserResolver } from './user.resolver';

describe('UserResolver', () => {
  let resolver: UserResolver;

  const userService = {
    findUserById: jest.fn(),
    findUserByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UsersService,
          useValue: userService,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should resolve findUser', async () => {
    const user = TestUtils.getValidUser();
    userService.findUserById.mockReturnValue(user);

    const returnedUser = await resolver.findUser(user.id);

    expect(returnedUser).toMatchObject(user);
  });

  it('should resolve findUserByEmail', async () => {
    const user = TestUtils.getValidUser();
    userService.findUserByEmail.mockReturnValue(user);

    const returnedUser = await resolver.findUserByEmail(user.email);

    expect(returnedUser).toMatchObject(user);
  });

  it('should create a new user through createUser mutation', async () => {
    const user = TestUtils.getValidUser();
    userService.create.mockReturnValue(user);

    const dataInput = new CreateUserInput();
    dataInput.email = 'valid@email.com';
    dataInput.name = 'User Name';
    dataInput.password = 'password12345678!';

    const returnedUser = await resolver.createUser(dataInput);

    expect(returnedUser).toMatchObject(user);
  });

  it('should update an user through updateUser mutation', async () => {
    const user = TestUtils.getValidUser();

    const dataInput = new UpdateUserInput();
    dataInput.name = 'User Name II';

    userService.update.mockReturnValue({ ...user, ...dataInput });
    const returnedUser = await resolver.updateUser(user.id, dataInput);

    expect(returnedUser).toMatchObject({ ...user, ...dataInput });
  });
});
