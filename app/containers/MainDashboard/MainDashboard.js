import React from 'react';
import moment from 'moment/moment';
import './style.scss';
import globalFuncs from '../../utils/global-functions';
import InfographicParagraph from './InfographicParagraph';

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
    return this.state.tileRequests.map((line) => {

        return  line.map((child, index) => {
                  if (child.tileType === 'InfographicParagraph') {
                    return <InfographicParagraph line={line}></InfographicParagraph>
                  } else if (child.tileType === 'InfographicText') {
                    return <div className="cases" key={index}>N/A</div> 
                  } else if (child.tileType === 'InfographicCircle') {
                    return <div className="cases" key={index}>N/A</div> 
                  } 

                });
              
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
          <span onClick={() => this.decrementMonth()}>{'< '}</span>
          <span>{this.state.month.format('MMMM YYYY')}</span>
          <span onClick={() => this.incrementMonth()}>
            {this.state.month.clone().add(1, 'hour') > moment() ? '' : ' >'}
          </span>
        </div>
        
        {this.renderTileShells()}

        <div className="cases">
          <div className="cases-div center-align total"> 3,298</div>
          <div className="cases-div center-align total">1,000</div>
          <div className="cases-div center-align total">856</div>
        </div>

        <div className="cases">
          <div className="cases-div center-align case-font">Total Hours</div>
          <div className="cases-div center-align case-font">Total Cases</div>
          <div className="cases-div center-align case-font">Total Case Hours</div>
        </div>

        <div className="cases">
          <div className="cases-div center-align">graph</div><div className="cases-div center-align">graph</div>
        </div>

        <div className="cases">
          <div className="cases-div center-align case-font"> 990 </div>
          <div className="cases-div center-align case-font">10</div>
        </div>

        <div className="cases">
          <div className="cases-div center-align case-font">Cases Processed</div><div className="cases-div center-align case-font">Cases Opted Out</div>
        </div>
      </section>
    );
  }
}