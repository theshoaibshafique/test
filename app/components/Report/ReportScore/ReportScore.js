import React from 'react';
import { Grid, Tooltip, withStyles } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import './style.scss';
import LoadingOverlay from 'react-loading-overlay';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    padding: '24px 16px',
    fontSize: '14px',
    lineHeight: '19px',
    font: 'Noto Sans'
  }
}))(Tooltip);

export default class ReportScore extends React.PureComponent {
  constructor(props) {
    super(props);
  };

  redirect() {
    this.props.pushUrl(this.props.redirectLink);
  }

  render() {
    return (
      <LoadingOverlay
        active={!this.props.score}
        spinner
        className="overlays"
        styles={{
          overlay: (base) => ({
            ...base,
            background: 'none',
            color: '#000'
          }),
          spinner: (base) => ({
            ...base,
            '& svg circle': {
              stroke: 'rgba(0, 0, 0, 0.5)'
            }
          })
        }}
      >
        <Grid container spacing={0} style={{ textAlign: 'center', minHeight: 190 }} className="report-score">
          <Grid item xs={12} className="score-title">
            <span >
              {this.props.title}
              {this.props.tooltipText && <LightTooltip arrow title={this.props.tooltipText} placement="top" fontSize="small">
                <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
              </LightTooltip>}
            </span>
          </Grid>
          {this.props.message && <Grid item xs={12} style={{padding:'42px 0'}}>
            <div className="score-message">{this.props.message}</div>
            {this.props.subTitle && <div className="score-subtitle">
              {this.props.subTitle}
            </div>}
          </Grid>}


          {this.props.score >= 0 && <Grid item xs={12} className="score-display">
            {this.props.score}
          </Grid>}
          {this.props.redirectLink &&
            <Grid item xs={12} className="link">
              <a onClick={() => this.redirect()}>{this.props.redirectDisplay}</a>
            </Grid>
          }
        </Grid>
      </LoadingOverlay>
    );
  }
}