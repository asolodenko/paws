export interface User {
  uid: string,
  displayName: string | null,
  email: string | null,
  emailVerified: boolean,
  phoneNumber: string | null,
  photoURL: string | null,
  firstLogin?: string,
  lastLogin: string
}