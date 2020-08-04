import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common'
import {InjectConnection, InjectRepository} from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'
import cookie from 'cookie'
import {Response} from 'express'
import {Connection} from 'typeorm'
import {JwtService} from '../jwt/jwt.service'
import {CustomResult} from '../utils/CustomResult'
import {entityMap} from '../utils/entityMap'
import {LoginInput} from './input/user.loginInput'
import {RegisterInput} from './input/user.registerInput'
import {MeResult} from './user.customResults'
import {User} from './user.entity'
import {UserRepository} from './user.repository'

@Injectable()
export class UserService {
  public constructor(
    private readonly jwtService: JwtService,
    @InjectConnection() readonly connection: Connection,
    @InjectRepository(UserRepository)
    private readonly userRepo: UserRepository,
  ) {}

  async users(): Promise<User[]> {
    const users = await this.userRepo.find()
    if (users) {
      return users
    } else {
      throw new ServiceUnavailableException(
        'Ohhh.. Could not process operation.',
      )
    }
  }

  async register({
    email,
    password,
    role,
  }: RegisterInput): Promise<CustomResult> {
    const alreadyExists = await this.userRepo.findOne({
      email: email,
    })
    if (alreadyExists) throw new ConflictException('user already exists')
    const newUser = await this.userRepo.create({email, password})
    const newRoleEntity = await this.connection
      .getRepository(entityMap[role])
      .save({user: newUser})
    if (!newRoleEntity) {
      throw new InternalServerErrorException('cannot create user')
    }

    return new CustomResult({ok: true})
  }

  async login(
    {email, password}: LoginInput,
    res: Response,
  ): Promise<CustomResult> {
    const user = await this.userRepo.findOne({where: {email}})
    if (!user) {
      throw new NotFoundException()
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new UnauthorizedException()
    }
    const refreshToken = this.jwtService.createRefreshToken(user)
    this.jwtService.sendRefreshToken(res, refreshToken)
    const accessToken = this.jwtService.createAccessToken(user)
    return new CustomResult({ok: true, value: accessToken})
  }

  async me(userId: string): Promise<typeof MeResult> {
    const user = await this.userRepo.findOne(userId)
    if (!user) throw new NotFoundException()

    const roleEntity = await this.connection
      .getRepository(entityMap[user.role])
      .findOne({where: {userId: user.id}})
    if (!roleEntity) throw new NotFoundException()
    roleEntity.user = user
    return roleEntity
  }

  async revokeRefreshToken(userId: string): Promise<boolean> {
    const result = await this.userRepo.increment(
      {id: userId},
      'tokenVersion',
      1,
    )
    if (!result)
      throw new ServiceUnavailableException(
        'Ohhh.. Could not process operation.',
      )
    return true
  }

  async useRefreshToken(cookies: any, res: Response): Promise<string> {
    if (!cookies) {
      throw new UnauthorizedException('Cookie not provided.')
    }

    const parsed = cookie.parse(cookies)

    if (!parsed.jid) {
      throw new UnauthorizedException('Refresh token not provided.')
    }

    const jwtPayload = this.jwtService.verifyRefreshToken(parsed.jid)

    if (!jwtPayload) {
      throw new UnauthorizedException('Broken jwt.')
    }

    const user = await this.userRepo.findOne({id: jwtPayload.userId})

    if (!user) {
      throw new NotFoundException('user not found')
    }

    const accessToken = this.jwtService.createAccessToken(user)

    if (!accessToken) {
      throw new ServiceUnavailableException(
        'Ohhh.. Could not process operation.',
      )
    }

    if (user.tokenVersion !== jwtPayload.tokenVersion) {
      throw new UnauthorizedException('Revoked token')
    }

    const refreshToken = this.jwtService.createRefreshToken(user)
    if (!refreshToken) {
      throw new ServiceUnavailableException(
        'Ohhh.. Could not process operation.',
      )
    }
    this.jwtService.sendRefreshToken(res, refreshToken)

    return accessToken
  }

  async logout(res: Response): Promise<boolean> {
    this.jwtService.sendRefreshToken(res, '')
    return true
  }
}
