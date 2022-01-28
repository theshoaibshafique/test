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

const Header = ({ config = {}, applyGlobalFilter, handlers }) => {
  const { getItemFromStore } = useLocalStorage();
  const filters = getItemFromStore('efficiencyV2')?.efficiency?.filters?.ORs;
  const specialties = getItemFromStore('efficiencyV2')?.efficiency?.filters?.Specialties;
  const [informationModalOpen, setInformationModalOpen] = React.useState(false);

  const onClick = React.useCallback(() => {
    setInformationModalOpen((prev) => !prev);
  }, [informationModalOpen]);

  return (
    <React.Fragment>
      <Grid className="efficiency-head-container" container style={{ paddingTop: '16px' }}>
        <Grid item xs={12}>
          <div onClick={onClick} className="efficiencyOnboard-link link">What is this dashboard about?</div>
        </Grid>
        <Grid container spacing={3} style={{ margin: '14px 0px 0px 0px' }}>
          {config?.case && (
            <Grid item xs={2} style={{ paddingLeft: '0px', width: '100px' }}>
              <div
                style={{
                  display: 'flex',
                  height: '100%',
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
                options={filters}
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
                value={handlers?.specialty?.specialtyFilter}
              />
            </Grid>
          )}
          {!!config?.grace && (
            <Grid item xs={2}>
              <GracePeriod config={{ threshold: config.grace.threshold, gracePeriod: config.grace.period }} />
            </Grid>
          )}
          {Object.keys(config).length > 0 && (
            <Grid item xs={2} style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
              <button onClick={applyGlobalFilter} className="button primary">Apply</button>
              <button onClick={handlers?.clearFilters} className="button clear-btn">Clear Filters</button>
            </Grid>
          )}
        </Grid>
      </Grid>
      <InformationModal open={informationModalOpen} onToggle={onClick} />
    </React.Fragment>
  );
};
export default Header;
