import React from 'react';
import { Grid, Slider, Tooltip, withStyles } from '@material-ui/core';
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

const withStylesProps = styles =>
  Component =>
    props => {
      const Comp = withStyles(styles(props))(Component);
      return <Comp {...props} />;
    };
const styles = props => ({
  root: {
    color: '#FFC74D',
    height: 8
  },
  disabled: {
    color: `${props.colour || '#FF4D4D'} !important`,
  },
  thumb: {
    display: 'none'
  },
  active: {},
  valueLabel: {
    color: '#004F6E',
    left: 'calc(-50% - 2px)',
  },
  mark: {
    backgroundColor: '#592D82',
    height: 2,
    width: 12,
    marginLeft: -4,
  },
  markLabel: {
    fontSize: '12px',
    fontFamily: 'Noto Sans',
    left: '-24px !important',
    color: '#592D82'
  },
  markLabelActive: {
    color: 'rgba(0, 0, 0, 0.54)'
  },
  vertical: {
    '& $track': {
      width: 8,
    },
    '& $rail': {
      width: 8,
      color: '#F3F3F3',
      opacity: 1
    },
  },
  track: {
    borderRadius: '0 0 4px 4px',
  },
  rail: {
    borderRadius: 4,
  },
});
const SSTSlider = withStylesProps(styles)(props => (<Slider className={props.classes} {...props} />));

export default class ReportScore extends React.PureComponent {
  constructor(props) {
    super(props);
  };

  getColor() {
    const { goal, total } = this.props;
    const threshold = goal * .15;
    if (total >= goal) {
      return '#6EDE95'
    } else if (total >= (goal - threshold)) {
      return '#FFC74D'
    } else {
      return '#FF4D4D'
    }

  }

  render() {
    const { title, toolTip, total, dataPoints, goal } = this.props
    let compareValue = dataPoints && dataPoints.length && dataPoints[0] || false;
    return (
      <LoadingOverlay
        active={false}
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
        <Grid container spacing={2} className="ssc-score">
          <Grid item xs={8} >
            <div className="score-title">
              {title}
              {toolTip && <LightTooltip interactive arrow
                title={toolTip.map((line) => { return <div style={!line ? { margin: 8 } : {}}>{line}</div> })}
                placement="top" fontSize="small"
              >
                <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
              </LightTooltip>}
            </div>
            <div className={`score-display ${compareValue && 'large'}`}>
              {total}
            </div>
          </Grid>
          {goal && <Grid item xs={4} className="goal-slider">
            <SSTSlider
              value={total}
              orientation='vertical'
              colour={this.getColor()}
              marks={goal != null ? [{ value: goal, label: 'Goal' }] : []}
              disabled />
          </Grid>}
          {compareValue && <Grid item xs={12} className="compare">
            <div className="title">{compareValue.title}</div>
            <div className="compare-score">{compareValue.valueX}</div>
          </Grid>}

        </Grid>
      </LoadingOverlay>
    );
  }
}