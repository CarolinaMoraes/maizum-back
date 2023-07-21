import { PartialType } from '@nestjs/graphql';
import { User } from '../user.entity';

export default class TestUtils {
  static getValidUser(customInputData?: CustomInputData): User {
    let user = new User();
    user.email = 'valid@email.com';
    user.name = 'User Name';
    user.password = 'password12345678!';
    user.id = 'ffb2b189-fcbf-420a-8ee0-ced4f9366817';

    user = { ...user, ...customInputData };
    return user;
  }
}

class CustomInputData extends PartialType(User) {}
