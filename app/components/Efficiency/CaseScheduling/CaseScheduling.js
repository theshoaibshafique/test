import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Header from '../Header';

const CaseScheduling = () => (
  <div className="page-container">
    <Header></Header>
    <Grid container className="efficiency-container">
      <Grid item xs={6} style={{ paddingRight: '0px' }}>
        <Grid container item xs={12} spacing={5}>
          <Grid item xs={6} style={{ paddingRight: '0px' }}>
            <Card>
              <CardContent>
                                    Under-schedule percentage
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} style={{ paddingRight: '0px' }}>
            <Card>
              <CardContent>
                                    Preventable OT Minutes Due to Late First Case
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={5}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                Under-Schedule Trend
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={5}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                Change in Delays
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                                    Procedure Type List
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </div>
);

export default CaseScheduling;
