import React from 'react';
import ReactMinimalPieChart from 'react-minimal-pie-chart';
import globalFuncs from '../../../utils/global-functions';

export default class InfographicCircle extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dashboardData: []
        }
    };

    componentDidMount() {
        this.props.line.map((tile) => {
            this.getTile(tile);
        });
    };

    componentDidUpdate(prevProps) {
        if (prevProps.line != this.props.line) {
            this.props.line.map((tile) => {
                this.getTile(tile);
            });
        }
    }

    getTile(tile) {
        let jsonBody = {
            "endDate": tile.endDate,
            "facilityName": tile.facilityName,
            "reportName": tile.reportName,
            "startDate": tile.startDate,
            "tileType": tile.tileType,
            "dashboardName": tile.dashboardName
        }

        globalFuncs.genericFetch(process.env.DASHBOARDTILE_API, 'post', this.props.userToken, jsonBody)
        .then(result => {
            if (result === 'error' || result === 'conflict') {
            
            } else {
                const dashboardData = [...this.state.dashboardData, result];
                this.setState ({ dashboardData: dashboardData });
            }
        });
    };

    render() {
        return  <div>
                    <div className="cases">
                    { this.state.dashboardData.map((tile) => {
                        const val1 = parseInt(tile.dataPoints[0].valueX);
                        const val2 = parseInt(tile.dataPoints[0].valueY);
                        const val3 = ((val1/val2)*100).toFixed(1);
                        return <div className="cases-div center-align" key={val1}>
                                    <ReactMinimalPieChart
                                        data={[ { color: '#3db3e3', value: val1 },
                                                { color: '#e6e6e6', value: val2-val1 }
                                            ]}
                                        lineWidth={20}
                                        style={{ position: "relative" }}
                                    >
                                        <div className="chart-inner-text" key={val1}>
                                            <p className="chart-inner-value" key={val1}>{val3}%</p>
                                        </div> 
                                    </ReactMinimalPieChart>
                                </div>
                        })
                    }
                    </div>
                    <div className="cases">
                    { this.state.dashboardData.map((tile) => {
                        return <div className="cases-div center-align case-font" key={tile.dataPoints[0].valueX}>{tile.dataPoints[0].valueX}</div>
                        })
                    }
                    </div>
                    <div className="cases">
                    { this.state.dashboardData.map((tile) => {
                        return <div className="cases-div center-align case-font" key={tile.footer}>{tile.footer}</div>
                        })
                    }
                    </div>
                </div>
    }
}