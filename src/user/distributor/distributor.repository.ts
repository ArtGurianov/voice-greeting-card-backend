import {EntityRepository, Repository} from 'typeorm'
import {Distributor} from './distributor.entity'

@EntityRepository(Distributor)
export class DistributorRepository extends Repository<Distributor> {}
