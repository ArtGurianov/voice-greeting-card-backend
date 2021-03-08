import { Type } from '@nestjs/common';

import { UserRoles } from 'src/types/roles';
import { Admin } from 'src/user/admin/admin.entity';
import { Customer } from 'src/user/customer/customer.entity';
import { Distributor } from 'src/user/distributor/distributor.entity';
import { Manufacturer } from 'src/user/manufacturer/manufacturer.entity';

export type MyEntitiesType = Admin | Customer | Distributor | Manufacturer;

export const entityMap: Record<UserRoles, Type<MyEntitiesType>> = {
  [UserRoles.ADMIN]: Admin,
  [UserRoles.SUPER_ADMIN]: Admin,
  [UserRoles.CUSTOMER]: Customer,
  [UserRoles.DISTRIBUTOR]: Distributor,
  [UserRoles.MANUFACTURER]: Manufacturer,
};
