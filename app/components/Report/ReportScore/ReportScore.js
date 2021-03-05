import React from 'react';
import { Grid, Slider, Tooltip, withStyles } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import './style.scss';
import LoadingOverlay from 'react-loading-overlay';
import { NavLink } from 'react-router-dom';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    // padding: '16px',
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
const sliderStyles = props => ({
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
const SSTSlider = withStylesProps(sliderStyles)(props => (<Slider className={props.classes} {...props} />));
const sliderTooltipStyles = props => ({
  popper: {
    top: "-2px !important"
  },
  tooltipPlacementRight: {
    marginLeft:"28px !important",
  },
  tooltip: {
    // padding: '16px',
    fontSize: '14px',
    lineHeight: '19px',
    fontFamily: 'Noto Sans'
  }
});
const SliderTooltip = withStylesProps(sliderTooltipStyles)(props => (<Tooltip className={props.classes} {...props} />));
export default class ReportScore extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
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
                <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 2px 4px' }} />
              </LightTooltip>}
            </div>
            <div className={`score-display ${compareValue && 'large'}`}>
              {total}
            </div>
            <div >
              {this.props.url && <NavLink to={this.props.url} className='link'>
                {this.props.urlText}
              </NavLink>}
            </div>
          </Grid>

          {goal && 
            <Grid item xs={4} className="goal-slider" onMouseOver={() => this.setState({ isOpen: true })} onMouseLeave={() => this.setState({ isOpen: false })}>
              <SSTSlider
                value={total}
                orientation='vertical'
                colour={this.getColor()}
                marks={goal != null ? [{ value: goal, label: <SliderTooltip interactive arrow
                  title={`Goal: ${goal}`}
                  open={this.state.isOpen}
                  placement="right" fontSize="small"
                >
                  <div>Goal</div>
                </SliderTooltip> }] : []}
                disabled />
            </Grid>
          }
          {compareValue && <Grid item xs={12} className="compare">
            <div className="title">{compareValue.title}</div>
            <div className="compare-score">{compareValue.valueX}</div>
          </Grid>}

        </Grid>
      </LoadingOverlay>
    );
  }
}