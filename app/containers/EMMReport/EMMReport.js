import React from 'react';
import Button from '@material-ui/core/Button';
import './style.scss';
import logo from './images/emmLogo.png';
import globalFuncs from '../../utils/global-functions';
import { GENERAL_SURGERY, UROLOGY, GYNECOLOGY, COMPLICATIONS, OPERATING_ROOM, SPECIALTY, TEST_DATA } from '../../constants';
import { Hidden, Drawer, List, ListItem, ListItemText, Grid } from '@material-ui/core';
import AzureVideo from './AzureVideo/AzureVideo';
import MultiVideo from './MultiVideo/MultiVideo';

export default class EMMReport extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      currentEvent: 0, // index of current viewed Event
      isPublished: false
    };
  }

  componentDidMount() {
    let caseData = this.getCase() || {};
    let events = [];
    if (caseData.name) {
      events = [{
        title: "Overview",
        procedures: caseData.procedures,
        complications: caseData.complicationNames,
        caseDuration: caseData.caseDuration
      }, ...caseData.enhancedMMPages]
    } else {
      //TODO: error flow
    }
    this.setState({ isPublished: caseData.isPublished, events });
  };

  getCase() {
    return TEST_DATA;
  };

  getName(searchList, key){
    let index = searchList.findIndex( specialty => specialty.value == key);
    if (index >= 0){
      return searchList[index].name;
    }
  }

  getFormattedCaseDuration(caseDuration){
    if (!caseDuration){
      return
    }
    let hour = Math.floor(caseDuration / 3600);
    let minutes = Math.floor(caseDuration % 3600 / 60)
    return `${hour} ${hour == 1 ? 'hour ' : 'hours '} ${minutes} ${minutes == 1 ? 'minute ': 'minutes'}`
  }

  getFormattedComplications(complications){
    if (!complications){
      return;
    }
    return complications.map((complication,index) => (
      `${this.getName(COMPLICATIONS,complication)}${index+1 < complications.length ? ', ' : ' '}`
    ));
  }

  getFormattedProcedures(procedures){
    if (!procedures){
      return;
    }
    return procedures.map((procedure,index) => (
      `${this.getName(GENERAL_SURGERY.concat(UROLOGY).concat(GYNECOLOGY),procedure.procedureName)} (${this.getName(SPECIALTY,procedure.specialtyName)})${index+1 < procedures.length ? ', ' : ' '}`
    ));
  }

  handleChange(currentEvent){
    this.setState({currentEvent})
  }

  goBack() {
    this.props.pushUrl('/emmcases');
  };

  render() {
    return (
      <main className="emm-report inline overflow-y Content-Wrapper">
        <Drawer
          variant="permanent"
          component="nav"
          open
          className="MAIN-NAVIGATION emm-report-nav"
        >
          <List>
            <ListItem style={{ marginBottom: 40 }} className="header">
              <ListItemText primary={"This is a title"} />
            </ListItem>

            {this.state.events.map((event, index) => (
              <ListItem component="ul" className="list-item" button key={index} index={index} onClick={() => this.handleChange(index)} selected={this.state.currentEvent == index}>
                <ListItemText primary={event.title} />
              </ListItem>
            ))}

            <ListItem component="ul" className="list-item" style={{ marginTop: 40 }}>
              <Button disableElevation variant="contained" fullWidth className="secondary" onClick={(e) => this.goBack()} >Exit</Button>
            </ListItem>
          </List>
        </Drawer>
        <section className="">
          {this.state.events.map((event, index) => (
            <div hidden={this.state.currentEvent !== index} key={index}>
              {index == 0 
              ? <Grid container spacing={0} justify="center" style={{textAlign:"center"}}>
                  <Grid item xs={12}>
                    <img className="overview-logo" src={logo} style={{maxWidth:"80%"}}></img>
                  </Grid>
                  <Grid item xs={12} className="overview-procedures">
                    {this.getFormattedProcedures(event.procedures)}
                  </Grid>
                  <Grid item xs={12} style={{marginTop:40, marginLeft:140,marginRight:140, textAlign:"left"}} >
                    Case Duration: {this.getFormattedCaseDuration(event.caseDuration)}
                  </Grid>
                  <Grid item xs={12} style={{marginBottom:40,marginLeft:140,marginRight:140 , textAlign:"left"}} >
                    Complications: {this.getFormattedComplications(event.complications)}
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" className="primary" onClick={(e) => this.handleChange(1)}>Start</Button>
                  </Grid>
                  
                </Grid>
              : <Grid container spacing={2} >
                  <Grid item xs={12} className="header">
                    {event.title}
                  </Grid>
                  <Grid item xs={12} >
                    <MultiVideo assets={event.enhancedMMData[0].assets}></MultiVideo>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={0} justify="space-between">
                      <Grid item xs={6}>
                        <Button disableElevation variant="contained" className="secondary" onClick={(e) => this.handleChange(index-1)} >Back</Button>
                      </Grid>
                      <Grid item xs={6} style={{textAlign:'right'}}>
                        <Button variant="outlined" className="primary" onClick={(e) => this.handleChange(index+1)}>Next</Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              }
              
            </div>
          ))}
        </section>

      </main>
    );
  }
}
