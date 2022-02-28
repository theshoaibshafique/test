import React from 'react';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Switch from '@material-ui/core/Switch';
import InformationModal from './InformationModal';
import CustomDateRangePicker from '../SharedComponents/CustomDateRangePicker';
import MultiSelectFilter from '../../components/SharedComponents/MultiSelectFilter';
import useLocalStorage from '../../hooks/useLocalStorage';
import { SaveAndCancel, SSTSwitch } from '../SharedComponents/SharedComponents';

/*
* @param {object} config - The configuration object to determine what to show in the header
* @param {Function} applyGlobalFilter - The function called when we're applying filters
* @param {object} handlers - An object containing all the handlers necessary for various filters on the page
*/
const Header = ({ config = {}, applyGlobalFilter, handlers, displayDate }) => {
  const { getItemFromStore } = useLocalStorage();
  //ORs and Specialties have different formats
  const orMap = getItemFromStore('efficiencyV2')?.efficiency?.filters?.ORs;
  const ors = Object.keys(orMap ?? {})
  const specialties = getItemFromStore('efficiencyV2')?.efficiency?.filters?.Specialties;
  const [informationModalOpen, setInformationModalOpen] = React.useState(false);

  const onClick = React.useCallback(() => {
    setInformationModalOpen((prev) => !prev);
  }, [informationModalOpen]);
  const { startDate, endDate } = displayDate ?? {};
  return (
    <React.Fragment>
      <Grid className="efficiency-head-container" container style={{ paddingTop: '16px' }}>
        <Grid item xs={12} style={{position:'relative'}}>
          <div onClick={onClick} className="efficiencyOnboard-link link">What is this dashboard about?</div>
          <div className='display-date'>
            {displayDate && (
              <>
                <div className='normal-text bold'>Most Recent Week</div>
                <div className='subtle-subtext'>{`${moment(startDate)?.format('MMM DD YYYY')} to ${moment(endDate)?.format('MMM DD YYYY')}`}</div>
              </>
            )}

          </div>
        </Grid>
        <Grid container spacing={3} style={{ margin: '14px 0 0 0' }}>
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
                <SSTSwitch disableRipple disableFocusRipple checked={handlers?.case?.viewFirstCase} onChange={handlers?.case?.toggleFirstCaseOnTime} />
              </div>
            </Grid>
          )}
          {/* @TODO: Update the start and end dates with dates reflecting the expected defaults  */}
          {config?.date && (
            <Grid item xs={2} style={{ paddingLeft: '0px' }}>
              <CustomDateRangePicker {...handlers?.date} />
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
          {Object.keys(config).length > 0 && (
            <Grid item xs style={{ display: 'flex', alignItems: 'center', paddingTop: 20 }} >
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
