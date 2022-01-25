import React from 'react';
import { v4 as uuidv4 } from 'uuid';
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
// import AreaGraph from '../../Charts/AreaGraph';
import BarGraph from '../../Charts/Bar';

const useStyles = makeStyles({
  content: {
    margin: '12px 0',
    display: 'flex',
    flexGrow: 1,
    transition: 'margin 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    flexDirection: 'column',
  }
});

const equalProps = (props, prevProps) => props === prevProps;

const ProcedureList = React.memo(({ data }) => {
  const styles = useStyles();
  const [filteredProcedures, setFilteredProcedures] = React.useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [procedureType, setProcedureType] = React.useState('');
  const [procedureList, setProcedureList] = React.useState([]);

  const formatProcedureListData = (dataset) => dataset?.procedure?.map((procedure, idx) => ({
    id: uuidv4(),
    procedure,
    case: dataset?.cases[idx],
    percentage: dataset?.percentage_change[idx],
    mean: dataset?.mean[idx],
    allTimeMean: dataset?.all_time_mean[idx],
    allTimeMedian: dataset?.all_time_median[idx],
    allTimeSd: dataset?.all_time_sd[idx],
    underscheduled: dataset?.underscheduled_percentage[idx]
  }));

  // const formatAreaChartData = (mean, sd) => {
  //   const chartData = [];
  //   const lowerBound = mean - sd * 3;
  //   const upperBound = mean + sd * 3;

  //   for (let x = lowerBound; x < upperBound; x++) {
  //     chartData.push({ x, y: Math.exp(-0.5 * Math.pow((x - mean) / sd, 2)) });
  //   }
  //   return chartData;
  // };

  React.useEffect(() => {
    const filterableData = formatProcedureListData(data.data);
    setProcedureList(filterableData);
  }, [data]);

  React.useEffect(() => {
    setFilteredProcedures(procedureList);
  }, [procedureList]);

  React.useEffect(() => {
    setFilteredProcedures(procedureList.filter((value) => value.procedure.toLowerCase().includes(procedureType.toLowerCase())));
  }, [procedureType]);

  const updateShownProcedureTypes = React.useCallback((e) => {
    console.log({ e });
    setProcedureType(e.target.value);
    // setFilteredProcedures(procedureList.filter((value) => value.procedure.toLowerCase().includes(procedureType.toLowerCase())));
  }, [procedureList]);

  const handlePanelChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <React.Fragment>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <h4 style={{ marginBottom: 0 }}>
          {data.title}
        </h4>
      </div>
      <hr style={{ marginTop: 16, marginBottom: 16 }} />
      <Grid item xs={12}>
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
      </Grid>
      <hr style={{ marginTop: 16 }} />
      {filteredProcedures?.map((dataPoint) => (
        <Accordion key={dataPoint.id} expanded={expanded === dataPoint.id} onChange={handlePanelChange(dataPoint.id)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            classes={{ content: styles.content }}
          >
            <div style={{ width: '100%' }}>
              <h3
                style={{
                  fontSize: 18, color: '#004f6e', fontWeight: 700, fontFamily: 'Noto Sans'
                }}
              >{dataPoint.procedure}
              </h3>
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
              data={dataPoint.percentage}
              xAxisLabel={{
                value: 'Turnover Duration (min)',
                offset: -10,
                position: 'insideBottom'
              }}
              yAxisLabel={{
                value: 'Frequency',
                angle: -90,
                offset: 15,
                position: 'insideBottomLeft'
              }}
              margin={{ bottom: 40 }}
              tripleColour
              colors={['#009483', '#FFB718', '#FF7D7D']}
            />
            {/* <AreaGraph data={formatAreaChartData(dataPoint.allTimeMean, dataPoint.allTimeSd)} reference={dataPoint.mean} /> */}
          </AccordionDetails>
        </Accordion>
      ))}
    </React.Fragment>
  );
}, equalProps);

export default ProcedureList;
