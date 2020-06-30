import React from 'react';
import Button from '@material-ui/core/Button';
import './style.scss';
import globalFuncs from '../../utils/global-functions';

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
      showReport: false
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
        let specialtyNames = [];
        result.procedure.map((procedure) => {
          let match = false;
          surgeryList.map((surgery) => {
            if (surgery.value.toUpperCase() === procedure.toUpperCase()) {
              procedureNames.push(surgery.name);
              match = true;
            }
          });
          if (!match) { procedureNames.push(procedure); }
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

        result.specialty.map((specialty) => {
          let match = false;
          this.props.specialties && this.props.specialties.map((spec) => {
            if (spec.value.toUpperCase() === specialty.toUpperCase()) {
              specialtyNames.push(spec.name);
              match = true;
            }
          });
          if (!match) { specialtyNames.push(specialty); }
        });
        this.setState({
          procedureNames: procedureNames,
          complicationNames: complicationList.join(', '),
          operatingRoom: operatingRoom,
          compDate: new Date(result.postOpDate).toLocaleDateString(),
          specialtyNames: specialtyNames,
          enhancedMMReferenceName: result.enhancedMMReferenceName,
          enhancedMMPublished: result.enhancedMMPublished
        });
      }
    });
  };

  renderSpecialtiesProcedures() {
    if (this.state.specialtyNames.length) {
      return this.state.specialtyNames.map((specialty, index) => {
        return  <div className="table-row row-font" key={index}>
                  <div>{this.state.procedureNames[index]}</div><div>&nbsp;({specialty})</div>
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
    return (
      <section className="full-height">
        <div className="header page-title">
          <div>
            <span className="pad">Enhanced M&M</span>
            {(this.state.enhancedMMReferenceName && this.state.enhancedMMPublished && this.state.emmAccess) &&
              <Button variant="outlined" className="primary" onClick={() => this.openReport()}>Open Report</Button>} </div>
        </div>

        <div className="table-row info-title">
          <div className="first-column">Date of Complications</div> <div>Operating Room</div>
        </div>

        <div className="table-row table-row-font">
          <div className="first-column">{this.state.compDate}</div> <div>{this.state.operatingRoom}</div>
        </div>

        <div>
          <div className="first-column info-title">Specialties and Procedures</div>
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
