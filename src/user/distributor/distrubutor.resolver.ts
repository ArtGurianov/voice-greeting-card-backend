import { Query, Resolver } from '@nestjs/graphql';
import { Public } from '../../utils/public.decorator';
import { Distributor } from './distributor.entity';
import { DistributorService } from './distributor.service';

@Resolver()
export class DistributorResolver {
  constructor(private readonly distributorService: DistributorService) {}

  @Public()
  @Query(()=>[Distributor])
  async allDistributors(): Promise<Distributor[]> {
    return this.distributorService.allDistributors()
  }
}
