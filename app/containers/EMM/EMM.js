import React from 'react';
import Button from '@material-ui/core/Button';
import './style.scss';
import globalFuncs from '../../utils/global-functions';
import { GENERAL_SURGERY, UROLOGY, GYNECOLOGY, COMPLICATIONS, SPECIALTY } from '../../constants';

export default class EMM extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      procedureNames: [],
      complicationNames: [],
      operatingRoom: '',
      compDate: null,
      specialtyNames: [],
      operatingRoomList: []
    };
  }

  componentDidMount() {
    this.getOperatingRooms();
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
        let surgeryList = GENERAL_SURGERY.concat(UROLOGY).concat(GYNECOLOGY);
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
          COMPLICATIONS.map((comp) => {
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
          SPECIALTY.map((spec) => {
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
          specialtyNames: specialtyNames
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
    this.props.pushUrl('/emmreport/' + this.props.requestId);
  }

  render() {
    return (
      <section>
        <div className="header page-title">
          <div><span className="pad">Enhanced M&M</span><Button variant="outlined" className="primary" onClick={() => this.openReport()}>Open Report</Button> </div>
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
