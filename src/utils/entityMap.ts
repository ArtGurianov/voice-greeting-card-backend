import {Type} from '@nestjs/common';
import {UserRoles} from '../types/roles';
import {Admin} from '../user/admin/admin.entity';
import {Customer} from '../user/customer/customer.entity';
import {Distributor} from '../user/distributor/distributor.entity';
import {Manufacturer} from '../user/manufacturer/manufacturer.entity';

export type MyEntitiesType = Admin | Customer | Distributor | Manufacturer

export const entityMap: Record<UserRoles, Type<MyEntitiesType>> = {
  [UserRoles.ADMIN]: Admin,
  [UserRoles.SUPER_ADMIN]: Admin,
  [UserRoles.CUSTOMER]: Customer,
  [UserRoles.DISTRIBUTOR]: Distributor,
  [UserRoles.MANUFACTURER]: Manufacturer,
};
