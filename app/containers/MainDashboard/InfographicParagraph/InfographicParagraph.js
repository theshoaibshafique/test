import React from 'react';
import globalFuncs from '../../../utils/global-functions';

export default class InfographicParagraph extends React.PureComponent {
    constructor(props) {
        super(props);
        
        }

    componentDidMount() {
        let jsonBody = {
                "endDate": this.props.line[0].endDate,
                "facilityName": this.props.line[0].facilityName,
                "reportName": this.props.line[0].reportName,
                "startDate": this.props.line[0].startDate,
                "tileType": this.props.line[0].tileType,
                "reportName": this.props.line[0].reportName,
                "dashboardName": this.props.line[0].dashboardName
            }

        globalFuncs.genericFetch(process.env.DASHBOARDTILE_API, 'post', this.props.userToken, jsonBody)
        .then(result => {
        if (result === 'error' || result === 'conflict') {
           
        } else {
            
        }
        });
    }

    render() {
        if (this.props.line.length == 1) {
            return <div className="cases">N/A</div> 
        } else {
            return <div>
                        <div className="cases">
                        { this.props.line.map((tile) => {
                            return <div className="cases" key={tile.tileOrder}> {tile.reportName}</div>
                            })
                        }
                        </div>
                    </div>
        }
    }
}