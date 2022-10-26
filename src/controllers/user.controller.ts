import {Getter, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  getModelSchemaRef,
  post,
  Request,
  requestBody,
  response,
  RestBindings,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {LoginRQ, User} from '../models';
import {UserRepository} from '../repositories';
import {UserCredentials, UserService} from '../services';
export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject.getter(SecurityBindings.USER, {optional: true})
    private getCurrentUser: Getter<UserProfile>,
    @inject('services.UserService') public userService: UserService,
    @inject(RestBindings.Http.REQUEST) private request: Request,
  ) {}

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Login with email and password',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LoginRQ, {
            title: 'NewUser',
          }),
        },
      },
    })
    credentials: UserCredentials,
  ) {
    const res = await this.userService.login(credentials);
    return res;
  }

  @post('users/signup')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'User',
          }),
          description: 'Create user',
        },
      },
    })
    newUserRequest: User,
  ): Promise<User> {
    const userRS = await this.userService.createUser(newUserRequest);
    return userRS;
  }
}
