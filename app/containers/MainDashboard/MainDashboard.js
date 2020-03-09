import React from 'react';
import moment from 'moment';
import './style.scss';
import globalFuncs from '../../utils/global-functions';

export default class MainDashboard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tileGroupList: [],
      month: moment(),
      minDate: null,
      maxDate: null
    }
  }

  componentDidMount() {
    globalFuncs.genericFetch(process.env.USER_API, 'get', this.props.userToken, {})
    .then(result => {
      if (result) {
        let tileGroupList = result.reports[0].tileGroup.map((tileGroup) => {
          return tileGroup
        })       

        this.setState({
          tileGroupList: tileGroupList
        });
      } else {
        this.setState({
          tileGroupList: []
        });
      }
    });

    this.props.notLoading();
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
          <span>{this.state.month.format('MMM YYYY')}</span>
          <span onClick={() => this.incrementMonth()}>
            {this.state.month.clone().add(1, 'hour') > moment() ? '' : ' >'}
          </span>
        </div>

        <div className="cases">Numbers reflect data captured by {} Operating Rooms. A Case includes Setup and Patient Entry to Exit.</div>

        <div className="cases">
          <div className="cases-div center-align total">3,298</div><div className="cases-div center-align total">1,000</div><div className="cases-div center-align total">856</div>
        </div>

        <div className="cases">
          <div className="cases-div center-align case-font">Total Hours</div><div className="cases-div center-align case-font">Total Cases</div><div className="cases-div center-align case-font">Total Case Hours</div>
        </div>

        <div className="cases">
          <div className="cases-div center-align">graph</div><div className="cases-div center-align">graph</div>
        </div>

        <div className="cases">
          <div className="cases-div center-align case-font">990</div><div className="cases-div center-align case-font">10</div>
        </div>

        <div className="cases">
          <div className="cases-div center-align case-font">Cases Processed</div><div className="cases-div center-align case-font">Cases Opted Out</div>
        </div>
      </section>
    );
  }
}