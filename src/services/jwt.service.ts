import {Authentication} from '../constants';
import {TokenService} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {JwtPayload, sign, verify} from 'jsonwebtoken';
import {AccessTokenRepository, UserRepository} from '../repositories';

export class JWTService implements TokenService {
  constructor(
    @repository(AccessTokenRepository)
    public accessTokenRepository: AccessTokenRepository,
    @repository(UserRepository) public userRepository: UserRepository,
  ) {}

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized('Token is invalid');
    }
    let userProfile: UserProfile;
    try {
      // decode user profile from token
      const decodedToken = verify(
        token,
        Authentication.ACCESS_TOKEN_SECRET as string,
      ) as JwtPayload;

      userProfile = {
        [securityId]: decodedToken.user.id,
        user: decodedToken.user,
        company: decodedToken.company,
        roles: decodedToken.roles
      };
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }
    return userProfile;
  }

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized('User profile is null');
    }
    // Generate a JSON Web Token
    let token: string;
    try {
      token = sign(userProfile, Authentication.ACCESS_TOKEN_SECRET as string, {
        expiresIn: Number(Authentication.APPLICATION_ACCESS_TOKEN_EXPIRES_IN),
      });
      const accessTokenUser = await this.accessTokenRepository.create({
        userId: userProfile.user.id,
        data: JSON.stringify(userProfile),
        ttl: Authentication.DEFAULT_TTL,
        id: token,
      });
    } catch (error) {
      console.info('error =>', error);
      throw new HttpErrors.Unauthorized(error);
    }
    return token;
  }
}
