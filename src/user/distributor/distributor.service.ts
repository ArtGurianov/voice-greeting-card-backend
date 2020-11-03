import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm';
import { Distributor } from './distributor.entity';
import { DistributorRepository } from './distributor.repository';
// import { UserRepository } from '../user.repository'

@Injectable()
export class DistributorService {
  public constructor(
    // @InjectRepository(UserRepository)
    // private readonly userRepo: UserRepository,
     @InjectRepository(DistributorRepository)
    private readonly distributorRepo: DistributorRepository,
    // private readonly configService: ConfigService,
  ) {
  }
  async allDistributors(): Promise<Distributor[]> {
    return this.distributorRepo.find()
}
}
