import React from 'react';

export default class InfographicText extends React.PureComponent {
    constructor(props) {
        super(props);
        
        }

    render() {
        if (this.props.line.length == 1) {
            return <div>
                        <div className="cases">
                            <div className="cases-div center-align total"> {line.reportName}</div>
                        </div>
                        <div className="cases">
                            <div className="cases-div center-align case-font"> {line.tileOrder}</div>
                        </div>
                    </div>
        } else {
            return <div>
                        <div className="cases">
                        { this.props.line.map((tile) => {
                            return <div className="cases-div center-align total" key={tile.reportName}> {tile.reportName}</div>
                            })
                        }
                        </div>
                        <div className="cases">
                        { this.props.line.map((tile) => {
                            return <div className="cases-div center-align case-font" key={tile.reportName}> {tile.tileOrder}</div>
                            })
                        }
                        </div>
                    </div>
        }
    }
}