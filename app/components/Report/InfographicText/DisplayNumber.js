import React from 'react';
import { Grid } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import './style.scss';
import LoadingOverlay from 'react-loading-overlay';
import { LightTooltip } from '../../SharedComponents/SharedComponents';

export default class DisplayNumber extends React.PureComponent {
  constructor(props) {
    super(props);
  };
  
  render() {
    return (
      <LoadingOverlay
        active={!this.props.number && !this.props.message}
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
          <Grid item xs className="display-number-title normal-text">
            <span >
              {this.props.title}
              {this.props.tooltipText && <LightTooltip interactive arrow
                title={Array.isArray(this.props.tooltipText) ? this.props.tooltipText.map((line) => { return <div>{line}</div> }) : this.props.tooltipText}
                placement="top" fontSize="small"
              >
                <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
              </LightTooltip>}
            </span>
          </Grid>

          {
            this.props.message
              ?
              <Grid item xs className="display-number-message normal-text">
                {this.props.message}
              </Grid>
              :
              <Grid item xs>
                <span className="display-number">{this.props.number}</span>{this.props.unit && <span className="display-number-unit normal-text">{this.props.unit}</span>}
                {this.props.footer && <span className="display-number-footer normal-text">{this.props.footer}</span>}
              </Grid>
          }
        </Grid>
      </LoadingOverlay>
    );
  }
}