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
    const {
      isDarkTheme,
      hasTeamsContext,
    } = this.props;
    const NotificationIcon = () => <Icon iconName={this.props.notificationIcon} className={styles.icon} aria-label='Icon' />;

    return (
      <><section className={`${styles.noticeAndWarning} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.header}>
          <NotificationIcon />
          <WebPartTitle
                // displayMode={DisplayMode.Edit}
                displayMode={this.props.displayMode}
                title={this.props.notificationTitle}
                updateProperty={this.props.updateProperty} />
        </div>
        <div>
          <RichText
            value={this.props.notificationText}
            isEditMode={this.props.displayMode === DisplayMode.Edit}
            onChange={(text) => {
              if (this.props.updateText) { this.props.updateText(text); }
              return text;
            }}
          />
        </div>
      </section>
      </>
    );
  }


}

