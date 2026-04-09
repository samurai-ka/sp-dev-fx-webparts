import { DisplayMode } from '@microsoft/sp-core-library';

export interface INoticeAndWarningProps {
  // description: string;
  notificationText: string;
  notificationIcon: string;
  notificationType?: string;
  isShadow?: boolean;
  notificationTitle: string;
  isDarkTheme: boolean;
  hasTeamsContext: boolean;
  
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
  updateText?: (value: string) => void;

}
