import { add } from 'date-fns';
import { v4 } from 'uuid';

export class EmailCreateDto {
  id = v4();
  userId;
  email;
  isConfirmed;
  confirmationCode = v4();
  recoveryCode = '';
  expirationDate = add(new Date(), { hours: 10, minutes: 10 });

  constructor(userId: string, email: string, isConfirmed = false) {
    this.userId = userId;
    this.email = email;
    this.isConfirmed = isConfirmed;
  }
}
