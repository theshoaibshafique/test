import React from 'react';
import moment from 'moment/moment';
import './style.scss';
import globalFuncs from '../../utils/global-functions';
import InfographicParagraph from './InfographicParagraph';
import InfographicText from './InfographicText';
import InfographicCircle from './InfographicCircle';

export default class MainDashboard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      month: moment(),
      minDate: null,
      maxDate: null,
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
        if (result.dashboard.reportName === 'DefaultDashboard') {
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

  renderTileShells() {
    return this.state.tileRequests.map((line, index) => {
        if (line[0].tileType === 'InfographicParagraph') {
          return <InfographicParagraph line={line} key={index}></InfographicParagraph>
        } else if (line[0].tileType === 'InfographicText') {
          return <InfographicText line={line} key={index}></InfographicText>
        } else if (line[0].tileType === 'InfographicCircle') {
          return <InfographicCircle line={line} key={index}></InfographicCircle>
        } 
    });
  };

  decrementMonth = () => {
    this.setState(
      prevState => ({ month: prevState.month.subtract(1, 'month') }),
      this.filterByMonth()
    )
  };

  incrementMonth = () => {
    this.setState(prevState => ({ month: prevState.month.add(1, 'month') }), this.filterByMonth())
  };

  filterByMonth = () => {
    const month = this.state.month.clone();
    this.runFilter(month.startOf('month').format(), month.endOf('month').format());
  };

  runFilter = (minDate, maxDate) => {
    this.setState({ minDate: minDate, maxDate: maxDate })
  };

  render() {

    return (
      <section>
        <div className="Dashboard-Welcome">Welcome {this.props.firstName} {this.props.lastName}</div>

        <div className="cases-date">
          <span className="pointer" onClick={() => this.decrementMonth()}>{'< '}</span>
          <span>{this.state.month.format('MMMM YYYY')}</span>
          <span className="pointer" onClick={() => this.incrementMonth()}>
            {this.state.month.clone().add(1, 'hour') > moment() ? '' : ' >'}
          </span>
        </div>
        
        {this.renderTileShells()} 

      </section>
    );
  }
}