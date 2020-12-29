import {createUnionType} from '@nestjs/graphql';
import {CustomResult} from 'src/utils/CustomResult';
import {Admin} from './admin/admin.entity';
import {Customer} from './customer/customer.entity';
import {Distributor} from './distributor/distributor.entity';
import {Manufacturer} from './manufacturer/manufacturer.entity';
import {User} from './user.entity';

//TODO: DIFFERENCE BETWEEN ME AND USER (PRIVATE FIELDS)

// USER RESULT (not ME)
export const UserResult = createUnionType({
  name: 'UserResult',
  types: () => [User, CustomResult],
});

// ME RESULT
export const MeResult = createUnionType({
  name: 'MeResult',
  types: () => [Admin, Customer, Distributor, Manufacturer, CustomResult],
});
