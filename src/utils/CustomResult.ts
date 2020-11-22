import {Field, ID, ObjectType} from '@nestjs/graphql';
import {v4} from 'uuid';

export interface CustomResultInterface {
  ok?: boolean;
  value?: string;
  errors?: CustomError[];
}

@ObjectType()
export class CustomError {
  constructor({
    location,
    errorMessages,
  }: {
    location: string;
    errorMessages: string[];
  }) {
    this.id = v4();
    this.location = location;
    this.errorMessages = errorMessages;
  }
  @Field(() => ID)
  id: string
  @Field(() => String)
  location: string
  @Field(() => [String])
  errorMessages: string[]
}

@ObjectType()
export class CustomResult implements CustomResultInterface {
  constructor(data: CustomResultInterface) {
    if (data.ok) this.ok = data.ok;
    if (data.value) this.value = data.value;
    if (data.errors) this.errors = data.errors;
    this.id = v4();
  }

  @Field(() => ID)
  id: string

  @Field(() => Boolean, {defaultValue: false})
  ok: boolean

  @Field(() => String, {nullable: true})
  value: string

  @Field(() => [CustomError], {nullable: true})
  errors?: CustomError[]
}
