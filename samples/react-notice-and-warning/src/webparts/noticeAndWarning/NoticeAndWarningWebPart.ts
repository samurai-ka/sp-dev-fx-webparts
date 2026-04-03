import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown
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

// Properties exports
export interface INoticeAndWarningWebPartProps {
  description: string;
  iconPicker: any;
}
export interface IPropertyControlsTestWebPartProps {
  toggleInfoHeaderValue: boolean;
}

export default class NoticeAndWarningWebPart extends BaseClientSideWebPart<INoticeAndWarningWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<INoticeAndWarningProps> = React.createElement(
      NoticeAndWarning,
      {
        description: this.properties.description,
        iconPicker: this.properties.iconPicker,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName
      }
    );

    ReactDom.render(element, this.domElement);
  }

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

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneDropdown('iconPicker', {
                  label: "Type",
                  options: [
                    { key: 'Info', text: 'Info' },
                    { key: 'Warning', text: 'Warning' },
                    { key: 'ErrorBadge', text: 'Error' },
                    { key: 'Accept', text: 'Success'},
                    { key: 'ShieldAlert', text: 'Alert'},
                    { key: 'BlockedSite', text: 'Critical'},
                  ]
                }),
                PropertyFieldIconPicker('iconPicker', {
                  currentIcon: this.properties.iconPicker,
                  key: "iconPickerId",
                  onSave: (icon: string) => { console.log(icon); this.properties.iconPicker = icon; },
                  onChanged:(icon: string) => { console.log(icon);  },
                  buttonLabel: "Sign",
                  renderOption: "dialog", // dialog or panel
                  properties: this.properties,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  label: "Sign selection",              
                }),
                PropertyPaneWebPartInformation({
                  description: `<h1>Info Header</h1>This is a <strong>demo webpart</strong>, used to demonstrate all the <a href="https://aka.ms/sppnp">PnP</a> property controls`,
                  moreInfoLink: `https://pnp.github.io/sp-dev-fx-property-controls/`,
                  videoProperties: {
                    embedLink: `https://www.youtube.com/embed/d_9o3tQ90zo`,
                    properties: { allowFullScreen: false}
                  },
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
