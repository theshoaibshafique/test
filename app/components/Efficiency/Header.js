import React from 'react';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import InformationModal from './InformationModal';
import CustomDateRangePicker from '../SharedComponents/CustomDateRangePicker';
import MultiSelectFilter from '../../components/SharedComponents/MultiSelectFilter';
import useLocalStorage from '../../hooks/useLocalStorage';
import { SaveAndCancel } from '../SharedComponents/SharedComponents';
import DemoVideoModal from './DemoVideoModal';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';

/*
* @param {object} config - The configuration object to determine what to show in the header
* @param {Function} applyGlobalFilter - The function called when we're applying filters
* @param {object} handlers - An object containing all the handlers necessary for various filters on the page
*/
const Header = ({ config = {}, applyGlobalFilter, handlers, displayDate, isApplied, loading }) => {
  const { getItemFromStore } = useLocalStorage();
  //ORs and Specialties have different formats
  const orMap = getItemFromStore('efficiencyV2')?.efficiency?.filters?.ORs;
  const ors = Object.keys(orMap ?? {})
  const specialties = getItemFromStore('efficiencyV2')?.efficiency?.filters?.Specialties;
  const [informationModalOpen, setInformationModalOpen] = React.useState(false);
  const [demoVideoModalOpen, setDemoVideoModalOpen] = React.useState(false);

  const onInformationModalButtonClick = React.useCallback(() => {
    setInformationModalOpen((prev) => !prev);
  }, [informationModalOpen]);
  const onDemoVideoButtonClick = React.useCallback(() => {
    setDemoVideoModalOpen((prev) => !prev);
  }, [demoVideoModalOpen]);
  const { startDate, endDate } = displayDate ?? {};
  const configCookieObj = {configCookieKey: "efficiencyV2", userCustomConfigCookieKey: "globalFilter"}

  return (
    <React.Fragment>
      <Grid className="efficiency-head-container" container style={{ paddingTop: '16px' }}>
        <Grid item xs={12} style={{ position: 'relative' }} className='header-element'>
          {!displayDate && (
            <div onClick={onInformationModalButtonClick} className="efficiencyOnboard-link link">What is this dashboard about?</div>
          )}
          {displayDate && (
            <div onClick={onDemoVideoButtonClick} className="efficiencyOnboard-link link">
              <OndemandVideoIcon
                style={{
                  fontSize: 16,
                  margin: '4px',
                  color: '#8282828',
                }}
              />
              See what&apos;s new
            </div>
          )}
          <div className='display-date'>
            {displayDate && (
              <>
                <div className='normal-text bold'>Most Recent Week</div>
                <div className='subtle-subtext'>{`${moment(startDate)?.format('MMM DD YYYY')} to ${moment(endDate)?.format('MMM DD YYYY')}`}</div>
              </>
            )}
          </div>
        </Grid>
        <Grid container spacing={3} style={{ margin: '14px 0 0 0' }} className='header-element'>
          {/* @TODO: Update the start and end dates with dates reflecting the expected defaults  */}
          {config?.date && (
            <Grid item xs={2} style={{ paddingLeft: '0px', minWidth: 260 }} >
              <CustomDateRangePicker {...handlers?.date} {...configCookieObj} />
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
                disabled={loading || isApplied}
                handleSubmit={applyGlobalFilter}
                submitText={'Apply'}
                isLoading={loading}
                cancelText={'Clear Filters'}
                handleCancel={handlers?.clearFilters}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
      <InformationModal open={informationModalOpen} onToggle={onInformationModalButtonClick} />
      <DemoVideoModal open={demoVideoModalOpen} onToggle={onDemoVideoButtonClick} />
    </React.Fragment>
  );
};
export default Header;
