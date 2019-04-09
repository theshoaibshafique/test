/*
 * Distractions Page
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import './style.scss';
import DistractionsTypeGraph from '../../components/Distractions/DistractionsTypeGraph';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import globalFuncs from '../../global-functions';

export default class DistractionsCategory extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      graphSteps: [0, 2, 4, 6, 8, 10, 12, 14],
      graphWidth: ['15%', '85%'],
      graphPoints: [
        [10, 'Cholecystectomy', [4, 2.5, 8.9]],
        [23, 'Roux-Y Gastric Bypass', [10.75, 10, 6.6]],
        [15, 'Low Anterior Resection', [9, 6, 1]],
        [33, 'Ventral Hernia Repair', [4.56, 3, 4]]
      ],
      filter: {
        external: true,
        alerts: true,
        door: true,
      }
    };
  }
  // .toFixed(2);
  changeFilter(e) {
    let currentFilter = {...this.state.filter};
    currentFilter[e.target.name] = !currentFilter[e.target.name];
    this.setState({
      filter: currentFilter
    });
  }

  componentWillMount() {
    this.fetchContainerData();
  }

  fetchContainerData() {
    this.card1Data();
  }

  card1Data() {
    globalFuncs.getInsightData(process.env.DISTRACTIONS_API, 'DDPT_DBPTPOPD', this.props.usertoken).then((result) => {
      let graphPoints = result.body.GroupItems.map((graphPoint) => {
        return [graphPoint.procedureCount, graphPoint.procedureTitle, [((graphPoint.averageExtComm * 100).toFixed(2)), ((graphPoint.averageAlert * 100).toFixed(2)), ((graphPoint.averageDoor * 100).toFixed(2))]]
      })
      this.setState({
        graphPoints: graphPoints
      });
    })
  }

  render() {
    return (
      <section className="Distractions">
        <Helmet>
          <title>Distractions</title>
          <meta name="description" content="SST Insights" />
        </Helmet>
        <button onClick={() => this.fetchContainerData()}>Fetch</button>
        <Card className="Card Distraction-Category-Card">
          <CardContent className="dark-blue">
            <h3 className="Card-Header">Alerts include alarms and noise from surgical devices</h3>
            <hr />
            <DistractionsTypeGraph
              graphSteps={this.state.graphSteps}
              graphWidth={this.state.graphWidth}
              graphPoints={this.state.graphPoints}
              filter={this.state.filter}
              changeFilter={(e) => this.changeFilter(e)}
            />
          </CardContent>
        </Card>
      </section>
    );
  }
}