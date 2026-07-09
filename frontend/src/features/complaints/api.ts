import { gqlRequest } from '@/lib/graphql-client';

export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'rejected';

export interface Complaint {
  id: string;
  orderId: string;
  userId: string;
  subject: string;
  description: string;
  status: ComplaintStatus;
  adminResponse?: string;
  createdAt: string;
}

function toGraphQLStatus(status: ComplaintStatus): string {
  return status.toUpperCase();
}

function normalize(raw: Complaint): Complaint {
  return { ...raw, status: raw.status.toLowerCase() as ComplaintStatus };
}

const COMPLAINT_FIELDS = `
  id
  orderId
  userId
  subject
  description
  status
  adminResponse
  createdAt
`;

export async function fetchMyComplaints() {
  const query = `
    query MyComplaints {
      myComplaints {
        ${COMPLAINT_FIELDS}
      }
    }
  `;
  const data = await gqlRequest<{ myComplaints: Complaint[] }>(query);
  return data.myComplaints.map(normalize);
}

export async function fetchOrderComplaints(orderId: string) {
  const query = `
    query OrderComplaints($orderId: String!) {
      orderComplaints(orderId: $orderId) {
        ${COMPLAINT_FIELDS}
      }
    }
  `;
  const data = await gqlRequest<{ orderComplaints: Complaint[] }>(query, { orderId });
  return data.orderComplaints.map(normalize);
}

export async function fetchAllComplaints() {
  const query = `
    query AllComplaints {
      allComplaints {
        ${COMPLAINT_FIELDS}
      }
    }
  `;
  const data = await gqlRequest<{ allComplaints: Complaint[] }>(query);
  return data.allComplaints.map(normalize);
}

export async function createComplaintRequest(input: {
  orderId: string;
  subject: string;
  description: string;
}) {
  const query = `
    mutation CreateComplaint($input: CreateComplaintInput!) {
      createComplaint(input: $input) {
        ${COMPLAINT_FIELDS}
      }
    }
  `;
  const data = await gqlRequest<{ createComplaint: Complaint }>(query, { input });
  return normalize(data.createComplaint);
}

export async function respondComplaintRequest(
  id: string,
  status: ComplaintStatus,
  adminResponse?: string,
) {
  const query = `
    mutation RespondComplaint($input: RespondComplaintInput!) {
      respondComplaint(input: $input) {
        ${COMPLAINT_FIELDS}
      }
    }
  `;
  const data = await gqlRequest<{ respondComplaint: Complaint }>(query, {
    input: { id, status: toGraphQLStatus(status), adminResponse },
  });
  return normalize(data.respondComplaint);
}
