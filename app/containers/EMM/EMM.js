import React from 'react';
import Button from '@material-ui/core/Button';
import './style.scss';
import globalFuncs from '../../utils/global-functions';
import { GENERAL_SURGERY, UROLOGY, GYNECOLOGY, COMPLICATIONS, OPERATING_ROOM, SPECIALTY } from '../../constants';

export default class EMM extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      procedureName: '',
      complicationNames: [],
      operatingRoom: '',
      compDate: null,
      specialty: ''
    };
  }

  componentDidMount() {
    this.getCase();
  };

  getCase() {     
    globalFuncs.genericFetch(process.env.EMMREQUEST_API + '/' + this.props.requestId, 'get', this.props.userToken, {})
    .then(result => {
      if (result === 'error' || result === 'conflict') {
        
      } else {
        let surgeryList = GENERAL_SURGERY.concat(UROLOGY).concat(GYNECOLOGY);
        let procedureName = '';
        let complicationList = [];
        let operatingRoom = '';
        let specialty = '';

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

        SPECIALTY.map((spec) => {
          if (spec.value.toUpperCase() === result.specialty.toUpperCase()) {
            specialty = spec.name;
          }
        });

        this.setState({ 
          procedureName: procedureName,
          complicationNames: complicationList.join(', '),
          operatingRoom: operatingRoom,
          compDate: new Date(result.postOpDate).toLocaleString(),
          specialty: specialty
        });
      }
    });
  };

  goBack() {
    this.props.pushUrl('/emmcases');
  }

  render() {
    return (
      <section>
        <div className="header">
          <p>Enhanced M&M</p>
          <div>
            <Button variant="contained" className="primary">Open Report</Button>
          </div>
        </div>

        <div className="table-row">
          <div className="first-column">Date of Complications</div> <div>Operating Room</div>
        </div>

        <div className="table-row table-row-font">
          <div className="first-column">{this.state.compDate}</div> <div>{this.state.operatingRoom}</div>
        </div>

        <div>
          <div className="first-column">Specialties and Procedures</div>
        </div>

        <div className="table-row-font">
          <div>{this.state.procedureName} ({this.state.specialty})</div>
        </div>

        <div>
          <div className="first-column">Complications</div>
        </div>

        <div className="table-row-font">
          <div className="first-column">{this.state.complicationNames}</div>
        </div>

        <div>
            <Button variant="contained" className="secondary" onClick={() => this.goBack()}>Back</Button>
          </div>

      </section>
    );
  }
}
