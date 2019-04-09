import React from 'react';
import './style.scss';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Dashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Grid container spacing={24}>
        <Grid item xs={6}>
          <Card className="Card">
            <CardContent className="dark-blue">
              <a href="https://www.facs.org/about-acs/statements/89-distractions" target="_blank"  style={{textDecoration: 'none'}}>
                <h3 className="Card-Header large center-align">Statement on Distrations in the Operating Room</h3>
                <div className="grey center-align padding20">
                  by the American College of Surgeons (ACS) Committee on Perioperative Care and approved by the ACS Board of Regents at its June 2016 meeting.
                  <br /><FontAwesomeIcon icon="external-link-alt" color="#999999" size="2x" />
                </div>
              </a>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className="Card">
            <CardContent className="dark-blue">
              <h3 className="Card-Header">Every second of distraction adds up</h3>
              <hr />
              <div className="dark-grey bold smaller">45 cases captured</div>
              <div className="card-content center-align">
                Distraction time in your hospital is <br />
                <span className="large purple bold">5 minutes</span><br />
                per operation
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card className="Card">
            <CardContent className="dark-blue">
              <h3 className="Card-Header">How many instances of distractions does your team face?</h3>
              <hr />
              <Grid container spacing={24}>
                <Grid item xs={6}>
                  <div className="dark-grey bold smaller">45 cases captured</div>
                </Grid>
                <Grid item xs={6}>
                  <div className="right-align dark-grey bold smaller">132 hours captured</div>
                </Grid>
              </Grid>
              <div className="card-content center-align">
                Distraction time in your hospital is <br />
                <span className="large purple bold">5 minutes</span><br />
                per operation
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className="Card">
            <CardContent className="dark-blue">
              <h3 className="Card-Header">Search by Categories</h3>
              <hr />
              <div className="dark-grey bold smaller">4 categories</div>
              <div className="card-content center-align">
                <h5 className="medium purple bold">Door Opening</h5>
                <p>is the category with the highest number of distractions per minute</p>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className="Card">
            <CardContent className="dark-blue">
              <h3 className="Card-Header">Search by Procedure Type</h3>
              <hr />
              <div className="dark-grey bold smaller">10 procedure types</div>
              <div className="card-content center-align">
                <h5 className="medium purple bold">Gastric Sleeve</h5>
                <p>The procedure with the highest number of distractions per minute</p>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className="Card">
            <CardContent className="dark-blue">
              <h3 className="Card-Header">Search by Operating Room</h3>
              <hr />
              <div className="dark-grey bold smaller">3 Operating rooms</div>
              <div className="card-content center-align">
                <h5 className="medium purple bold">Room #6</h5>
                <p>Operating Room with the highest inefficiency</p>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default Dashboard;
