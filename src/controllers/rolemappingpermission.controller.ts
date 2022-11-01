import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {RoleMappingPermission} from '../models';
import {RoleMappingPermissionRepository} from '../repositories';
import {RoleMappingPermissionService} from '../services';

export class RolemappingpermissionController {
  constructor(
    @repository(RoleMappingPermissionRepository)
    public roleMappingPermissionRepository: RoleMappingPermissionRepository,
    @inject('services.RoleMappingPermissionService')
    public roleMappingPermissionService: RoleMappingPermissionService,
  ) {}

  @post('/role-mapping-permissions')
  @response(200, {
    description: 'RoleMappingPermission model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(RoleMappingPermission)},
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RoleMappingPermission, {
            title: 'NewRoleMappingPermission',
            exclude: ['id'],
          }),
        },
      },
    })
    roleMappingPermission: Omit<RoleMappingPermission, 'id'>,
  ): Promise<RoleMappingPermission> {
    return this.roleMappingPermissionRepository.create(roleMappingPermission);
  }

  @get('/role-mapping-permissions/count')
  @response(200, {
    description: 'RoleMappingPermission model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RoleMappingPermission) where?: Where<RoleMappingPermission>,
  ): Promise<Count> {
    return this.roleMappingPermissionRepository.count(where);
  }

  @get('/role-mapping-permissions')
  @response(200, {
    description: 'Array of RoleMappingPermission model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RoleMappingPermission, {
            includeRelations: true,
          }),
        },
      },
    },
  })
  async find(
    @param.filter(RoleMappingPermission) filter?: Filter<RoleMappingPermission>,
  ): Promise<RoleMappingPermission[]> {
    return this.roleMappingPermissionRepository.find(filter);
  }

  @patch('/role-mapping-permissions')
  @response(200, {
    description: 'RoleMappingPermission PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RoleMappingPermission, {partial: true}),
        },
      },
    })
    roleMappingPermission: RoleMappingPermission,
    @param.where(RoleMappingPermission) where?: Where<RoleMappingPermission>,
  ): Promise<Count> {
    return this.roleMappingPermissionRepository.updateAll(
      roleMappingPermission,
      where,
    );
  }

  @get('/role-mapping-permissions/{id}')
  @response(200, {
    description: 'RoleMappingPermission model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RoleMappingPermission, {
          includeRelations: true,
        }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(RoleMappingPermission, {exclude: 'where'})
    filter?: FilterExcludingWhere<RoleMappingPermission>,
  ): Promise<RoleMappingPermission> {
    return this.roleMappingPermissionRepository.findById(id, filter);
  }

  @patch('/role-mapping-permissions/{id}')
  @response(204, {
    description: 'RoleMappingPermission PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RoleMappingPermission, {partial: true}),
        },
      },
    })
    roleMappingPermission: RoleMappingPermission,
  ): Promise<void> {
    await this.roleMappingPermissionRepository.updateById(
      id,
      roleMappingPermission,
    );
  }

  @put('/role-mapping-permissions/{id}')
  @response(204, {
    description: 'RoleMappingPermission PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() roleMappingPermission: RoleMappingPermission,
  ): Promise<void> {
    await this.roleMappingPermissionRepository.replaceById(
      id,
      roleMappingPermission,
    );
  }

  @del('/role-mapping-permissions/{id}')
  @response(204, {
    description: 'RoleMappingPermission DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.roleMappingPermissionRepository.deleteById(id);
  }
}
