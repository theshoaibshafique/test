import React from 'react';
import { Grid, withStyles, LinearProgress, IconButton, Divider, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import './style.scss';
import LoadingOverlay from 'react-loading-overlay';

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 8,
    borderRadius: 4,
    boxShadow: ' inset 0 -1px 0 0 rgba(0,0,0,0.2)'
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'dark' ? 700 : 200],
  },
  bar: {
    borderRadius: 4,
    backgroundColor: '#FF7D7D',
    boxShadow: ' inset 0 -1px 0 0 rgba(0,0,0,0.2)'
  },
}))(LinearProgress);
const CompleteLinearProgress = withStyles((theme) => ({
  root: {
    height: 8,
    borderRadius: 4,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'dark' ? 700 : 200],
  },
  bar: {
    borderRadius: 4,
    backgroundColor: '#6FD492',
  },
}))(LinearProgress);

export default class ChecklistDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataPoints: [],
      topItems: []
    }
  };

  componentDidMount() {
    let dataPoints = this.props.dataPoints.sort((a, b) => { return parseInt(b.valueX.replace('%','')) - parseInt(a.valueX.replace('%','')) || ('' + a.subTitle).localeCompare(b.subTitle) });

    let topItems = dataPoints.filter(point => point.subTitle)
      .slice(0, 5)
      .map((point) => point.title + point.subTitle + point.valueX);
    dataPoints = this.groupTiles(dataPoints);
    this.setState({ dataPoints, topItems });
  }

  getName(searchList, key) {
    let index = searchList.findIndex(item => item.value.toLowerCase() == key.toLowerCase());
    if (index >= 0) {
      return searchList[index].name;
    }
  }

  groupTiles(dataPoints) {
    const orderBy = {"Briefing":1,"Time Out":2,"Postop Debrief":3};
    //Group data by "Group"
    return [...dataPoints.reduce((hash, data) => {
      const current = hash.get(data.title) || { title: data.title, group: [] }
      if (!data.subTitle) {
        current.total = data.valueX;
      }
      current.group.push(data)

      return hash.set(data.title, current);
    }, new Map).values()].sort((a,b) => orderBy[a.title] - orderBy[b.title]);
  }

  renderData() {
    // let dataPoints = this.props.dataPoints.sort((a, b) => { return ('' + a.title).localeCompare(b.title) || b.valueX - a.valueX });
    return this.state.dataPoints && this.state.dataPoints.map((dataGroup, i) => {
      return (
        <Grid item xs key={i} className={"checklist-list"}>
          {dataGroup.group.map((point, j) => {
            let value = parseInt(point.valueX.replace('%',''));
            let isTopItem = this.state.topItems.includes(point.title + point.subTitle + point.valueX);
            return (
              <Grid container spacing={0} key={`${i}-${j}`}
                className={`${isTopItem ? 'top-item' : ''} ${value <= 0  ? 'complete-item' : ''}`}
              >
                <Grid item xs={8} className={point.subTitle ? "list-subtitle" : "list-title"}  >
                  {point.subTitle || point.title}
                </Grid>
                {point.valueZ
                  ? <Grid item xs={4} className="list-subtitle-no-data">{point.valueZ}</Grid>
                  : <Grid item xs={4} className={point.subTitle ? "list-subtitle-value" : "list-title-value"}>
                    {point.valueX}
                  </Grid>}

                {!point.subTitle && <Grid item xs={12}><Divider className="ssc-divider" /></Grid>}
                {point.subTitle && <Grid item xs={12} style={{ marginBottom: 24 }}>
                  {value ?
                    <BorderLinearProgress
                      variant="determinate"
                      value={value}
                    /> :
                    <CompleteLinearProgress
                      variant="determinate"
                      value={100}
                    />}
                </Grid>}
                {point.description && <Grid item xs={12} className="list-text">
                  {point.description}
                </Grid>}

              </Grid>
            )
          })}
        </Grid>
      )

    })
  }

  render() {
    return (
      <LoadingOverlay
        active={!this.props.dataPoints}
        spinner
        // text='Loading your content...'
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
        <Grid container spacing={0} justify='center' className={`checklistdetail max-width-${this.state.dataPoints && this.state.dataPoints.length}`} style={{ minHeight: 320 }}>
          <Grid item xs={10} className="chart-title">
            {this.props.title}
          </Grid>
          <Grid item xs={2} style={{ textAlign: 'right', padding: '40px 24px 0 40px' }}>
            <IconButton disableRipple disableFocusRipple onClick={this.props.closeModal} className='close-button'><CloseIcon fontSize='small' /></IconButton>
          </Grid>
          <Grid container spacing={0} justify="center">
            {this.renderData()}
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'right' }}>
            <Button disableElevation disableRipple variant="contained" className="secondary" style={{ marginRight: 40, marginBottom: 40 }} onClick={(e) => this.props.closeModal()}>Close</Button>
          </Grid>
        </Grid>
      </LoadingOverlay >
    );
  }
}