import { AppLocation, FallbackLocation } from './app-location';

export class AppUser {
    uid: string = '';
    homeLocation: AppLocation = FallbackLocation;
    otherLocations: Array<AppLocation> = [];
    tags: Array<string> = []
    notificationToken: string = '';
  }