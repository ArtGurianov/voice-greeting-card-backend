import {SetMetadata} from '@nestjs/common'

// tslint:disable-next-line:variable-name
export const Roles = (...roles: string[]) => SetMetadata('roles', roles)
