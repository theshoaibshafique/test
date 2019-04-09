import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class PackageSelector extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      status: 'close'
    }
  }

onMouseEnter(e) {
    this.setState({
      status: 'open',
    })
  }

  onMouseLeave(e) {
    this.setState({
      status: 'close'
    })
  }

  render() {
    let linkRender;
    let isSelected = (this.props.packageName.toLowerCase() == this.props.selectedMain)? 'selected' : '';

    if (this.props.subPackage !== undefined) {
      let subPackageCollection = Object.keys(this.props.subPackage).map((key) => {
        let isSelectedSub = (this.props.subPackage[key].link == this.props.currentPath.substr(1)) ? 'selected' : ''
        return <div key={key} className="SubPackage-Link"><Link className={isSelectedSub} to={`/` + this.props.subPackage[key].link}>{this.props.subPackage[key].name}</Link></div>
      })

      if (this.props.currentPath.match(/\//g).length > 1 && this.props.currentPath.indexOf(this.props.selectedMain.replace(' ', '-')) < 0)
        isSelected = "open"

      linkRender =
        <div name={this.props.packageName} className={`Main-Package ` + this.state.status + ` ` + isSelected} onMouseEnter={(e) => this.onMouseEnter(e)} onMouseLeave={(e) => this.onMouseLeave(e)}>
          <Link to={`/` + this.props.packageURL} className={`relative ` + isSelected}>
            {this.props.packageName}<FontAwesomeIcon icon="chevron-right" color="#004f6e" />
          </Link>
          <div className="SubPackage-Links">
            {subPackageCollection}
          </div>

        </div>
    } else {
      linkRender = <div name={this.props.packageName} className={`Main-Package ` + isSelected}><Link to={`/` + this.props.packageURL} className={`relative ` + isSelected}>
                      {this.props.packageName}
                   </Link></div>
    }
    return (
      <li>
        {linkRender}
      </li>
    );
  }
}

export default PackageSelector;