import React from 'react';
import './style.scss';

class GenericCard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {

    return (
      <div className="dereklo">
        {this.props.children}
      </div>
    );
  }
}

export default GenericCard;
