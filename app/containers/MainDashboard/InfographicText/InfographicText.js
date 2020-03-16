import React from 'react';
import globalFuncs from '../../../utils/global-functions';

export default class InfographicText extends React.PureComponent {
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
            this.setState ({ dashboardData: [] });
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
        return <div>
                    <div className="cases" key={Math.random()}>
                    { this.state.dashboardData.map((tile, index) => {
                        return <div className="cases-div center-align total" key={index}> {tile.dataPoints.length ? tile.dataPoints[0].valueX : 'N/A'}</div>
                        })
                    }
                    </div>
                    <div className="cases" key={Math.random()}>
                    { this.state.dashboardData.map((tile, index) => {
                        return <div className="cases-div center-align case-font" key={index}> {tile.footer ? tile.footer : 'N/A'}</div>
                        })
                    }
                    </div>
                </div>
    }
}