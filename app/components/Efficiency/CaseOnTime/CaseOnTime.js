import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Header from '../Header';
import FooterText from '../FooterText';

const CaseOnTime = () => (
  <div className="page-container">
    <Header>
    </Header>
    <Grid container spacing={5} className="efficiency-container">
      <Grid item xs={3} style={{ paddingRight: '0px' }}>
        <Grid container item xs={12} spacing={5}>
          <Grid item xs={12} style={{ paddingRight: '0px' }}>
            <Card>
              <CardContent>
                                    Case On Time
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} style={{ paddingRight: '0px' }}>
            <Card>
              <CardContent>
                                    Preventable OT Minutes Due to Late First Case
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid container item xs={3}>
        <Grid item xs={12}>
          <Card style={{ height: '600px' }}>
            <CardContent>
                        Case On Time Percentage
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                                    Case On Time Start Trend
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                                    Case Delay Distribution
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid spacing={5} container className="efficiency-container">
        <Grid item xs={12} style={{ paddingLeft: '0px' }}>
          <FooterText />
        </Grid>
      </Grid>
    </Grid>
  </div>
);

export default CaseOnTime;
