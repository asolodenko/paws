import { APPROVED, PENDING, REJECTED, FULFILLED, UNFULFILLED, VISIT, ADOPT } from '../constants';
type Status = typeof APPROVED | typeof REJECTED | typeof PENDING | typeof FULFILLED | typeof UNFULFILLED;
type RequestType = typeof VISIT | typeof ADOPT;

export interface Request {
  id: string,
  type: RequestType,
  pawId: string,
  pawName: string,
  userId: string,
  userName: string,
  userEmail: string,
  date?: string, // for visit
  time?: string, // for visit
  createdAt: string,
  status: Status,
  respondedAt?: string,
  respondedBy?: string,
  comment?: string
}