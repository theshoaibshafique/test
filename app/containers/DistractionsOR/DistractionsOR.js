/*
 * Distractions Page
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import './style.scss';
import InsightDate from 'components/InsightDate';
import ProcedureFilter from 'components/ProcedureFilter';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DistractionsORInfo from '../../components/Distractions/DistractionsORInfo';
import globalFuncs from '../../global-functions';

export default class DistractionsCategory extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      currentProcedure: 'All',
      numberOfCase: 66,
      numberOfHours: 133,
      roomStatus: [
        ['1st Floor, Room #4', 'layout1.jpg', 72, 5, 4, 41],
        ['1st Floor, Room #6', 'layout2.jpg', 82, 3, 3, 43],
        ['2nd Floor, Room #1', 'layout2.jpg', 30, 2, 3, 31]
      ]
    }
  }

  componentWillMount() {
    this.fetchContainerData();
  }

  fetchContainerData() {
    this.card1Data();
  }

  card1Data() {
    let currentRooms = this.props.facilityRooms;
    globalFuncs.getInsightData(process.env.DISTRACTIONS_API, 'DDOR_DPH', this.props.usertoken).then((result) => {
      let rooms = result.body.GroupItems.map((room) => {
        return [currentRooms[room.roomName], 'layout1.jpg',
                globalFuncs.customMinMax(room.averageAlertPerMin), globalFuncs.customMinMax(room.averageDoorDurationPerMin),
                globalFuncs.customMinMax(room.averageExtCommPerMin), globalFuncs.customMinMax(room.averageInOutTrafficPerMin)]
      })
      this.setState({
        roomStatus: rooms
      });
    })
  }

  procedureChange(e) {
    this.setState({
      currentProcedure: e.target.value
    })
  }

  render() {
    let columnSize = (this.state.roomStatus.length < 3) ? 6 : 3;
    let roomList = this.state.roomStatus.map((room, index) => {
      return <Grid key={index} item xs={columnSize}>
                <Card className="Card">
                  <CardContent className="dark-blue">
                    <DistractionsORInfo key={index} room={room} />
                  </CardContent>
                </Card>
              </Grid>
    })


    return (
      <section className="Distractions">
        <Helmet>
          <title>Distractions</title>
          <meta name="description" content="SST Insights" />
        </Helmet>
        <Grid container spacing={24} className="Main-Dashboard-Header">
          <Grid item xs={6} className="Dashboard-Welcome dark-blue">
            <ProcedureFilter
              currentProcedure={this.state.currentProcedure}
              caseNo={this.state.numberOfCase}
              hoursNo={this.state.numberOfHours}
              procedureChange={(e) => this.procedureChange(e)}
            />
          </Grid>
          <Grid item xs={6} className="flex right-center">
            <InsightDate
              quarter={1}
              year={2019}
            />
          </Grid>
        </Grid>
        <div className="Package-Section Distractions-By-OR">
          <div className="Distractions-Room-Wrapper">
            <Grid container spacing={24}>
              {roomList}
            </Grid>
          </div>
        </div>
      </section>
    );
  }
}