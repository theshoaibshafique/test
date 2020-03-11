import React from 'react';

export default class InfographicParagraph extends React.PureComponent {
    constructor(props) {
        super(props);
        
        }

    render() {
        if (this.props.line.length == 1) {
            return <div className="cases">N/A</div> 
        } else {
            return <div>
                        <div className="cases">
                        { this.props.line.map((tile) => {
                            return <div className="cases"> {tile.reportName}</div>
                            })
                        }
                        </div>
                    </div>
        }
    }
}