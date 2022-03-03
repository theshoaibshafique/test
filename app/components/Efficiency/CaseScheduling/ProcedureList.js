import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import Grid from '@material-ui/core/Grid';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import makeStyles from '@material-ui/core/styles/makeStyles';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import SearchIcon from '@material-ui/icons/Search';
import Icon from '@mdi/react';
import { mdiSort } from '@mdi/js';
import AreaGraph from '../../Charts/AreaGraph';
import BarGraph from '../../Charts/Bar';
import globalFunctions from '../../../utils/global-functions';
import { Divider, ListItemText, Menu, MenuItem } from '@material-ui/core';
import { LightTooltip } from '../../SharedComponents/SharedComponents';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { log_norm_cdf, log_norm_pdf } from '../../../containers/CaseDiscovery/misc/Utils';

const useStyles = makeStyles({
  content: {
    margin: '16 0',
    display: 'flex',
    flexGrow: 1,
    transition: 'margin 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    flexDirection: 'column',
  },
  MuiAccordionroot: {
    "&.MuiAccordion-root.Mui-expanded": {
      margin: 0
    }

  }
});

const NoDataOverlay = () => (
  <div
    style={
      {
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#828282',
        width: '100%',
        height: '100%'
      }
    }
    className="header-1 flex vertical-center"
  >
    No Data
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const [{ payload: { x, y, scale, shape } }] = payload;
    const percentile = `${globalFunctions.ordinal_suffix_of(Math.round(log_norm_cdf(x, scale, shape) * 100))} percentile`;
    return (
      <div
        style={{ background: '#F2F2F2', borderRadius: 4, padding: 8 }}
      >
        <div><span className='bold'>{globalFunctions.formatSecsToTime(x*60, true, true)}</span></div>
        <div><span className='bold'>{percentile}</span> percentile</div>
      </div>
    );
  }
  return null;
};

// Even though this function appears duplicated across various pages / components, I promise this is necessary because trying to extract it will give you errors
const equalProps = (props, prevProps) => props === prevProps;

const ProcedureList = React.memo(({ title, procedureData, networkAverage }) => {
  const styles = useStyles();
  const [filteredProcedures, setFilteredProcedures] = React.useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [procedureType, setProcedureType] = React.useState('');
  const [procedureList, setProcedureList] = React.useState([]);

  React.useEffect(() => {
    setProcedureList(procedureData);
    setFilteredProcedures(procedureData);
  }, [procedureData]);

  /*
  * @TODO: To be determined: Whether or not the text input to filter the data is too slow. Removing the area chart will fix the sluggish feeling of the input, but also... remove the area chart. This can likely be fixed by optimizing this function, or by changing how we want to render this data.
  */
  const formatAreaChartData = (duration, shape, scale) => {
    const mu = scale;
    const sigma = shape * scale;
    const lower = Math.max(0, Math.min(duration - (0.2 * sigma), mu - (3.5 * sigma)))
    const upper = Math.max(mu + (3.5 * sigma), duration + (0.2 * sigma))
    const chartData = [];
    for (let x = lower; x < upper; x++) {
      chartData.push({ x, y: log_norm_pdf(x, scale, shape), duration, shape, scale });
    }

    return chartData;
  };

  const updateShownProcedureTypes = React.useCallback(async (e) => {
    await Promise.all([setProcedureType(e.target.value), setFilteredProcedures(procedureList.filter((value) => value.procedure.toLowerCase().includes(e.target.value.toLowerCase())))]);
  }, [procedureType]);

  const handlePanelChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  //Order is the index in options from sortOptions
  const [sort, setSort] = React.useState({ key: 'procedure', order: 0 });
  const openFilter = Boolean(anchorEl);

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSortClick = (key, order) => {
    setSort({ key, order });
    handleClose();
  }
  filteredProcedures?.sort((a, b) => {
    switch (sort.key) {
      case 'case':
        return (sort.order ? a?.[sort.key] - b?.[sort.key] : b?.[sort.key] - a?.[sort.key]);
      case 'underscheduled':
        return (sort.order ? a?.[sort.key] - b?.[sort.key] : b?.[sort.key] - a?.[sort.key]);
      case 'procedure':
        return (!sort.order ? a?.[sort.key].localeCompare(b?.[sort.key]) : b?.[sort.key].localeCompare(a?.[sort.key]));
    }
  });
  const sortOptions = [
    { key: 'procedure', name: 'Procedure Type: ', options: ['A-Z', 'Z-A'] },
    { key: 'case', name: 'Cases in Sample: ', options: ['Descend', 'Ascend'] },
    { key: 'underscheduled', name: 'Underschedule percentage: ', options: ['Descend', 'Ascend'] }
  ]
  return (
    <React.Fragment>
      <div className='tile-title' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 0 }} >
        {title}
      </div>

      <Grid item xs={12}>
        <Divider style={{ marginTop: 16, marginBottom: 16 }} />
        <div
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: 24
          }}
        >
          <FormControl variant="outlined">
            <OutlinedInput
              style={{ width: '300px', height: '40px' }}
              value={procedureType}
              onChange={updateShownProcedureTypes}
              startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
              placeholder="Search by procedure type"
              labelWidth={0}
            />
          </FormControl>
          <div style={{ marginRight: 42 }}>
            <Icon
              path={mdiSort} color='#828282' className='pointer' size={1}
              aria-haspopup="true"
              onClick={handleFilterClick}
            />
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorEl}
              open={openFilter}
              onClose={handleClose}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              {sortOptions.map(({ key, name, options }) => (
                options.map((option, i) => {
                  //The options are chosen by index of options
                  const selected = sort?.key === key && options[sort?.order] === option;
                  return (
                    <MenuItem selected={selected} onClick={() => handleSortClick(key, i)}>
                      <ListItemText
                        primary={
                          <div className='subtext' style={{ paddingLeft: 4 }}>{name}<span style={selected ? { fontWeight: 'bold', color: '#004F6E' } : {}}>{option}</span></div>
                        }
                      />
                    </MenuItem>
                  )
                })
              ))}
            </Menu>
          </div>
        </div>
        <Divider style={{ marginTop: 16 }} />
      </Grid>

      <Grid item xs={12} style={{ height: 950, overflowY: 'auto' }}>
        {filteredProcedures?.length === 0 ? (
          <NoDataOverlay />
        ) : filteredProcedures?.map((dataPoint) => (
          <Accordion
            // elevation={0}
            TransitionProps={{ unmountOnExit: true }}
            key={dataPoint.id}
            disableGutters={true}
            classes={{
              root: styles.MuiAccordionroot
            }}
            expanded={expanded === dataPoint.id} onChange={handlePanelChange(dataPoint.id)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              classes={{ content: styles.content }}
            >
              <div style={{ width: '100%' }}>
                <div
                  className='normal-text semibold'
                  style={{
                    color: '#004f6e', marginBottom: 16
                  }}
                >
                  {dataPoint.procedure}
                </div>
                <div
                  style={{
                    position: 'relative', width: '80%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <div
                    className={`${dataPoint.underscheduled > networkAverage ? 'red-label' : 'green-label'} subtext`}>
                    Underschedule percentage: <span className="normal-text">{dataPoint.underscheduled}%</span>
                  </div>
                  <div className="subtext">Cases in Sample: <span className="bold normal-text" style={{ color: "#004F6E" }}>{dataPoint.case}</span></div>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails style={{ flexDirection: 'column', borderTop: '1px solid #F2F2F2' }}>
              <div className="subtle-text" style={{ marginBottom: 20 }}>
                {"Distibution of Changes in Delay"}
                <LightTooltip
                  placement="top"
                  fontSize="small"
                  interactive arrow
                  title="Distribution of how much a case increased the delay of the next case relative to the cases length. "
                >
                  <InfoOutlinedIcon style={{ fontSize: 16, margin: '4px', color: '#8282828' }} className="log-mouseover" />
                </LightTooltip>
              </div>
              <BarGraph
                height={200}
                data={dataPoint.percentage?.values}
                binSize={dataPoint.percentage?.binSize}
                unit='%'
                xAxisLabel={{
                  value: 'Change in Delay (%)',
                  offset: -10,
                  position: 'insideBottom'
                }}
                yAxisLabel={{
                  value: 'Frequency',
                  angle: -90,
                  offset: 15,
                  position: 'insideBottomLeft'
                }}
                margin={{ bottom: 40, right: 20 }}
                singleColour
                colors={['#3DB3E3']}
              />
              <div className="subtle-text" style={{ marginBottom: 20 }}>
                {"Case Duration"}
                <LightTooltip
                  placement="top"
                  fontSize="small"
                  interactive arrow
                  title={(
                    <div>
                      <div style={{ marginBottom: 8 }}>Case duration distribution is best approximation based on all historical cases of the same procedure type.</div>
                      <div>Case Count: <span className='bold'>{`${dataPoint.case}`}</span></div>
                      <div>Mean: <span className='bold'>{`${globalFunctions.formatSecsToTime(dataPoint.allTimeMean*60, true, true)}`}</span></div>
                      <div>Median: <span className='bold'>{`${globalFunctions.formatSecsToTime(dataPoint.allTimeMedian*60, true, true)}`}</span></div>
                      <div>Standard Deviation: <span className='bold'>{`${globalFunctions.formatSecsToTime(dataPoint.allTimeSd*60, true, true)}`}</span></div>
                    </div>
                  )}
                >
                  <InfoOutlinedIcon style={{ fontSize: 16, margin: '4px', color: '#8282828' }} className="log-mouseover" />
                </LightTooltip>
              </div>
              <AreaGraph
                data={formatAreaChartData(dataPoint.mean, dataPoint.shape, dataPoint.scale)}
                reference={dataPoint.mean}
                CustomTooltip={CustomTooltip}
              />
            </AccordionDetails>
          </Accordion>
        ))}

      </Grid>
    </React.Fragment>
  );
}, equalProps);

export default ProcedureList;