import { InputType, Field } from '@nestjs/graphql';
import { ComplaintStatus } from '../complaint-status.enum';

@InputType()
export class RespondComplaintInput {
  @Field()
  id!: string;

  @Field(() => ComplaintStatus)
  status!: ComplaintStatus;

  @Field({ nullable: true })
  adminResponse?: string;
}
