type Status = 'pending' | 'approved' | 'rejected';

export interface Request {
  pawId: string,
  pawName: string,
  userId: string,
  userName: string,
  userEmail: string,
  date?: number, // for visit
  createdAt: number,
  status: Status,
  respondedAt: number,
  respondedBy: string,
  reason?: string
}