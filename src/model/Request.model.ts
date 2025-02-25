type Status = 'pending' | 'approved' | 'rejected' | 'fulfilled' | 'unfulfilled';
type RequestType = 'visit' | 'adopt';

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