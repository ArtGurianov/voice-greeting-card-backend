import {createUnionType} from '@nestjs/graphql'
import {CustomResult} from '../utils/CustomResult'
import {User} from './user.entity'

//TODO: DIFFERENCE BETWEEN ME AND USER (PRIVATE FIELDS)

// USER RESULT (not ME)
export const UserResult = createUnionType({
  name: 'UserResult',
  types: () => [User, CustomResult],
})

// ME RESULT
export const MeResult = createUnionType({
  name: 'MeResult',
  types: () => [User, CustomResult],
})
