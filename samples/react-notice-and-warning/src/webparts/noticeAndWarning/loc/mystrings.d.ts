declare interface INoticeAndWarningWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;
  UnknownEnvironment: string;
  NotificationFieldLabelInformation: string;
  NotificationFieldLabelWarning: string;
  NotificationFieldLabelError: string;
  NotificationFieldLabelSuccess: string;
  NotificationFieldLabelAlert: string;
  NotificationFieldLabelCritical: string;
}

declare module 'NoticeAndWarningWebPartStrings' {
  const strings: INoticeAndWarningWebPartStrings;
  export = strings;
}
