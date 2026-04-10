import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version,
          DisplayMode
} from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneToggle,
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';
import {
  PropertyPaneWebPartInformation
} from '@pnp/spfx-property-controls';
import { PropertyFieldIconPicker } from '@pnp/spfx-property-controls/lib/PropertyFieldIconPicker';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'NoticeAndWarningWebPartStrings';
import NoticeAndWarning from './components/NoticeAndWarning';
import { INoticeAndWarningProps } from './components/INoticeAndWarningProps';


//
// Properties exports
//
export interface INoticeAndWarningWebPartProps {
  notificationIcon: string;
  notificationText: string;
  notificationType?: string;
  isShadow?: boolean;
  notificationIconOverride?: boolean;
  notificationTitle: string;
  cornerRadius?: number;
}

export default class NoticeAndWarningWebPart extends BaseClientSideWebPart<INoticeAndWarningWebPartProps> {
  
  //
  // Local private variables
  //
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private _notificationTitle: string = "Notification Title";  

  //
  // RENDER METHOD
  //
  public render(): void {
    // derive icon: if a custom icon was picked, respect the override; otherwise use the dropdown type
    const iconForType = this.properties.notificationIconOverride ? (this.properties.notificationIcon || 'Info') : (this.properties.notificationType || this.properties.notificationIcon || 'Info');
    const element: React.ReactElement<INoticeAndWarningProps> = React.createElement(
      NoticeAndWarning,
      {
        // desciption: this.properties.description,
        notificationIcon: iconForType,
        notificationType: this.properties.notificationType || 'Info',
        isShadow: !!this.properties.isShadow,
        notificationTitle: this.properties.notificationTitle || this._notificationTitle,
        notificationText: this.properties.notificationText,
        isDarkTheme: this._isDarkTheme,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        cornerRadius: this.properties.cornerRadius,

        displayMode: this.displayMode,
        updateProperty: (value: string) => { this.properties.notificationTitle = value; this.render(); },
        updateText: (value: string) => { this.properties.notificationText = value; this.render(); }
      }
    );

    ReactDom.render(element, this.domElement);
  }

  //
  // LIFECYCLE METHODS
  //
  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  //
  // THEME HANDLER
  //
  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }
  
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    // If the dropdown (notificationType) changed, clear any custom icon override so dropdown controls the icon again
    if (propertyPath === 'notificationType' && this.properties.notificationIconOverride) {
      this.properties.notificationIconOverride = false;
    }
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  //
  // PROPERTY PANE CONFIGURATION
  //
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneDropdown('notificationType', {
                  label: "Type",
                  selectedKey: 'Info',
                  options: [
                    { key: 'Info', text: strings.NotificationFieldLabelInformation },
                    { key: 'Warning', text: strings.NotificationFieldLabelWarning },
                    { key: 'ErrorBadge', text: strings.NotificationFieldLabelError },
                    { key: 'Accept', text: strings.NotificationFieldLabelSuccess },
                    { key: 'ShieldAlert', text: strings.NotificationFieldLabelAlert },
                    { key: 'BlockedSite', text: strings.NotificationFieldLabelCritical },
                  ]
                })

              ]
            },
            {
              groupName: "Designs",
              groupFields: [
                PropertyFieldIconPicker('notificationIcon', {
                  currentIcon: this.properties.notificationIcon,
                  key: "notificationIconId",
                  onSave: (icon: string) => { console.log(icon); this.properties.notificationIcon = icon; this.properties.notificationIconOverride = true; this.render(); },
                  onChanged:(icon: string) => { console.log(icon);  },
                  buttonLabel: "Sign",
                  renderOption: "dialog", // dialog or panel
                  properties: this.properties,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  label: "Sign selection"
                }),
                PropertyPaneToggle('isShadow', {
                  label: "Shadow",
                  onText: "Show",
                  offText: "Hidden"
                }),
                  PropertyPaneSlider('cornerRadius', {
                    label: 'Corner radius',
                    min: 0,
                    max: 10,
                    step: 1,
                    value: this.properties.cornerRadius || 0,
                    showValue: true
                  }),
                PropertyPaneWebPartInformation({
                  description: `This webpart was developed to mirror the same functionality found in other wikis. This makes it easier for users to transition to the new system, as they are already familiar with these features.`,
                  moreInfoLink: `https://pnp.github.io/sp-dev-fx-property-controls/`,
                  key: 'webPartInfoId'
                })

              ]
            }
         ]
        }
      ]
    };
  }
}
