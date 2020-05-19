import React from 'react';
import './style.scss';
import { Grid } from '@material-ui/core';

export default class ListDetailed extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataPoints: this.props.dataPoints,
            procedures: this.props.specialties && this.props.specialties.map((specialty) => specialty.procedures).flatten() || []
        }
    };

    componentDidMount() {
        this.groupTitles();
    }

    groupTitles() {
        if (!this.props.dataPoints) {
            return;
        }
        // let dataPoints = this.props.dataPoints.sort((a, b) => { return ('' + a.title).localeCompare(b.title) || b.valueX - a.valueX });
        // this.setState({ dataPoints });
    }

    getName(searchList, key) {
        let index = searchList.findIndex(item => item.value.toLowerCase() == key.toLowerCase());
        if (index >= 0) {
            return searchList[index].name;
        }
    }

    renderList() {
        
        return this.state.dataPoints.map((point,index) => {
            return (<Grid container spacing={0} key={index}>
                <Grid item xs={10} className={point.subTitle ? "list-subtitle" : "list-title"}>
                    {(point.subTitle ? this.getName(this.state.procedures, point.subTitle) : this.getName(this.props.specialties,point.title)) || point.subTitle}
                </Grid>
                <Grid item xs={2} className={point.subTitle ? "list-subtitle-value" : "list-title-value"}>
                    {point.valueX}
                </Grid>
            </Grid>)
        })
    }

    render() {

        return (<Grid container spacing={0} style={{marginBottom:24}}>
            <Grid item xs={12} className="chart-title">
                {this.props.title}
            </Grid>
            <Grid item xs={12} className="chart-subtitle">
                {this.props.subTitle}
            </Grid>
            {this.renderList()}

        </Grid>)
    }
}