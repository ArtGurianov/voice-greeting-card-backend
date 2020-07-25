import {Type} from '@nestjs/common'
import {UserRoles} from '../types/roles'
import {Admin} from '../user/admin/admin.entity'
import {Customer} from '../user/customer/customer.entity'
import {Distributor} from '../user/distributor/distributor.entity'
import {Manufacturer} from '../user/manufacturer/manufacturer.entity'

export const entityMap: Record<UserRoles, Type<{userId: string}>> = {
  [UserRoles.ADMIN]: Admin,
  [UserRoles.SUPER_ADMIN]: Admin,
  [UserRoles.CUSTOMER]: Customer,
  [UserRoles.DISTRIBUTOR]: Distributor,
  [UserRoles.MANUFACTURER]: Manufacturer,
}
