export enum UserActivities {
  Login = 'Login',
  Register = 'Register',
  Logout = 'Logout',
  PasswordReset = 'PasswordReset',
  OrderPlaced = 'OrderPlaced',
  OrderCancelled = 'OrderCancelled',
  AccountVerified = 'AccountVerified',
  Lockedout = 'Lockedout',
  EmailConfirmed = 'EmailConfirmed',
  AnsweredQuestion = 'AnsweredQuestion',
  AskedQuestion = 'AskedQuestion',
  ReviewedOrder = 'ReviewedOrder',
  WithdrawalRequestCreated = 'WithdrawalRequestCreated',
  Registered = 'Registered',
  EmailVerificationSent = 'EmailVerificationSent',
  PasswordResetRequested = 'PasswordResetRequested',
}

export interface Activity {
  id: string;
  userName: string;
  userId: string;
  fingerprintToken: string;
  device: string;
  userAgent: string;
  detectedAt: string;
  ipAddress: string;
  activityType: UserActivities;
}

export interface ActivityApiResponse {
  items: Activity[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
