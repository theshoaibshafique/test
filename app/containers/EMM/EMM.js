import React from 'react';
import Button from '@material-ui/core/Button';
import './style.scss';
import globalFuncs from '../../utils/global-functions';
import { GENERAL_SURGERY, UROLOGY, GYNECOLOGY, COMPLICATIONS, OPERATING_ROOM } from '../../constants';

export default class EMM extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      requestID: '',
      report: {
        requestId: '',
        procedureName: '',
        complicationNames: [],
        operatingRoom: ''
      }
    };
  }

  componentDidMount() {
    alert(this.props.requestId);
  };

  search() {
    if (this.state.requestID) {
      this.reset();
      
      globalFuncs.genericFetch(process.env.EMMREQUEST_API + '/' + this.state.requestID, 'get', this.props.userToken, {})
      .then(result => {
        if (result === 'error' || result === 'conflict') {
          this.setState({ snackBarOpen: true })
        } else {
          let surgeryList = GENERAL_SURGERY.concat(UROLOGY).concat(GYNECOLOGY);
          let procedureName = '';
          let complicationList = [];
          let operatingRoom = '';

          surgeryList.map((surgery) => {
            if (surgery.value.toUpperCase() === result.procedure.toUpperCase()) {
              procedureName = surgery.name;
            }
          });

          result.complications.map((complication) => {
            COMPLICATIONS.map((comp) => {
              if (complication.toUpperCase() === comp.value.toUpperCase()) {
                complicationList.push(comp.name);
              }
            });
          });

          OPERATING_ROOM.map((room) => {
            if (room.value.toUpperCase() === result.operatingRoom.toUpperCase()) {
              operatingRoom = room.name;
            }
          });

          let report = {
            requestId: result.name,
            procedureName: procedureName,
            complicationNames: complicationList.join(', '),
            operatingRoom: operatingRoom
          }

          this.setState({ report: report });

          if (this.state.recentSearch.length < 5) {
            this.setState({ recentSearch: [...this.state.recentSearch, report] });
          } else if (this.state.recentSearch.length = 5) {
            let search = this.state.recentSearch;
            search.shift();
            search.push(report);
            this.setState({ recentSearch: search });
          }
          
          localStorage.setItem('recentSearch', JSON.stringify([this.state.recentSearch]));
        }
      });
    }
  };

  render() {
    return (
      <section>
        <div className="header">
          <p>Enhanced M&M Cases</p>
        </div>

        <div><p>Please enter your eM&M Request ID below and click Search to retrieve your report or open a recently accessed report.</p></div>

        <div>
          <Button variant="contained" className="primary" onClick={() => this.search()}>Search</Button>  
        </div>

      </section>
    );
  }
}
