import * as bcrypt from 'bcryptjs';
import {EntitySubscriberInterface, EventSubscriber, InsertEvent} from 'typeorm';
import {User} from 'src/user/user.entity';

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    event.entity.password = await bcrypt.hash(event.entity.password, 12);
  }
}
