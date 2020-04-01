import React from 'react';
import ReactMinimalPieChart from 'react-minimal-pie-chart';
import globalFuncs from '../../../utils/global-functions';
import { Grid } from '@material-ui/core';

export default class InfographicCircle extends React.PureComponent {
    constructor(props) {
        super(props);

    };


    render() {
        return  <Grid container spacing={4} justify="center" style={{marginBottom:80}}>
                    <Grid container spacing={4} justify="center">
                        { this.props.dashboardData.map((tile) => {
                            if (tile.dataPoints.length) {
                                const val1 = parseInt(tile.dataPoints[0].valueX);
                                const val2 = parseInt(tile.dataPoints[0].valueY);
                                const val3 = ((val1/val2)*100).toFixed(1);
                                return <Grid item xs={3} className="cases-div cases-chart center-align" style={{maxWidth:240}} key={val1}>
                                            <ReactMinimalPieChart
                                                data={[ { color: tile.tileOrder == 2 ? '#121212' : '#3db3e3', value: val1 },
                                                        { color: '#e6e6e6', value: val2-val1 }
                                                    ]}
                                                lineWidth={20}
                                                startAngle={-90}
                                                style={{ position: "relative" }}
                                            >
                                                <div className="chart-inner-text" key={val1}>
                                                    <p className="chart-inner-value" key={val1}>{val3}%</p>
                                                </div> 
                                            </ReactMinimalPieChart>
                                        </Grid>
                                } else {
                                    return <div className="cases-div center-align empty-space" key={Math.random()}>N/A</div>
                                }
                            })
                        }
                    </Grid>
                    <Grid container spacing={0} justify="center">
                    { this.props.dashboardData.map((tile) => {
                            if (tile.dataPoints.length) {
                                return <Grid item xs={3} className="cases-div center-align case-font" style={{maxWidth:240}} key={tile.dataPoints[0].valueX}>{tile.dataPoints[0].valueX}</Grid>
                            } else {
                                return <Grid item xs={3} className="cases-div center-align" key={Math.random()}></Grid>
                            }
                        })
                    }
                    </Grid>
                    <Grid container spacing={0} justify="center">
                    { this.props.dashboardData.map((tile) => {
                            if (tile.dataPoints.length) {
                                return <Grid item xs={3} className="cases-div center-align case-font" style={{maxWidth:240}} key={tile.footer}>{tile.footer}</Grid>
                            } else {
                                return <Grid item xs={3} className="cases-div center-align" key={Math.random()}></Grid>
                            }
                        })
                    }
                    </Grid>
                </Grid>
    }
}