import * as React from 'react';
import styles from './NoticeAndWarning.module.scss';
import type { INoticeAndWarningProps } from './INoticeAndWarningProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
import { Icon } from '@fluentui/react';

initializeIcons();

export default class NoticeAndWarning extends React.Component<INoticeAndWarningProps> {

  public render(): React.ReactElement<INoticeAndWarningProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;
    const NotificationIcon = () => <Icon iconName={this.props.notificationIcon} className={styles.icon} aria-label='Icon' />;

    return (
      <><section className={`${styles.noticeAndWarning} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
          <div>Icon: <strong>{escape(this.props.notificationIcon)}</strong></div>
          <NotificationIcon />
        </div>
        <div>
          <RichText value={this.props.notificationText}
                    label='Notification text area'
                    onChange={(text)=>this.onTextChange(text)}
          />
        </div>
        <div>
          <h3>Welcome to SharePoint Framework!</h3>
          <p>
            The SharePoint Framework (SPFx) is a extensibility model for Microsoft Viva, Microsoft Teams and SharePoint. It&#39;s the easiest way to extend Microsoft 365 with automatic Single Sign On, automatic hosting and industry standard tooling.
          </p>
        </div>
      </section>
      </>
    );
  }


}

