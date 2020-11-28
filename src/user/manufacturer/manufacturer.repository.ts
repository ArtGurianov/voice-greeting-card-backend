import {EntityRepository, Repository} from 'typeorm';
import {Manufacturer} from './manufacturer.entity';

@EntityRepository(Manufacturer)
export class ManufacturerRepository extends Repository<Manufacturer> {}
