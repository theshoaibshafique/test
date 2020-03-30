import React from 'react';
import Button from '@material-ui/core/Button';
import './style.scss';
import globalFuncs from '../../utils/global-functions';
import { GENERAL_SURGERY, UROLOGY, GYNECOLOGY, COMPLICATIONS, OPERATING_ROOM, SPECIALTY } from '../../constants';
import { Hidden, Drawer, List, ListItem, ListItemText } from '@material-ui/core';

export default class EMMReport extends React.PureComponent {
  constructor(props) {
    super(props);

    const event = {
      name:'Event 1'

    }

    this.state = {
      events: Array(5).fill(event), //Probably a list of dicts that 
      procedureNames: [],
      complicationNames: [],
      operatingRoom: '',
      compDate: null,
      specialtyNames: []
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

          OPERATING_ROOM.map((room) => {
            if (room.value.toUpperCase() === result.operatingRoom.toUpperCase()) {
              operatingRoom = room.name;
            }
          });

          result.specialty.map((specialty) => {
            let match = false;
            SPECIALTY.map((spec) => {
              if (spec.ID.toUpperCase() === specialty.toUpperCase()) {
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
            compDate: new Date(result.postOpDate).toLocaleString(),
            specialtyNames: specialtyNames
          });
        }
      });
  };

  renderSpecialtiesProcedures() {
    if (this.state.specialtyNames.length) {
      return this.state.specialtyNames.map((specialty, index) => {
        return <div className="table-row row-font" key={index}>
          <div>{this.state.procedureNames[index]}</div><div>&nbsp;({specialty})</div>
        </div>
      });
    }
  }

  goBack() {
    this.props.pushUrl('/emmcases');
  };

  render() {
    return (
      <section>
        <Drawer
          variant="permanent"
          component="nav"
          open
          className="MAIN-NAVIGATION"
        >
          <List>
            <ListItem style={{marginBottom:40}} className="header">
              <ListItemText primary={"This is a title"}/>
            </ListItem>

            {this.state.events.map((event, index) => (
              <ListItem component="ul" className="list-item" button key={index}>
                <ListItemText primary={event.name} />
              </ListItem>
            ))}
            
            <ListItem component="ul" className="list-item" style={{marginTop:40}}>
              <Button disableElevation variant="contained" fullWidth className="secondary"onClick={(e) => this.goBack()} >Exit</Button>
            </ListItem>
          </List>
        </Drawer>
      </section>
    );
  }
}
