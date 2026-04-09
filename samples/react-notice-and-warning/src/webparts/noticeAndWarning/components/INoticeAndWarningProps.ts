import { DisplayMode } from '@microsoft/sp-core-library';

export interface INoticeAndWarningProps {
  description: string;
  notificationText: string;
  notificationIcon: string;
  notificationTitle: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;

}
