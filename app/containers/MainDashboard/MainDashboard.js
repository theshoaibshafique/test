import React from 'react';
import moment from 'moment/moment';
import './style.scss';
import globalFuncs from '../../utils/global-functions';
import InfographicParagraph from './InfographicParagraph/InfographicParagraph';
import InfographicText from './InfographicText/InfographicText';
import InfographicCircle from './InfographicCircle/InfographicCircle';
import { Grid } from '@material-ui/core';
import LoadingOverlay from 'react-loading-overlay';

export default class MainDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      month: moment(),
      startDate: null,
      endDate: null,
      tileRequests: [],
      dashboardData: [],
      pendingTileCount: 0,
      isLoading: true
    }
  }

  componentDidMount() {
    this.setDashboard();
  };

  setDashboard() {
    globalFuncs.genericFetch(process.env.USER_API, 'get', this.props.userToken, {})
      .then(result => {
        if (result) {
          if (result.dashboard.name === 'DefaultDashboard') {
            this.compileTileShells(result.dashboard.tileRequest);
          }

        } else {
          // error
        }
      });
  };

  compileTileShells(tileRequestList) {
    tileRequestList.sort((a, b) => a.groupOrder - b.groupOrder);

    let container = [];
    let container2 = [];
    let container3 = [];
    tileRequestList.map((tileRequest) => {
      if (tileRequest.tileType === 'InfographicParagraph') {
        container.push(tileRequest);
      } else if (tileRequest.tileType === 'InfographicText') {
        container2.push(tileRequest);
      } else if (tileRequest.tileType === 'InfographicCircle') {
        container3.push(tileRequest);
      }
    });

    container.sort((a, b) => a.tileOrder - b.tileOrder);
    container2.sort((a, b) => a.tileOrder - b.tileOrder);
    container3.sort((a, b) => a.tileOrder - b.tileOrder);

    let tileRequests = [container, container2, container3];
    this.compileTileRequest(tileRequests);
    this.setState({ tileRequests: tileRequests });
  };

  setTileRequestDates() {
    let tileRequestList = this.state.tileRequests;

    let newTileRequestList = tileRequestList.map((requests) => {
      return requests.map((request) => {
        return { ...request, startDate: this.state.startDate, endDate: this.state.endDate }

      });
    });
    this.setState({ tileRequests: newTileRequestList })
    this.compileTileRequest(newTileRequestList);
  };


  getTile(tile, index) {
    let jsonBody = {
      "endDate": tile.endDate,
      "facilityName": tile.facilityName,
      "reportName": tile.reportName,
      "startDate": tile.startDate,
      "tileType": tile.tileType,
      "dashboardName": tile.dashboardName
    }
    globalFuncs.genericFetch(process.env.DASHBOARDTILE_API, 'post', this.props.userToken, jsonBody)
      .then(result => {
        if (result === 'error' || result === 'conflict') {

        } else {
          result.tileOrder = tile.tileOrder;
          result.tileType = tile.tileType;
          result.startDate = tile.startDate;
          let db = this.state.dashboardData[index] || []
          if (moment(tile.startDate).isSame(this.state.month, 'month') && db.findIndex((t) => (t.tileOrder == result.tileOrder) < 0)) {
            
            db.push(result)
            db.sort((a, b) => a.tileOrder - b.tileOrder);
            let dashboardData = this.state.dashboardData
            dashboardData[index] = db;
            this.setState({ dashboardData });
          }
        }
        if (this.state.pendingTileCount - 1 <= 0) {
          this.notLoading()
        }
        this.setState({ pendingTileCount: this.state.pendingTileCount - 1 });
      });
  };

  compileTileRequest(tileRequests) {
    this.setState({ dashboardData: [], pendingTileCount: this.state.pendingTileCount + ([].concat(...tileRequests).length) });
    if (this.props.userToken) {
      tileRequests.map((line, index) => {
        //Only render the views for the current month (spamming between months can cause the linelist to be out of sync)
        line = line.filter((tile) => {
          return moment(tile.startDate).isSame(this.state.month, 'month');
        });
        if (!line || !line[0]) {
          return '';
        }
        line.map((tile) => {
          this.getTile(tile, index);
        });
      });
    }
  }

  renderTileShells(isDataEmpty) {
    return this.state.dashboardData.map((line, index) => {
      line = line.filter((tile, index, self) => {
        return moment(tile.startDate).isSame(this.state.month, 'month');
      });
      line = line.filter((tile, index, self) => {
        return index === self.findIndex((t) => (t.tileOrder === tile.tileOrder));
      });
      if (!line || !line[0]) {
        return '';
      }
      if (isDataEmpty) {
        return ''
      } else if (line[0].tileType === 'InfographicParagraph') {
        return <InfographicParagraph dashboardData={line} userToken={this.props.userToken} key={index}></InfographicParagraph>
      } else if (line[0].tileType === 'InfographicText') {
        return <InfographicText dashboardData={line} userToken={this.props.userToken} key={index}></InfographicText>
      } else if (line[0].tileType === 'InfographicCircle') {
        return <InfographicCircle dashboardData={line} userToken={this.props.userToken} key={index}></InfographicCircle>
      }
    });
  };

  decrementMonth = () => {
    const month = this.state.month.clone();
    this.setState({
      month: month.subtract(1, 'month'),
      startDate: month.startOf('month').format(),
      endDate: month.endOf('month').format(),
      isLoading: true
    }, () => {
      this.setTileRequestDates();
    });
  };

  incrementMonth = () => {
    const month = this.state.month.clone();
    this.setState({
      month: month.add(1, 'month'),
      startDate: month.startOf('month').format(),
      endDate: month.endOf('month').format(),
      isLoading: true
    }, () => {
      this.setTileRequestDates();
    });
  };

  loading() {
    this.setState({
      isLoading: true
    });
  }

  notLoading() {
    this.setState({
      isLoading: false
    });
  }

  render() {
    const flatList = [].concat(...this.state.dashboardData).filter((tile) => {
      return tile && moment(tile.startDate).isSame(this.state.month, 'month');
    });
    let isDataEmpty = (flatList).every((tile) => {
      return tile && tile.dataPoints.length == 0;
    });

    return (
      <section className="main-dashboard">
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item xs={12} className="header">
            Welcome {this.props.firstName} {this.props.lastName}
          </Grid>
          <Grid item xs={12} >
            <Grid container justify="center" alignItems="center">
              <Grid item xs={2}>
                <Grid container style={{ marginBottom: 10 }} className="pointer" onClick={() => this.decrementMonth()}>
                  <Grid item xs={4} className="left-arrow" ></Grid>
                  <Grid item xs={4}>
                    Previous
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={4} style={{ maxWidth: 325 }}>
                <span className="cases-date">{this.state.month.format('MMMM YYYY')}</span>
              </Grid>
              <Grid item xs={2}>
                {this.state.month.clone().add(1, 'hour') > moment()
                  ? ''
                  :
                  <Grid container justify="center" alignItems="center" style={{ marginBottom: 10, marginLeft: 24 }} className="pointer" onClick={() => this.incrementMonth()}>
                    <Grid item xs={3} style={{ maxWidth: 44 }}>
                      Next
                      </Grid>
                    <Grid item xs={4} className="right-arrow" ></Grid>

                  </Grid>
                }

              </Grid>
            </Grid>
          </Grid>
          <LoadingOverlay
              active={this.state.isLoading}
              spinner
              text='Loading your content...'
              className="Overlay"
              styles={{
                overlay: (base) => ({
                  ...base,
                  background: 'none',
                  color:'#000'
                }),
                spinner: (base) => ({
                  ...base,
                  '& svg circle': {
                    stroke: 'rgba(0, 0, 0, 0.5)'
                  }
                })
              }}
            >
          
          {isDataEmpty && !this.state.isLoading
            ? <Grid item xs={12} style={{ marginTop: 40,width:1000,height:600}}>
              <Grid container justify="center">
                No data available this month
                  </Grid>
            </Grid>
            : <Grid item xs={12}style={{width:1000,height:600}}>{this.renderTileShells(isDataEmpty)}</Grid>}
          </LoadingOverlay>
        </Grid>
      </section>
    );
  }
}