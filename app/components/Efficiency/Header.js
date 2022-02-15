import React from 'react';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Switch from '@material-ui/core/Switch';
import InformationModal from './InformationModal';
import GracePeriod from './GracePeriodFilter/GracePeriod';
import CustomDateRangePicker from '../SharedComponents/CustomDateRangePicker';
import MultiSelectFilter from '../../components/SharedComponents/MultiSelectFilter';
import useLocalStorage from '../../hooks/useLocalStorage';
import { SaveAndCancel } from '../SharedComponents/SharedComponents';

const CustomSwitch = withStyles({
  checked: {
    opacity: 1
  },
  switchBase: {
    color: '#4F4F4F',
    '&$checked': {
      color: '#004F6E'
    },
    '&$checked + $track': {
      opacity: 1,
      backgroundColor: '#3DB3E3'
    }
  },
  track: {
    opacity: 1,
    backgroundColor: '#BDBDBD'
  }
})(Switch);

/*
* @param {object} config - The configuration object to determine what to show in the header
* @param {Function} applyGlobalFilter - The function called when we're applying filters
* @param {object} handlers - An object containing all the handlers necessary for various filters on the page
*/
const Header = ({ config = {}, applyGlobalFilter, handlers }) => {
  const { getItemFromStore } = useLocalStorage();
  //ORs and Specialties have different formats
  const orMap = getItemFromStore('efficiencyV2')?.efficiency?.filters?.ORs;
  const ors = Object.keys(orMap ?? {})
  const specialties = getItemFromStore('efficiencyV2')?.efficiency?.filters?.Specialties;
  const [informationModalOpen, setInformationModalOpen] = React.useState(false);

  const onClick = React.useCallback(() => {
    setInformationModalOpen((prev) => !prev);
  }, [informationModalOpen]);
  const hasHelperText = !!config?.time;
  return (
    <React.Fragment>
      <Grid className="efficiency-head-container" container style={{ paddingTop: '16px' }}>
        <Grid item xs={12}>
          <div onClick={onClick} className="efficiencyOnboard-link link">What is this dashboard about?</div>
        </Grid>
        <Grid container spacing={3} style={{ margin: hasHelperText ? '14px 0px -14px' : '14px 0 0 0' }}>
          {config?.case && (
            <Grid item xs={2} style={{ paddingLeft: '0px', maxWidth: 200 }}>
              <div
                style={{
                  display: 'flex',
                  // height: '100%',
                  justifyContent: 'flex-start',
                  marginTop: '16px',
                  alignItems: 'center',
                  flexDirection: 'row',
                  fontSize: '14px',
                  color: '#333'
                }}
              >
                Only First Cases
                <CustomSwitch checked={handlers?.case?.viewFirstCase} onChange={handlers?.case?.toggleFirstCaseOnTime} />
              </div>
            </Grid>
          )}
          {/* @TODO: Update the start and end dates with dates reflecting the expected defaults  */}
          {config?.date && (
            <Grid item xs={2} style={{ paddingLeft: '0px' }}>
              <CustomDateRangePicker
                startDate={moment().subtract(8, 'months').startOf('month')}
                endDate={moment().subtract(1, 'months').endOf('month')}
              />
            </Grid>
          )}
          {config?.room && (
            <Grid item xs={2}>
              <MultiSelectFilter
                id="ORFilter"
                label="Room"
                onChange={handlers?.room?.selectOrs}
                options={ors}
                optionMap={orMap}
                placeholder="All ORs"
                value={handlers?.room?.orFilterVal}
              />
            </Grid>
          )}
          {config?.specialty && (
            <Grid item xs={2}>
              <MultiSelectFilter
                id="specialtyFilter"
                label="Specialties"
                onChange={handlers?.specialty?.selectSpecialty}
                options={specialties}
                placeholder="All Specialties"
                value={handlers?.specialty?.specialtyNames}
              />
            </Grid>
          )}
          {!!config?.time && (
            <Grid item xs={2} style={{ maxWidth: config.time.gracePeriod ? 140 : 250 }}>
              <GracePeriod
                config={{ threshold: config.time.threshold, gracePeriod: config.time.gracePeriod }}
              />
            </Grid>
          )}
          {Object.keys(config).length > 0 && (
            <Grid item xs style={{ display: 'flex', alignItems: 'center', paddingTop: hasHelperText ? 4 : 20 }} >
              <SaveAndCancel
                className={'apply-cancel-buttons'}
                // disabled={isLoading}
                handleSubmit={applyGlobalFilter}
                submitText={'Apply'}
                // isLoading={isLoading}
                cancelText={'Clear Filters'}
                handleCancel={handlers?.clearFilters}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
      <InformationModal open={informationModalOpen} onToggle={onClick} />
    </React.Fragment>
  );
};
export default Header;
