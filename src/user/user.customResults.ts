import { CustomResult } from 'src/utils/CustomResult';
import { Admin } from './admin/admin.entity';
import { Customer } from './customer/customer.entity';
import { Distributor } from './distributor/distributor.entity';
import { Manufacturer } from './manufacturer/manufacturer.entity';

export type MeResult =
  | Admin
  | Customer
  | Distributor
  | Manufacturer
  | CustomResult;
