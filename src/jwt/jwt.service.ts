import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {Response} from 'express'
import {sign, verify} from 'jsonwebtoken'
import {User} from '../user/user.entity'
import {defaultJwtAccessSecret} from '../utils/constants'

@Injectable()
export class JwtService {
  public constructor(private readonly configService: ConfigService) {}

  createAccessToken(user: User) {
    return sign(
      {userId: user.id},
      this.configService.get<string>('jwtAccessSecret', defaultJwtAccessSecret),
      {expiresIn: '15m'},
    )
  }

  createRefreshToken(user: User) {
    return sign(
      {userId: user.id, role: user.role, tokenVersion: user.tokenVersion},
      this.configService.get<string>(
        'jwtRefreshSecret',
        defaultJwtAccessSecret,
      ),
      {expiresIn: '7d'},
    )
  }

  sendRefreshToken(res: Response, token: string) {
    //return?
    res.cookie('jid', token, {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      path: '/user/refresh_token',
    })
  }

  verifyAccessToken(jid: string) {
    let payload: any
    try {
      payload = verify(
        jid,
        this.configService.get<string>(
          'jwtAccessSecret',
          defaultJwtAccessSecret,
        ),
      )
    } catch (e) {
      console.log(e)
      return null
    }

    return payload ? payload : null
  }

  verifyRefreshToken(jid: string) {
    let payload: any
    try {
      payload = verify(
        jid,
        this.configService.get<string>(
          'jwtRefreshSecret',
          defaultJwtAccessSecret,
        ),
      )
    } catch (e) {
      console.log(e)
      return null
    }

    return payload ? payload : null
  }
}
