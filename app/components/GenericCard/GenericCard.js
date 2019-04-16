import React from 'react';
import './style.scss';
import CircularProgress from '@material-ui/core/CircularProgress';

class GenericCard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    let cardContent;
    if (this.props.userLoggedIn)
      cardContent = this.props.children;
    else
      cardContent = <div className="empty-card flex vertical-center center-align full-height">
                      <CircularProgress />
                    </div>

    return (
      <div className="SST-Generic-Card full-height">
        {cardContent}
      </div>
    );
  }
}

export default GenericCard;
