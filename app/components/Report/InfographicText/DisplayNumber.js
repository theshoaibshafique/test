import React from 'react';
import { Grid, Tooltip, withStyles } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import './style.scss';
import LoadingOverlay from 'react-loading-overlay';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    padding: '16px',
    fontSize: '14px',
    lineHeight: '19px',
    fontFamily: 'Noto Sans'
  }
}))(Tooltip);

export default class DisplayNumber extends React.PureComponent {
  constructor(props) {
    super(props);
  };

  render() {
    return (
      <LoadingOverlay
        active={!this.props.number}
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
        <Grid container spacing={1} className="display-number-main" direction="column">
          <Grid item xs className="display-number-title">
            <span >
              {this.props.title}
              {this.props.tooltipText && <LightTooltip interactive arrow title={this.props.tooltipText} placement="top" fontSize="small">
                <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
              </LightTooltip>}
            </span>
          </Grid>

          {
            this.props.message
              ?
              <Grid item xs className="display-number-message">
                {this.props.message}
              </Grid>
              :
              <Grid item xs>
                <span className="display-number">{this.props.number}</span>{this.props.unit && <span className="display-number-unit">{this.props.unit}</span>}
                {this.props.footer && <span className="display-number-footer">{this.props.footer}</span>}
              </Grid>
          }
        </Grid>
      </LoadingOverlay>
    );
  }
}