import React from 'react';
import './style.scss';

export default class InfographicParagraph extends React.PureComponent {
    constructor(props) {
        super(props);

    };

    componentDidMount() {
        
    }

    renderFormattedText(){
        if (!this.props.description){
            return '';
        } 
        return this.props.description.split(" ").map((word) => {
            const pattern = /{(\d+)}/g;
            if (pattern.test(word)){
                word = this.props.dataPoints[parseInt(word.replace("{","").replace("}",""))].valueX;
                return <span style={{fontWeight:'bold'}}>{`${word} `}</span>
            } else {
                return `${word} `
            }
        });
    }

    render() {

        return <span className="ssc-info">{this.renderFormattedText()}</span>
    }
}