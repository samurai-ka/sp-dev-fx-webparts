import * as React from 'react';
import styles from './NoticeAndWarning.module.scss';
import type { INoticeAndWarningProps } from './INoticeAndWarningProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { Icon } from '@fluentui/react';
import { DisplayMode } from '@microsoft/sp-core-library';

initializeIcons();

export default class NoticeAndWarning extends React.Component<INoticeAndWarningProps> {
  onTextChange: any;

  public render(): React.ReactElement<INoticeAndWarningProps> {
    const { isDarkTheme, hasTeamsContext, isShadow } = this.props;

    // map notification types to CSS class names (defined in the module stylesheet)
    const typeToClass: Record<string, string> = {
      Info: 'info',
      Warning: 'warning',
      ErrorBadge: 'errorBadge',
      Accept: 'Accepted',
      ShieldAlert: 'ShieldAlert',
      BlockedSite: 'BlockedSite'
    };

    const notifKey = this.props.notificationType || this.props.notificationIcon || '';
    const cssType = (notifKey && typeToClass[notifKey]) ? typeToClass[notifKey] : '';

    // Only keep shadow as an inline style; colors and backgrounds are handled by CSS classes
    const sectionStyle: React.CSSProperties = {} as React.CSSProperties;
    if (isShadow) {
      (sectionStyle as any).boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
    }

    return (
      <section className={`${styles.noticeAndWarning} ${cssType && (styles as any)[cssType] ? (styles as any)[cssType] : ''} ${hasTeamsContext ? styles.teams : ''}`} style={sectionStyle}>
        <span className={styles.header}>
          <Icon iconName={this.props.notificationIcon} className={styles.icon} aria-label='Icon' />
          <WebPartTitle
            displayMode={this.props.displayMode}
            title={this.props.notificationTitle}
            updateProperty={this.props.updateProperty}
          />
        </span>
        
          <RichText
            value={this.props.notificationText}
            isEditMode={this.props.displayMode === DisplayMode.Edit}
            onChange={(text) => {
              if (this.props.updateText) { this.props.updateText(text); }
              return text;
            }}
          />
        
      </section>
    );
  }


}

