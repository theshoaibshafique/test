import React from 'react';
import './style.scss';

export default class MainDashboard extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.notLoading();
  };

  render() {
    return (
      <section>
        <div className="Dashboard-Welcome">Welcome {this.props.firstName} {this.props.lastName}</div>

        <div className="cases">Date</div>
        <div className="cases">Numbers reflect data captured by {2} Operating Rooms. A Case includes Setup and Patient Entry to Exit.</div>

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