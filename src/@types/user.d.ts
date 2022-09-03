import { User as UserValue } from 'shared/lib/value/user.vo';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface User extends UserValue {}
  }
}
