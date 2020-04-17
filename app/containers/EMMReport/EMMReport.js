import React from 'react';
import Button from '@material-ui/core/Button';
import './style.scss';
import logo from './images/emmLogo.png';
import overviewImage from './images/overviewImage.png';
import globalFuncs from '../../utils/global-functions';
import { GENERAL_SURGERY, UROLOGY, GYNECOLOGY, COMPLICATIONS, SPECIALTY } from '../../constants';
import { Drawer, List, ListItem, ListItemText, Grid, Typography, Card, CardContent } from '@material-ui/core';
import MultiVideo from './MultiVideo/MultiVideo';
import AnnotationGroup from './AnnotationGroup/AnnotationGroup';

export default class EMMReport extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      currentEvent: 0, // index of current viewed Event
      isPublished: false,
      isScriptReady: false,
      emmPublishAccess: false
    };
  }

  componentDidMount() {
    this.getCase();
    this.loadAMPScript();
    this.getEMMPublishAccess();
  };

  getEMMPublishAccess() {
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
              this.setState({ emmPublishAccess: true })
            }
          });
        }
      })
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
    linkTag.href = '//amp.azure.net/libs/amp/2.1.5/skins/' + "amp-default" + '/azuremediaplayer.min.css';
    document.body.appendChild(scriptTag);
    document.head.insertBefore(linkTag, document.head.firstChild);
    scriptTag.onload = () => {
      this.setState({ isScriptReady: true });
    };
  }

  getCase() {
    let reportId = this.props.requestId
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
          this.setState({ isPublished: caseData.published, events });

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
    return <Typography className="overview-text">{`${hour} ${hour == 1 ? 'hour ' : 'hours '} ${minutes} ${minutes == 1 ? 'minute ' : 'minutes'}`}</Typography>
  }

  getFormattedComplications(complications) {
    if (!complications) {
      return;
    }
    return complications.map((complication, index) => (
      <Typography key={complication} className="overview-text">{this.getName(COMPLICATIONS, complication)}</Typography>
    ));
  }

  getFormattedProcedures(procedures) {
    if (!procedures) {
      return;
    }
    return procedures.map((procedure, index) => (
      <Typography key={procedure.procedureName} className="overview-text">{`${this.getName(GENERAL_SURGERY.concat(UROLOGY).concat(GYNECOLOGY), procedure.procedureName)} - ${this.getName(SPECIALTY, procedure.specialtyName)}`}</Typography>
    ));
  }

  handleChange(currentEvent) {
    this.setState({ currentEvent })
  }

  goBack() {
    this.props.goBack();
  };

  publish() {
    const jsonBody = {
      "name": this.props.requestId,
      "published": !this.state.isPublished
    }
    globalFuncs.genericFetch(process.env.EMMPUBLISH_API, 'PATCH', this.props.userToken, jsonBody)
      .then(result => {
        if (result === 'error' || result === 'conflict') {

        } else {
          this.setState({ isPublished: !this.state.isPublished })
        }
      });
  }
  renderAnnotationGroup(annotationGroup, index) {

    switch (annotationGroup.tileType) {
      case 'EmmVideo':
        return ''
      default:
        return <Grid item xs={annotationGroup.group.length > 1 ? 12 : 6} key={annotationGroup.tileType + index}><AnnotationGroup annotationGroup={annotationGroup.group} /></Grid>;
    }

  }

  groupAnnotations(enhancedMMData) {
    //Group emm data by "Group"
    return [...enhancedMMData.reduce((hash, data) => {
      const current = hash.get(data.group) || { tileType: data.tileType, group: [] }
      current.group.push(data)
      return hash.set(data.group, current);
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
              <ListItem component="ul" className="list-item" button key={index} index={index} onClick={() => this.handleChange(index)} selected={this.state.currentEvent == index}
              >
                <ListItemText primary={event.title} />
              </ListItem>
            ))}

            <ListItem component="ul" style={{ marginTop: 40 }}>
              <Button disableElevation variant="contained" fullWidth className={this.state.isPublished ? "is-published" : "secondary"} disabled={this.state.isPublished} onClick={(e) => this.publish()} >{this.state.isPublished ? "Published" : 'Publish'}</Button>
            </ListItem>
            {this.state.emmPublishAccess &&
              <ListItem component="ul" style={{ marginTop: 20 }}>
                <Button disableElevation variant="contained" fullWidth className="secondary" onClick={(e) => this.goBack()} >Exit</Button>
              </ListItem>}
          </List>
        </Drawer>
        <section className="emm-report-main">
          {this.state.events.map((event, index) => (
            <div hidden={this.state.currentEvent !== index} key={index}>
              {index == 0
                ? <Grid container spacing={0} justify="center" justify="center" alignItems="center" style={{ textAlign: "center" }}>
                  <Grid item xs={6} className="header">
                  </Grid>
                  <Grid item xs={6}>
                    <img className="" src={logo} style={{ maxWidth: "200px", float: 'right' }} />
                  </Grid>
                  <Grid item xs={6}>
                    <img className="" src={overviewImage} style={{ maxWidth: "90%" }} />
                  </Grid>
                  <Grid item xs={6} >
                    <Grid container spacing={0} justify="center" alignItems="center">
                      <Grid item xs={12}>
                        <Card variant="outlined" className="overview-card" style={{ textAlign: "left", border:'none'}}>
                          <CardContent>
                            <Typography color="textPrimary" variant="body1" className="overview-subtitle" style={{ fontWeight: 'bold' }} component="div">
                              Case
                            </Typography>
                            {this.getFormattedCaseDuration(event.caseDuration)}
                            {this.getFormattedProcedures(event.procedures)}
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12}>
                        <Card variant="outlined" className="overview-card" style={{ textAlign: "left", border:'none' }}>
                          <CardContent>
                            <Typography color="textPrimary" variant="body1" className="overview-subtitle" style={{ fontWeight: 'bold' }} component="div">
                              Complications
                            </Typography>
                            {this.getFormattedComplications(event.complications)}
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={8}>
                    <Button variant="outlined" className="primary" style={{ width: "60%", marginTop: 20 }} onClick={(e) => this.handleChange(1)}>Start</Button>
                  </Grid>

                </Grid>
                : <Grid container spacing={3} justify="center">
                  <Grid item xs={5} className="header">
                    {event.title}
                  </Grid>
                  <Grid item xs={5}>
                    <img className="" src={logo} style={{ maxWidth: "200px", float: 'right' }}></img>
                  </Grid>
                  <Grid item xs={10} >
                    {this.state.isScriptReady && <MultiVideo header={event.enhancedMMVideo[0].header} annoationTimes={event.enhancedMMData.map((annotation) => { return annotation.header })} assets={event.enhancedMMVideo[0].assets} currentEvent={this.state.currentEvent}></MultiVideo>}
                  </Grid>


                  <Grid item xs={10}>
                    <Grid container spacing={3}>
                      {this.groupAnnotations(event.enhancedMMData).map((annotationGroup, index) => (
                        this.renderAnnotationGroup(annotationGroup, index)
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
