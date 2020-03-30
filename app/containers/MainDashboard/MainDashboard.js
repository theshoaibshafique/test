import React from 'react';
import moment from 'moment/moment';
import './style.scss';
import globalFuncs from '../../utils/global-functions';
import InfographicParagraph from './InfographicParagraph/InfographicParagraph';
import InfographicText from './InfographicText/InfographicText';
import InfographicCircle from './InfographicCircle/InfographicCircle';
import { Grid } from '@material-ui/core';

export default class MainDashboard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      month: moment(),
      startDate: null,
      endDate: null,
      tileRequests: []
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

    this.props.notLoading();
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

    this.setState({ tileRequests: tileRequests });
  };

  setTileRequestDates() {
    let tileRequestList = this.state.tileRequests;
    
    let newTileRequestList = tileRequestList.map((requests) => {
      return requests.map((request) => {
        return {...request, startDate: this.state.startDate, endDate: this.state.endDate}

      });
    });
    this.setState({ tileRequests: newTileRequestList })
  };

  renderTileShells() {
    if (this.props.userToken) {
      return this.state.tileRequests.map((line, index) => {
        //Only render the views for the current month (spamming between months can cause the linelist to be out of sync)
        line = line.filter((tile) => {
          return moment(tile.startDate).isSame(this.state.month,'month');
        });
        if (!line || !line[0]){
          return '';
        }
        if (line[0].tileType === 'InfographicParagraph') {
          return <InfographicParagraph line={line} userToken={this.props.userToken} key={index}></InfographicParagraph>
        } else if (line[0].tileType === 'InfographicText') {
          return <InfographicText line={line} userToken={this.props.userToken} key={index}></InfographicText>
        } else if (line[0].tileType === 'InfographicCircle') {
          return <InfographicCircle line={line} userToken={this.props.userToken} key={index}></InfographicCircle>
        } 
      });
    }
  };

  decrementMonth = () => {
    const month = this.state.month.clone();
    this.setState({ 
      month: month.subtract(1, 'month'),
      startDate: month.startOf('month').format(),
      endDate: month.endOf('month').format()
    }, () => {
          this.setTileRequestDates();
      });
  };

  incrementMonth = () => {
    const month = this.state.month.clone();
    this.setState({ 
      month: month.add(1, 'month'),
      startDate: month.startOf('month').format(),
      endDate: month.endOf('month').format()
    }, () => {
          this.setTileRequestDates();
    });
  };

  render() {
    return (
      <section>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item xs={12} className="header">
            Welcome {this.props.firstName} {this.props.lastName}
          </Grid>
          <Grid item xs={12} >
            <Grid container justify="center" alignItems="center">
              <Grid item xs={2}>
                <Grid container style={{marginBottom:10}} className="pointer" onClick={() => this.decrementMonth()}>
                  <Grid item xs={4} className="left-arrow" ></Grid>
                  <Grid item xs={4}>
                  Previous
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={4} style={{maxWidth:325}}>
                <span className="cases-date">{this.state.month.format('MMMM YYYY')}</span>
              </Grid>
              <Grid item xs={2}>
                {this.state.month.clone().add(1, 'hour') > moment() 
                ? '' 
                : 
                    <Grid container justify="center" alignItems="center" style={{marginBottom:10,marginLeft:24}} className="pointer" onClick={() => this.incrementMonth()}>
                      <Grid item xs={3} style={{maxWidth:44}}>
                      Next
                      </Grid>
                      <Grid item xs={4} className="right-arrow" ></Grid>
                      
                    </Grid>
                }
                
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
          {this.renderTileShells()}   
          </Grid>
          
        </Grid>
      </section>
    );
  }
}