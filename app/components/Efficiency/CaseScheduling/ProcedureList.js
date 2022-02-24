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
import { Divider } from '@material-ui/core';

const useStyles = makeStyles({
  content: {
    margin: '16 0',
    display: 'flex',
    flexGrow: 1,
    transition: 'margin 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    flexDirection: 'column',
  },

});

// Even though this function appears duplicated across various pages / components, I promise this is necessary because trying to extract it will give you errors
const equalProps = (props, prevProps) => props === prevProps;

const ProcedureList = React.memo(({ title, procedureData }) => {
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
  const formatAreaChartData = (mean, sd) => {
    const chartData = [];
    const lowerBound = mean - sd * 3;
    const upperBound = mean + sd * 3;

    for (let x = lowerBound; x < upperBound; x++) {
      chartData.push({ x, y: Math.exp(-0.5 * Math.pow((x - mean) / sd, 2)) });
    }
    return chartData;
  };

  const updateShownProcedureTypes = React.useCallback(async (e) => {
    await Promise.all([setProcedureType(e.target.value), setFilteredProcedures(procedureList.filter((value) => value.procedure.toLowerCase().includes(e.target.value.toLowerCase())))]);
  }, [procedureType]);

  const handlePanelChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
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
            <Icon path={mdiSort} size={1} />
          </div>
        </div>
        <Divider style={{ marginTop: 16 }} />
      </Grid>

      <Grid item xs={12} style={{height: 980, overflowY: 'auto'}}>
        {filteredProcedures?.map((dataPoint) => (
          <Accordion
            TransitionProps={{ unmountOnExit: true }}
            key={dataPoint.id}
            disableGutters={true}
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
                  <div>Underschedule percentage: {dataPoint.underscheduled}%</div>
                  <div>Cases in Sample: {dataPoint.case}</div>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails style={{ height: '450px', flexDirection: 'column' }}>
              <BarGraph
                height={200}
                data={dataPoint.percentage?.values}
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
                tripleColour
                colors={['#009483', '#FFB718', '#FF7D7D']}
              />
              <AreaGraph data={formatAreaChartData(dataPoint.allTimeMean, dataPoint.allTimeSd)} reference={dataPoint.mean} />
            </AccordionDetails>
          </Accordion>
        ))}
      </Grid>
    </React.Fragment>
  );
}, equalProps);

export default ProcedureList;
