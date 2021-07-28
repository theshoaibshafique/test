import React from 'react';

export const SafariWarningBanner = (props) => {
  const {message} = props;
  const defaultMessage = 'Warning: Enhanced M&M Reports contains videos that are currently not supported on Safari. You may still access the reports and view its contents, but we recommend using the latest version of Google Chrome or Microsoft Edge browsers for the full experience.';
  return (
    <div className="Safari-Warning-Banner">
        {message || defaultMessage}
      </div>
  )
}
