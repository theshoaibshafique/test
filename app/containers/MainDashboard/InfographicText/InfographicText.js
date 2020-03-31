import React from 'react';
import globalFuncs from '../../../utils/global-functions';

export default class InfographicText extends React.PureComponent {
    constructor(props) {
        super(props);
    };



    addCommas(x){
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    render() {
        return <div style={{marginBottom:80}}>
                    <div className="cases" key={Math.random()}>
                    { this.props.dashboardData.map((tile, index) => {
                        return <div className="cases-div center-align total" key={index}> {tile.dataPoints.length ? this.addCommas(tile.dataPoints[0].valueX) : 'N/A'}</div>
                        })
                    }
                    </div>
                    <div className="cases" key={Math.random()}>
                    { this.props.dashboardData.map((tile, index) => {
                        return <div className="cases-div center-align case-font" key={index}> {tile.footer ? tile.footer : 'N/A'}</div>
                        })
                    }
                    </div>
                </div>
    }
}