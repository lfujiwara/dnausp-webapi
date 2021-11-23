import { IAuthUser } from '../user';

export interface IGoogleUser {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: {
    value: string;
    verified: string;
  }[];
  photos: string[];
  provider: string;
}

export const reduceGoogleUser = (gUser: IGoogleUser): IAuthUser => ({
  name: gUser.displayName,
  givenName: gUser.name.givenName,
  email: gUser.emails[0].value,
});
