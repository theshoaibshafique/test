import React from 'react';
import globalFuncs from '../../../utils/global-functions';
import { Grid } from '@material-ui/core';

export default class InfographicParagraph extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dashboardData: this.props.dashboardData[0] ||  {
                footer: '',
                description: '',
                dataPoints: {
                    valueX: ''
                },
                dataDate: null
            }
        }
    };

    render() {
        let desc = '';
        if (this.state.dashboardData.description) {
            desc = this.state.dashboardData.description.replace('{0}', this.state.dashboardData.dataPoints[0].valueX);
        }
        return <div style={{marginBottom:24}}>
                    { this.props.dashboardData.map((tile) => {
                        return <Grid container spacing={2} justify="center" key={tile.tileOrder}>
                                 <Grid item xs={12} className="cases" >{this.state.dashboardData.description ? desc : 'N/A'}</Grid>
                                 <div className="title-break"></div>
                               </Grid>
                        })
                    }
                </div>
    }
}