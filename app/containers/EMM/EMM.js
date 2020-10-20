import React from 'react';
import Button from '@material-ui/core/Button';
import './style.scss';
import globalFuncs from '../../utils/global-functions';
import { SafariWarningBanner } from '../EMMReports/SafariWarningBanner';

export default class EMM extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      procedureNames: [],
      complicationNames: [],
      operatingRoom: '',
      compDate: null,
      specialtyNames: [],
      operatingRoomList: [],
      emmAccess: false,
      enhancedMMReferenceName: '',
      enhancedMMPublished: false,
      showReport: false,
      isSafari: navigator.vendor.includes('Apple')
    };
  }

  componentDidMount() {
    this.getOperatingRooms();
    this.getEMMAccess();
  };

  getEMMAccess() {
    fetch(process.env.EMMACCESS_API, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + this.props.userToken,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.status === 200) {
        response.json().then((result) => {
          if (result) {
            this.setState ({ emmAccess: true })
          }
        });
      }
    })
  };

  getOperatingRooms(){
    globalFuncs.genericFetch(process.env.LOCATIONROOM_API + "/" + this.props.userFacility, 'get', this.props.userToken, {})
      .then(result => {
        let operatingRoomList = [];
        if (result) {
          result.map((room) => {
            operatingRoomList.push({ value: room.roomName, label: room.roomTitle })
          });
        }
        this.setState({ operatingRoomList },this.getCase());
      });
  }

  getCase() {
    globalFuncs.genericFetch(process.env.EMMREQUEST_API + '/' + this.props.requestId, 'get', this.props.userToken, {})
    .then(result => {
      if (result === 'error' || result === 'conflict') {

      } else {
        let surgeryList = this.props.specialties && this.props.specialties.map((specialty) => specialty.procedures).flatten() || [];

        let procedureNames = [];
        let complicationList = [];
        let operatingRoom = '';

        result.procedure.map((procedure) => {
          procedureNames.push(globalFuncs.getName(surgeryList,procedure))
        });

        result.complications.map((complication) => {
          let match = false;
          this.props.complications && this.props.complications.map((comp) => {
            if (complication.toUpperCase() === comp.value.toUpperCase()) {
              complicationList.push(comp.name);
              match = true;
            }
          });
          if (!match) { complicationList.push(complication); }
        });
        this.state.operatingRoomList.map((room) => {
          if (room.value.toUpperCase() === result.roomName.toUpperCase()) {
            operatingRoom = room.label;
          }
        });

        this.setState({
          procedureNames: procedureNames,
          complicationNames: complicationList.join(', '),
          operatingRoom: operatingRoom,
          compDate: new Date(result.postOpDate).toLocaleDateString(),
          enhancedMMReferenceName: result.enhancedMMReferenceName,
          enhancedMMPublished: result.enhancedMMPublished
        });
      }
    });
  };

  renderSpecialtiesProcedures() {
    if (this.state.procedureNames.length) {
      return this.state.procedureNames.map((procedure, index) => {
        return  <div className="table-row row-font" key={index}>
                  <div>{procedure}</div>
                </div>
      });
    }
  }

  goBack() {
    this.props.pushUrl('/emmcases');
  };

  openReport() {
    this.props.showEMMReport(this.state.enhancedMMReferenceName)
  }

  render() {
    const { enhancedMMReferenceName, enhancedMMPublished, emmAccess, isSafari } = this.state;
    const isReportReady = (enhancedMMReferenceName && enhancedMMPublished && emmAccess)
    return (
      <section className="full-height">
        <div className="header page-title">
          <div><span className="pad">Enhanced M&M</span></div>
          {(isReportReady) ?
            <Button variant="outlined" className="primary" onClick={() => this.openReport()}>Open Report</Button> :
            <span className="report-status">(Report Status: In Progress)</span>
          }
        </div>
        <SafariWarningBanner />
        {(isSafari) && <SafariWarningBanner />}

        <div className="table-row info-title">
          <div className="first-column">Date of Complications</div> <div>Operating Room</div>
        </div>

        <div className="table-row table-row-font">
          <div className="first-column">{this.state.compDate}</div> <div>{this.state.operatingRoom}</div>
        </div>

        <div>
          <div className="first-column info-title">Procedures</div>
        </div>

        {this.renderSpecialtiesProcedures()}

        <div>
          <div className="first-column margin-top info-title">Complications</div>
        </div>

        <div className="table-row-font">
          <div className="first-column">{this.state.complicationNames}</div>
        </div>

        <div>
          <Button disableElevation disableRipple variant="contained" className="secondary" onClick={() => this.goBack()}>Back</Button>
        </div>
      </section>
    );
  }
}
