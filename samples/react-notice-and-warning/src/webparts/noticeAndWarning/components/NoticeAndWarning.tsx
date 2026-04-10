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

    // map notification types to colors
    const colorMap: Record<string, { bg: string; text: string }> = {
      Info: { bg: '#deecf9', text: '#005A9E' },
      Warning: { bg: '#fff4ce', text: '#d29200' },
      ErrorBadge: { bg: '#fde7e9', text: '#a80000' },
      Accept: { bg: '#e6f4ea', text: '#107c10' },
      ShieldAlert: { bg: '#e7f3ff', text: '#004c9a' },
      BlockedSite: { bg: '#a80000', text: '#fff2b8' }
    };

    const notifKey = this.props.notificationType || this.props.notificationIcon || '';
    const notif = (notifKey && colorMap[notifKey]) ? colorMap[notifKey] : { bg: 'transparent', text: 'var(--bodyText)' };
    const rootStyle: React.CSSProperties = {
      backgroundColor: notif.bg,
      color: notif.text,
      border: `1px solid ${notif.text}`
    } as React.CSSProperties;
    const iconStyle: React.CSSProperties = { color: notif.text } as React.CSSProperties;

    if (isShadow) {
      (rootStyle as any).boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
    }

    return (
      <section className={`${styles.noticeAndWarning} ${hasTeamsContext ? styles.teams : ''}`} style={rootStyle}>
        <span className={styles.header}>
          <Icon iconName={this.props.notificationIcon} className={styles.icon} aria-label='Icon' style={iconStyle} />
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

