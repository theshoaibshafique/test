import React from 'react';
import ReactMinimalPieChart from 'react-minimal-pie-chart';

export default class InfographicCircle extends React.PureComponent {
    constructor(props) {
        super(props);
        
        }

    render() {
        if (this.props.line.length == 1) {
            return <div>
                        <div className="cases">
                            <div className="cases-div center-align">N/A</div>
                        </div>

                        <div className="cases">
                            <div className="cases-div center-align case-font"> N/A </div>
                        </div>

                        <div className="cases">
                            <div className="cases-div center-align case-font">N/A</div>
                        </div>
                    </div>
        } else {
            return <div>
                        <div className="cases">
                        { this.props.line.map((tile) => {
                            return <div className="cases-div center-align" key={tile.reportName} >
                                        <ReactMinimalPieChart
                                            data={[ { color: '#3db3e3', value: 90 },
                                                    { color: '#e6e6e6', value: 10 }
                                                ]}
                                            lineWidth={20}
                                            style={{ position: "relative" }}
                                        >
                                            <div className="chart-inner-text" key={tile.reportName}>
                                                <p className="chart-inner-value" key={tile.reportName}>99%</p>
                                            </div> 
                                        </ReactMinimalPieChart>
                                    </div>
                            })
                        }
                        </div>
                        <div className="cases">
                        { this.props.line.map((tile) => {
                            return <div className="cases-div center-align case-font" key={tile.reportName}> 990</div>
                            })
                        }
                        </div>
                        <div className="cases">
                        { this.props.line.map((tile) => {
                            return <div className="cases-div center-align case-font" key={tile.reportName}> Cases Processed</div>
                            })
                        }
                        </div>
                    </div>
        }
    }
}