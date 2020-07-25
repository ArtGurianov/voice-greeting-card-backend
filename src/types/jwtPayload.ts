export interface JwtPayload {
  userId: string
  userRole: string
  iat: number
  exp: number
}
