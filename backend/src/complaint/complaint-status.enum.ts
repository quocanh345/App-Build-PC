import { registerEnumType } from '@nestjs/graphql';

export enum ComplaintStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

registerEnumType(ComplaintStatus, { name: 'ComplaintStatus' });
