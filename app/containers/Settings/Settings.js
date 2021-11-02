import React from 'react';
import './style.scss';
import globalFunctions from '../../utils/global-functions';
import EfficiencySettings from './EfficiencySettings/Loadable';
import SSCSettings from './SSCSettings/Loadable';
import { StyledTab, StyledTabs, TabPanel } from '../../components/SharedComponents/SharedComponents';

const TABS = ['eff', 'ssc']
export default class Settings extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0
    }
  }


  handleChange(obj, tabIndex) {
    const { logger } = this.props;

    logger?.manualAddLog('click', 'swap-tab', TABS[tabIndex]);
    this.setState({ tabIndex });
  }
  componentDidMount() {
    const { match: { params } } = this.props;
    const tabIndex = parseInt(params.index);
    if (tabIndex == params.index) {
      this.setState({ tabIndex: Math.min(Math.max(tabIndex, 0), 2) })
    }
    this.getEfficiencyConfig();
    this.getSSCConfig();
    this.props.setCurrentProduct();
  }
  componentWillUnmount(){
    this.props.exitUserManagement();
  }
  componentDidUpdate() {
    const { logger } = this.props;
    setTimeout(() => {
      logger?.connectListeners();
    }, 300)
  }

  async getEfficiencyConfig() {
    return await globalFunctions.genericFetch(process.env.EFFICIENCY_API + "/config?facility_id=" + this.props.facilityName, 'get', this.props.userToken, {})
      .then(result => {
        if (!result) {
          return;
        }
        // result = JSON.parse(result)
        this.setState({ fcotsThreshold: result.fcotsThreshold, turnoverThreshold: result.turnoverThreshold, hasEMR: result.hasEMR });
      });

  }

  async submitEfficiencyConfig(jsonBody) {
    const url = `${process.env.EFFICIENCY_API}/config`;
    return await globalFunctions.genericFetch(url, 'put', this.props.userToken, jsonBody)
      .then(result => {
        if (!result) {
          return;
        }
        // result = JSON.parse(result)
        this.setState({ fcotsThreshold: result.fcotsThreshold, turnoverThreshold: result.turnoverThreshold, hasEMR: result.hasEMR });
      });
  }

  async getSSCConfig() {
    return await globalFunctions.genericFetch(process.env.SSC_API + "/config?facility_id=" + this.props.facilityName, 'get', this.props.userToken, {})
      .then(sscConfig => {
        if (!sscConfig) {
          return;
        }
        // const sscConfig = JSON.parse(result);
        this.setState({ sscConfig });
      });
  }

  async submitSSCConfig(jsonBody) {
    const url = `${process.env.SSC_API}/config`;
    return await globalFunctions.genericFetch(url, 'put', this.props.userToken, jsonBody)
      .then(sscConfig => {
        if (!sscConfig) {
          return;
        }
        // const sscConfig = JSON.parse(result);
        this.setState({ sscConfig });
      });
  }

  render() {
    const { productRoles } = this.props;
    const { sscRoles, effRoles } = productRoles || {}
    const hasSSC = (this.state.sscConfig?.checklists?.length > 0) && sscRoles?.isAdmin;
    const hasEff = effRoles?.isAdmin;
    const { tabIndex } = this.state;
    return (
      <div className="admin-panel">
        <div className="header">
          Settings
        </div>
        <StyledTabs
          value={tabIndex}
          onChange={(obj, value) => this.handleChange(obj, value)}
          indicatorColor="primary"
          textColor="primary"
        >
          {hasEff && <StyledTab label="Efficiency" /> || <span />}
          {hasSSC && <StyledTab label="Surgical Safety Checklist" /> || <span />}
        </StyledTabs>
        {hasEff && <TabPanel value={tabIndex} index={0}>
          <EfficiencySettings
            fcotsThreshold={this.state.fcotsThreshold}
            turnoverThreshold={this.state.turnoverThreshold}
            hasEMR={this.state.hasEMR}
            submit={(updates) => this.submitEfficiencyConfig(updates)}
          />
        </TabPanel>}
        {hasSSC && <TabPanel value={tabIndex} index={1}>
          <SSCSettings
            sscConfig={this.state.sscConfig}
            submit={(updates) => this.submitSSCConfig(updates)}
          />
        </TabPanel>}

      </div>
    );
  }
}

