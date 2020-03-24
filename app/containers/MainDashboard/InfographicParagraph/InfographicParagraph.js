import React from 'react';
import globalFuncs from '../../../utils/global-functions';
import { Grid } from '@material-ui/core';

export default class InfographicParagraph extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dashboardData: {
                footer: '',
                description: '',
                dataPoints: {
                    valueX: ''
                },
                dataDate: null
            }
        }
    };

    componentDidMount() {
        this.loadParagraph();
    };

    componentDidUpdate(prevProps) {
        if (prevProps.line != this.props.line) {
            this.loadParagraph();
        }
    }

    loadParagraph() {
        let jsonBody = {
            "endDate": this.props.line[0].endDate,
            "facilityName": this.props.line[0].facilityName,
            "reportName": this.props.line[0].reportName,
            "startDate": this.props.line[0].startDate,
            "tileType": this.props.line[0].tileType,
            "dashboardName": this.props.line[0].dashboardName
        }
        
        globalFuncs.genericFetch(process.env.DASHBOARDTILE_API, 'post', this.props.userToken, jsonBody)
        .then(result => {
            if (result === 'error' || result === 'conflict') {
            
            } else {
                this.setState ({ dashboardData: result });
            }
        });
    }

    render() {
        let desc = '';
        if (this.state.dashboardData.description) {
            desc = this.state.dashboardData.description.replace('{0}', this.state.dashboardData.dataPoints[0].valueX);
        }
        return <div style={{marginBottom:24}}>
                    { this.props.line.map((tile) => {
                        return <Grid container spacing={2} justify="center" key={tile.tileOrder}>
                                 <Grid item xs={12} className="cases" >{this.state.dashboardData.description ? desc : 'N/A'}</Grid>
                                 <div className="title-break"></div>
                               </Grid>
                        })
                    }
                </div>
    }
}