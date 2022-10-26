import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {AccessToken, AccessTokenRelations, User} from '../models';
import {UserRepository} from './user.repository';
import {ApplicationKeys} from '../constants';

export class AccessTokenRepository extends DefaultCrudRepository<
  AccessToken,
  typeof AccessToken.prototype.id,
  AccessTokenRelations
> {
  constructor(
    @inject(`datasources.${ApplicationKeys.DB_DATASOURCE}`)
    dataSource: DbDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(AccessToken, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
  public readonly user: BelongsToAccessor<
    User,
    typeof AccessToken.prototype.id
  >;
}
