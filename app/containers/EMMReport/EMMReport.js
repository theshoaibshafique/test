import React from 'react';
import Button from '@material-ui/core/Button';
import './style.scss';
import logo from './images/emmLogo.png';
import globalFuncs from '../../utils/global-functions';
import { GENERAL_SURGERY, UROLOGY, GYNECOLOGY, COMPLICATIONS, SPECIALTY } from '../../constants';
import { Drawer, List, ListItem, ListItemText, Grid, Typography } from '@material-ui/core';
import MultiVideo from './MultiVideo/MultiVideo';
import AnnotationGroup from './AnnotationGroup/AnnotationGroup';

export default class EMMReport extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      currentEvent: 0, // index of current viewed Event
      isPublished: false,
      isScriptReady: false
    };
  }

  componentDidMount() {
    this.getCase()
    this.loadAMPScript()
  };

  loadAMPScript() {
    if (document.querySelector('#amp-azure')) {
      this.setState({ isScriptReady: true });
    };
    var scriptTag = document.createElement('script');
    var linkTag = document.createElement('link');
    linkTag.rel = 'stylesheet';
    scriptTag.id = 'amp-azure';
    scriptTag.src = '//amp.azure.net/libs/amp/2.1.5/azuremediaplayer.min.js';
    linkTag.href = '//amp.azure.net/libs/amp/2.1.5/skins/' + "amp-flush" + '/azuremediaplayer.min.css';
    document.body.appendChild(scriptTag);
    document.head.insertBefore(linkTag, document.head.firstChild);
    scriptTag.onload = () => {
      this.setState({ isScriptReady: true });
    };
  }

  getCase() {
    let reportId = '096E7268-6A19-4FE1-B707-EB57C8385416' || this.props.requestId
    globalFuncs.genericFetch(process.env.EMMREPORT_API + '/' + reportId, 'get', this.props.userToken, {})
      .then(caseData => {
        if (caseData) {
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

        } else {

          // error
        }
      });
  };

  getName(searchList, key) {
    let index = searchList.findIndex(specialty => specialty.value == key);
    if (index >= 0) {
      return searchList[index].name;
    }
  }

  getFormattedCaseDuration(caseDuration) {
    if (!caseDuration) {
      return
    }
    let hour = Math.floor(caseDuration / 3600);
    let minutes = Math.floor(caseDuration % 3600 / 60)
    return `${hour} ${hour == 1 ? 'hour ' : 'hours '} ${minutes} ${minutes == 1 ? 'minute ' : 'minutes'}`
  }

  getFormattedComplications(complications) {
    if (!complications) {
      return;
    }
    return complications.map((complication, index) => (
      `${this.getName(COMPLICATIONS, complication)}${index + 1 < complications.length ? ', ' : ' '}`
    ));
  }

  getFormattedProcedures(procedures) {
    if (!procedures) {
      return;
    }
    return procedures.map((procedure, index) => (
      `${this.getName(GENERAL_SURGERY.concat(UROLOGY).concat(GYNECOLOGY), procedure.procedureName)} (${this.getName(SPECIALTY, procedure.specialtyName)})${index + 1 < procedures.length ? ', ' : ' '}`
    ));
  }

  handleChange(currentEvent) {
    this.setState({ currentEvent })
  }

  goBack() {
    this.props.pushUrl('/emmcases');
  };

  publish() {

  }
  renderAnnotationGroup(annotationGroup,index){
  
    switch (annotationGroup.tileType) {
      case 'EmmVideo':
        return ''
      default:
        return <Grid item xs={annotationGroup.group.length > 1 ? 12 : 6} key={annotationGroup.tileType+index}><AnnotationGroup annotationGroup={annotationGroup.group} /></Grid>;
    }
    
  }

  groupAnnotations(enhancedMMData){
    //Group emm data by "Group"
    return [...enhancedMMData.reduce((hash, data) => {
      const current = hash.get(data.group) || {tileType:data.tileType,group:[]}
      current.group.push(data)
      return hash.set(data.group,current);
    }, new Map).values()];
  }

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
            {this.state.events.map((event, index) => (
              <ListItem component="ul" className="list-item" button key={index} index={index} onClick={() => this.handleChange(index)} selected={this.state.currentEvent == index}>
                <ListItemText primary={event.title} />
              </ListItem>
            ))}

            <ListItem component="ul"  style={{ marginTop: 40 }}>
              <Button disableElevation variant="contained" fullWidth className={this.state.isPublished ? "is-published" : "secondary"} disabled={this.state.isPublished} onClick={(e) => this.publish()} >{this.state.isPublished ? "Published" : 'Publish'}</Button>
            </ListItem>

            <ListItem component="ul"  style={{ marginTop: 20 }}>
              <Button disableElevation variant="contained" fullWidth className="secondary" onClick={(e) => this.goBack()} >Exit</Button>
            </ListItem>
          </List>
        </Drawer>
        <section className="">
          {this.state.events.map((event, index) => (
            <div hidden={this.state.currentEvent !== index} key={index}>
              {index == 0
                ? <Grid container spacing={0} justify="center" style={{ textAlign: "center" }}>
                  <Grid item xs={10}>
                    <img className="overview-logo" src={logo} style={{ maxWidth: "80%" }}></img>
                  </Grid>
                  <Grid item xs={10} className="overview-procedures">
                    {this.getFormattedProcedures(event.procedures)}
                  </Grid>
                  <Grid item xs={10} style={{ marginTop: 40, marginLeft: '25%', marginRight: 140, textAlign: "left" }} >
                    Case Duration: {this.getFormattedCaseDuration(event.caseDuration)}
                  </Grid>
                  <Grid item xs={10} style={{ marginBottom: 40, marginLeft: '25%', marginRight: 140, textAlign: "left" }} >
                    Complications: {this.getFormattedComplications(event.complications)}
                  </Grid>
                  <Grid item xs={10}>
                    <Button variant="outlined" className="primary" onClick={(e) => this.handleChange(1)}>Start</Button>
                  </Grid>

                </Grid>
                : <Grid container spacing={3} justify="center">
                  <Grid item xs={10} className="header">
                    {event.title}
                  </Grid>
                  <Grid item xs={10} style={{ maxHeight: 628, overflow: 'hidden', marginBottom: 10 }}>
                    {this.state.isScriptReady && <MultiVideo header={event.enhancedMMData[0].header} assets={event.enhancedMMData[0].assets}></MultiVideo>}
                  </Grid>


                  <Grid item xs={10}>
                    <Grid container spacing={3}>
                      {this.groupAnnotations(event.enhancedMMData).map((annotationGroup, index) => (
                        this.renderAnnotationGroup(annotationGroup,index)
                      ))}
                    </Grid>
                  </Grid>
                  <Grid item xs={10}>
                    <Grid container spacing={0}>
                      <Grid item xs={6}>
                        <Button disableElevation variant="contained" className="secondary" onClick={(e) => this.handleChange(index - 1)} >Back</Button>
                      </Grid>
                      <Grid item xs={6} style={{ textAlign: 'right' }} hidden={index + 1 >= this.state.events.length}>
                        <Button variant="outlined" className="primary" onClick={(e) => this.handleChange(index + 1)}>Next</Button>
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
