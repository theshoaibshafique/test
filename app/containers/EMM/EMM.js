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
      emmAccess: this.props.emmAccess,
      enhancedMMReferenceName: '',
      enhancedMMPublished: false,
      showReport: false,
      isSafari: navigator.vendor.includes('Apple')
    };
  }

  componentDidMount() {
    this.getOperatingRooms();
  };

  getOperatingRooms() {
    const { operatingRooms } = this.props;
    if (operatingRooms) {
      this.setState({ operatingRoomList: operatingRooms.map(r => ({ value: r.id, label: r.display })) }, this.getCase());
    }

  }

  getCase() {
    globalFuncs.genericFetch(process.env.EMMREQUEST_API + '/?request_id=' + this.props.requestId, 'get', this.props.userToken, {})
      .then(result => {
        if (result === 'error' || result === 'conflict') {

        } else {
          let surgeryList = this.props.specialties?.map((specialty) => specialty.procedures).flatten() || [];

          let procedureNames = [];
          let complicationList = [];
          let operatingRoom = '';
          result.roomName = result.roomName || ""

          result.procedure.map((procedure) => {
            procedureNames.push(globalFuncs.getName(surgeryList, procedure))
          });

          result.complications.map((complication) => {
            let match = false;
            this.props.complications?.map((comp) => {
              if (complication.toUpperCase() === comp.id.toUpperCase()) {
                complicationList.push(comp.display);
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
            operatingRoom: operatingRoom || result.roomName,
            compDate: new Date(result.postOpDate).toLocaleDateString(),
            enhancedMMReferenceName: result.enhancedMMReferenceName,
            enhancedMMPublished: result.enhancedMMPublished
          }, () => {
            const urlParams = new URLSearchParams(window.location.search)
            //Open the caseId through URL
            const isOpen = urlParams.get('open');
            //Remove from URL
            if (isOpen) {
              this.openReport();
            }
          });
        }
      });
  };

  renderSpecialtiesProcedures() {
    if (this.state.procedureNames.length) {
      return this.state.procedureNames.map((procedure, index) => {
        return <div className="table-row row-font normal-text" key={index}>
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
      <section className="full-height emm">
        <div className="header page-title">
          <div><span className="pad">Enhanced M&M</span></div>
          {(isReportReady) ?
            <Button variant="outlined" className="primary" onClick={() => this.openReport()}>Open Report</Button> :
            <span className="report-status subtle-subtext">(Report Status: In Progress)</span>
          }
        </div>
        {(isSafari) && <SafariWarningBanner />}

        <div className="table-row info-title">
          <div className="first-column">Date of Complications</div> <div>Operating Room</div>
        </div>

        <div className="table-row table-row-font normal-text">
          <div className="first-column">{this.state.compDate}</div> <div>{this.state.operatingRoom}</div>
        </div>

        <div>
          <div className="first-column info-title">Procedures</div>
        </div>

        {this.renderSpecialtiesProcedures()}

        <div>
          <div className="first-column margin-top info-title">Complications</div>
        </div>

        <div className="table-row-font normal-text">
          <div className="first-column">{this.state.complicationNames}</div>
        </div>

        <div>
          <Button disableElevation disableRipple variant="contained" className="secondary" onClick={() => this.goBack()}>Back</Button>
        </div>
      </section>
    );
  }
}
