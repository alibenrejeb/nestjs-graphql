import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne, RelationId } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class RefreshToken extends AbstractEntity {
  @Field(() => String)
  @Column({ unique: true })
  token: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @RelationId((self: RefreshToken) => self.user)
  readonly userId: string;
}
