// import { INestApplication } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
// import TestUtils from '../src/users/utils/testUtils';
// import { UsersService } from '../src/users/user.service';
// import * as request from 'supertest';
// import { UserResolver } from '../src/users/user.resolver';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// import { join } from 'path';

// describe('Users (e2e)', () => {
//   const user = TestUtils.getValidUser();

//   let app: INestApplication;
//   const usersService = {
//     findUserById: () => user,
//     findUserByEmail: () => user,
//     create: () => user,
//     update: () => user,
//   };

//   beforeAll(async () => {
//     const moduleRef = await Test.createTestingModule({
//       providers: [
//         { provide: UsersService, useValue: usersService },
//         UserResolver,
//       ],
//       imports: [
//         GraphQLModule.forRoot<ApolloDriverConfig>({
//           driver: ApolloDriver,
//           autoSchemaFile: join(process.cwd(), '../src/schema.gql'),
//         }),
//       ],
//     }).compile();

//     app = moduleRef.createNestApplication();
//     await app.init();
//   });

//   it('find the user', async () => {
//     const query = `{
//         findUser(id: "ffb2b189-fcbf-420a-8ee0-ced4f9366817") {
//           name
//           email
//         }
//       }
//     `;

//     const response = await request(app.getHttpServer())
//       .post('/graphql')
//       .send({
//         query,
//       })
//       .expect(200);

//     expect(response.body.data).toHaveProperty('findUser');
//     expect(response.body.data.findUser.email).toBe(user.email);
//     expect(response.body.data.findUser.name).toBe(user.name);
//   });

//   afterAll(async () => {
//     await app.close();
//   });
// });
