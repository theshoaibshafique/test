import React from 'react';
import './style.scss';

export default class InfographicParagraph extends React.PureComponent {
    constructor(props) {
        super(props);

    };

    componentDidMount() {
        
    }

    renderFormattedText(){
        const text = this.props.description || this.props.body;
        if (!text){
            return '';
        } 
        return text.split(" ").map((word,index) => {
            //Matches {0}, {1}, ... etc
            //Replace placeholders with datapoints
            const pattern = /{(\d+)}/g;
            if (pattern.test(word) && this.props.dataPoints){
                word = this.props.dataPoints[parseInt(word.replace("{","").replace("}",""))].valueX;
                return <span style={{fontWeight:'bold'}} key={index}>{`${word} `}</span>
            } else {
                return `${word} `
            }
        });
    }

    render() {

        return <span className="ssc-info normal-text">{this.renderFormattedText()}</span>
    }
}