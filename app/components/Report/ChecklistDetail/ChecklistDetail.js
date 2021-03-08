import React from 'react';
import { Grid, withStyles, LinearProgress, IconButton, Divider, Button } from '@material-ui/core';
import { mdiCheck } from '@mdi/js';
import Icon from '@mdi/react'

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
    backgroundColor: '#028CC8',
    boxShadow: ' inset 0 -1px 0 0 rgba(0,0,0,0.2)'
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

  componentDidUpdate(prevProps) {
    if (prevProps.dataPoints != this.props.dataPoints) {
      this.prepareData();
    }
  }

  prepareData() {
    let dataPoints = this.props.dataPoints && this.props.dataPoints

    // let topItems = dataPoints.filter(point => point.subTitle)
    //   .slice(0, 5)
    //   .map((point) => point.title + point.subTitle + point.valueX);
    dataPoints = this.groupTiles(dataPoints);
    this.setState({ dataPoints });
  }

  componentDidMount() {
    this.prepareData();
  }

  getName(searchList, key) {
    let index = searchList.findIndex(item => item.value.toLowerCase() == key.toLowerCase());
    if (index >= 0) {
      return searchList[index].name;
    }
  }

  groupTiles(dataPoints) {
    const orderBy = { "Briefing": 1, "Time Out": 2, "Debriefing": 3 };
    //Group data by "Group"
    return [...dataPoints.reduce((hash, data) => {
      const current = hash.get(data.title) || { title: data.title, group: [] }
      if (!data.subTitle) {
        current.total = data.valueX;
      } else if (data.valueX == 100) {
        current.completedCount = current.completedCount ? current.completedCount + 1 : 1;
      }
      current.group.push(data)

      return hash.set(data.title, current);
    }, new Map).values()].sort((a, b) => orderBy[a.title] - orderBy[b.title]);
  }

  renderData() {
    // let dataPoints = this.props.dataPoints.sort((a, b) => { return ('' + a.title).localeCompare(b.title) || b.valueX - a.valueX });
    return this.state.dataPoints && this.state.dataPoints.map((dataGroup, i) => {
      return (
        <Grid item xs key={i} className={"checklist-list"}>
          {dataGroup.group.map((point, j) => {
            let value = parseInt(point.valueX && point.valueX.replace('%', ''));
            let isTopItem = this.state.topItems.includes(point.title + point.subTitle + point.valueX);
            return (
              <Grid container spacing={0} key={`${i}-${j}`}
                className={`${isTopItem ? 'top-item' : ''} ${value >= 100 ? 'complete-item' : ''}`}
              >
                <Grid item xs={10} className={point.subTitle ? "list-subtitle" : "list-title"}  >
                  {point.subTitle || point.title}
                </Grid>
                {point.valueZ
                  ? <Grid item xs={2} className="list-subtitle-no-data">{point.valueZ}</Grid>
                  : <Grid item xs={2} className={point.subTitle ? "list-subtitle-value" : "list-title-value"}>
                    {point.valueX == 100 ? <Icon color="#028CC8" path={mdiCheck} size={'16px'} /> : point.valueX && `${point.valueX}%`}
                  </Grid>}

                {/* {!point.subTitle && <Grid item xs={12}><Divider className="ssc-divider" /></Grid>} */}
                {point.subTitle && <Grid item xs={12} style={{ marginBottom: 24 }}>
                    <BorderLinearProgress
                      variant="determinate"
                      value={value}
                    />
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
      <Grid container spacing={3} justify='space-between' className={`checklistdetail max-width-${this.state.dataPoints && this.state.dataPoints.length || 1}`} >
        <Grid item xs={12} className="chart-title">
          {this.props.title}
        </Grid>
        <Grid container spacing={6} className="checklist-lists">
          {this.renderData()}
        </Grid>

      </Grid>
    );
  }
}