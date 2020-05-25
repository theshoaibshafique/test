import React from 'react';
import axios from 'axios';

import 'c3/c3.css';
import './style.scss';

import globalFuncs from '../../utils/global-functions';
import { Grid, Divider, CardContent, Card } from '@material-ui/core';
import MonthPicker from '../../components/MonthPicker/MonthPicker';
import moment from 'moment/moment';
import UniversalPicker from '../../components/UniversalPicker/UniversalPicker';
import ReportScore from '../../components/Report/ReportScore/ReportScore';
import globalFunctions from '../../utils/global-functions';
import HorizontalBarChart from '../../components/Report/HorizontalBarChart/HorizantalBarChart';
import BarChartDetailed from '../../components/Report/BarChartDetailed/BarChartDetailed';
import LoadingOverlay from 'react-loading-overlay';
import InfographicParagraph from '../../components/Report/InfographicParagraph/InfographicParagraph';
import AreaChart from '../../components/Report/AreaChart/AreaChart';
import BarChart from '../../components/Report/BarChart/BarChart';
import ListDetailed from '../../components/Report/ListDetailed/ListDetailed';
import StackedBarChart from '../../components/Report/StackedBarChart';

export default class EMMCases extends React.PureComponent {
  constructor(props) {
    super(props);

    this.temp = this.getTemp();

    this.state = {
      reportType: this.props.reportType,
      isLoading: true,
      pendingTileCount: 0,
      tileRequest: [],
      reportData: [],
      chartColours: ['#FF7D7D', '#FFDB8C', '#A7E5FD', '#97E7B3', '#CFB9E4', '#004F6E'],

      month: moment(),
      selectedOperatingRoom: "",
      selectedWeekday: "",
      selectedSpecialty: "",
      procedureOptions: [],
      selectedProcedure: ""
    }

  }

  getTemp() {
    let x = this.props.reportType == "QualityScoreReport";
    if (x) {
      return [{
        "name": null,
        "reportName": null,
        "title": "Quality Score",
        "subTitle": null,
        "body": null,
        "footer": null,
        "description": null,
        "total": null,
        "assets": null,
        "dataPoints": [
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": 58,
            "valueY": null,
            "valueZ": null,
            "note": null
          }
        ],
        "active": true,
        "dataDate": "0001-01-01T00:00:00",
        "hospitalName": null,
        "facilityName": null,
        "departmentName": null,
        "roomName": null,
        "procedureName": null,
        "specialtyName": null
      },
      {
        "name": null,
        "reportName": null,
        "title": "Monthly Trend",
        "subTitle": "Score",
        "body": null,
        "footer": "Month",
        "description": null,
        "total": null,
        "assets": null,
        "dataPoints": [
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": 8,
            "valueY": 29,
            "valueZ": null,
            "note": null
          },
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": 9,
            "valueY": 37,
            "valueZ": null,
            "note": null
          },
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": 10,
            "valueY": 41,
            "valueZ": null,
            "note": null
          },
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": 11,
            "valueY": 68,
            "valueZ": null,
            "note": null
          },
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": 12,
            "valueY": 70,
            "valueZ": null,
            "note": null
          }
        ],
        "active": true,
        "dataDate": "0001-01-01T00:00:00",
        "hospitalName": null,
        "facilityName": null,
        "departmentName": null,
        "roomName": null,
        "procedureName": null,
        "specialtyName": null
      },
      {
        "name": null,
        "reportName": null,
        "title": "Missed Checklist Items",
        "subTitle": "Occurences",
        "body": null,
        "footer": "Phases",
        "description": "Missed Checklist Items by Phase",
        "total": null,
        "assets": null,
        "dataPoints": [
          {
            "title": "General Surgery",
            "subTitle": null,
            "description": null,
            "valueX": "Briefing",
            "valueY": 50,
            "valueZ": null,
            "note": null
          },
          {
            "title": "Gynecology",
            "subTitle": null,
            "description": null,
            "valueX": "Briefing",
            "valueY": 250,
            "valueZ": null,
            "note": null
          },
          {
            "title": "Urology",
            "subTitle": null,
            "description": null,
            "valueX": "Briefing",
            "valueY": 100,
            "valueZ": 400,
            "note": null
          },
          {
            "title": "General Surgery",
            "subTitle": null,
            "description": null,
            "valueX": "Time Out",
            "valueY": 400,
            "valueZ": null,
            "note": null
          },
          {
            "title": "Gynecology",
            "subTitle": null,
            "description": null,
            "valueX": "Time Out",
            "valueY": 150,
            "valueZ": null,
            "note": null
          },
          {
            "title": "Urology",
            "subTitle": null,
            "description": null,
            "valueX": "Time Out",
            "valueY": 130,
            "valueZ": 680,
            "note": null
          },
          {
            "title": "General Surgery",
            "subTitle": null,
            "description": null,
            "valueX": "Postop Debrief",
            "valueY": 200,
            "valueZ": null,
            "note": null
          },
          {
            "title": "Gynecology",
            "subTitle": null,
            "description": null,
            "valueX": "Postop Debrief",
            "valueY": 250,
            "valueZ": null,
            "note": null
          },
          {
            "title": "Urology",
            "subTitle": null,
            "description": null,
            "valueX": "Postop Debrief",
            "valueY": 310,
            "valueZ": 710,
            "note": null
          }

        ],
        "active": true,
        "dataDate": "0001-01-01T00:00:00",
        "hospitalName": null,
        "facilityName": null,
        "departmentName": null,
        "roomName": null,
        "procedureName": null,
        "specialtyName": null
      },

      {
        "name": null,
        "reportName": "SSC_TS",
        "title": "Specialties of Interest",
        "subTitle": "by total missed phases and timing",
        "body": null,
        "footer": null,
        "description": null,
        "total": null,
        "assets": null,
        "dataPoints": [
          {
            "title": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F",
            "subTitle": "",
            "description": "",
            "valueX": "321",
            "valueY": "",
            "valueZ": "",
            "note": ""
          },
          {
            "title": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F",
            "subTitle": "E4E332CA-4908-4469-9F89-47895E54034D",
            "description": "",
            "valueX": "100",
            "valueY": "",
            "valueZ": "",
            "note": ""
          },
          {
            "title": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F",
            "subTitle": "823774C6-5583-47B0-8397-1B2EBDA40794",
            "description": "",
            "valueX": "67",
            "valueY": "",
            "valueZ": "",
            "note": ""
          },
          {
            "title": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F",
            "subTitle": "02A56FCE-67AB-4DD5-A048-F9B34FCFE00A",
            "description": "",
            "valueX": "66",
            "valueY": "",
            "valueZ": "",
            "note": ""
          },
          {
            "title": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F",
            "subTitle": "Other Procedures",
            "description": "",
            "valueX": "88",
            "valueY": "",
            "valueZ": "",
            "note": ""
          },
          {
            "title": "95F656BA-06BE-4BB5-994C-3AC17FBC6DCB",
            "subTitle": "",
            "description": "",
            "valueX": "300",
            "valueY": "",
            "valueZ": "",
            "note": ""
          },
          {
            "title": "95F656BA-06BE-4BB5-994C-3AC17FBC6DCB",
            "subTitle": "02A56FCE-67AB-4DD5-A048-F9B34FCFE00A",
            "description": "",
            "valueX": "111",
            "valueY": "",
            "valueZ": "",
            "note": ""
          },
          {
            "title": "95F656BA-06BE-4BB5-994C-3AC17FBC6DCB",
            "subTitle": "A3D407ED-DDDB-4F92-849C-C4C84E05659A",
            "description": "",
            "valueX": "82",
            "valueY": "",
            "valueZ": "",
            "note": ""
          },
          {
            "title": "95F656BA-06BE-4BB5-994C-3AC17FBC6DCB",
            "subTitle": "C1294BFB-E752-443E-AEA0-3C886512A4CF",
            "description": "",
            "valueX": "75",
            "valueY": "",
            "valueZ": "",
            "note": ""
          },
          {
            "title": "95F656BA-06BE-4BB5-994C-3AC17FBC6DCB",
            "subTitle": "Other procedures",
            "description": "",
            "valueX": "32",
            "valueY": "",
            "valueZ": "",
            "note": ""
          }
        ],
        "active": true,
        "dataDate": "2020-05-01T00:00:00-04:00",
        "monthly": true,
        "hospitalName": "738D2883-5B17-454A-BD4D-9628218016F9",
        "facilityName": "FE063AF9-99AB-4A0A-BCDD-DC9E76ECF567",
        "departmentName": "19F36BB1-82AE-4473-9AFB-C3E561ACA15E",
        "roomName": "92A1D4B7-806A-4D20-9D24-3376E0584124",
        "procedureName": "823774C6-5583-47B0-8397-1B2EBDA40794",
        "specialtyName": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F"
      },
      {
        "name": null,
        "reportName": "SSC_CC",
        "title": null,
        "subTitle": null,
        "body": null,
        "footer": null,
        "description": "{0} Case Data based on filter criteria",
        "total": null,
        "assets": null,
        "dataPoints": [
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": "1000",
            "valueY": null,
            "valueZ": null,
            "note": null
          }
        ],
        "active": true,
        "dataDate": "2020-05-01T00:00:00-04:00",
        "monthly": false,
        "hospitalName": "738D2883-5B17-454A-BD4D-9628218016F9",
        "facilityName": "FE063AF9-99AB-4A0A-BCDD-DC9E76ECF567",
        "departmentName": "19F36BB1-82AE-4473-9AFB-C3E561ACA15E",
        "roomName": "92A1D4B7-806A-4D20-9D24-3376E0584124",
        "procedureName": "823774C6-5583-47B0-8397-1B2EBDA40794",
        "specialtyName": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F"
      }
      ];
    }

    return this.props.reportType == "SurgicalSafetyChecklistReport" ?
      [{
        "name": null,
        "reportName": null,
        "title": "Compliance Score",
        "subTitle": "View Compliance Details",
        "body": null,
        "footer": "/complianceScore",
        "description": "Checklist Score is scored out of 100 using current month data. It is calculated based on how each phase of the checklist is conducted.",
        "total": null,
        "assets": null,
        "dataPoints": [
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": 70,
            "valueY": null,
            "valueZ": null,
            "note": null
          }
        ],
        "active": true,
        "dataDate": "0001-01-01T00:00:00",
        "facilityName": "FE063AF9-99AB-4A0A-BCDD-DC9E76ECF567",
        "departmentName": "19F36BB1-82AE-4473-9AFB-C3E561ACA15E",
        "roomName": "92A1D4B7-806A-4D20-9D24-3376E0584124",
        "procedureName": "823774C6-5583-47B0-8397-1B2EBDA40794",
        "specialtyName": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F"
      },
      {
        "name": null,
        "reportName": null,
        "title": "Engagement Score",
        "subTitle": "View Engagement Details",
        "body": null,
        "footer": "/engagementScore",
        "description": "Checklist Score is scored out of 100 using current month data. It is calculated based on how each phase of the checklist is conducted.",
        "total": null,
        "assets": null,
        "dataPoints": [
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": 52,
            "valueY": null,
            "valueZ": null,
            "note": null
          }
        ],
        "active": true,
        "dataDate": "0001-01-01T00:00:00",
        "facilityName": "FE063AF9-99AB-4A0A-BCDD-DC9E76ECF567",
        "departmentName": "19F36BB1-82AE-4473-9AFB-C3E561ACA15E",
        "roomName": "92A1D4B7-806A-4D20-9D24-3376E0584124",
        "procedureName": "823774C6-5583-47B0-8397-1B2EBDA40794",
        "specialtyName": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F"
      },
      {
        "name": null,
        "reportName": null,
        "title": "Quality Score",
        "subTitle": "View Quality Details",
        "body": null,
        "footer": "/qualityScore",
        "description": "Checklist Score is scored out of 100 using current month data. It is calculated based on how each phase of the checklist is conducted.",
        "total": null,
        "assets": null,
        "dataPoints": [
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": 58,
            "valueY": null,
            "valueZ": null,
            "note": null
          }
        ],
        "active": true,
        "dataDate": "0001-01-01T00:00:00",
        "facilityName": "FE063AF9-99AB-4A0A-BCDD-DC9E76ECF567",
        "departmentName": "19F36BB1-82AE-4473-9AFB-C3E561ACA15E",
        "roomName": "92A1D4B7-806A-4D20-9D24-3376E0584124",
        "procedureName": "823774C6-5583-47B0-8397-1B2EBDA40794",
        "specialtyName": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F"
      },
      {
        "name": null,
        "reportName": "SSC_MT",
        "title": "Monthly Trend",
        "subTitle": "Score (%)",
        "body": null,
        "footer": "Month",
        "description": null,
        "total": null,
        "assets": null,
        "dataPoints": [
          {
            "title": "Compliance Score",
            "subTitle": "/complianceScore",
            "description": null,
            "valueY": "73",
            "valueX": "5",
            "valueZ": null,
            "note": null
          },
          {
            "title": "Engagement Score",
            "subTitle": "/engagementScore",
            "description": null,
            "valueY": "83",
            "valueX": "5",
            "valueZ": null,
            "note": null
          },
          {
            "title": "Quality Score",
            "subTitle": "/qualityScore",
            "description": null,
            "valueY": "79",
            "valueX": "5",
            "valueZ": null,
            "note": null
          },
          {
            "title": "Average",
            "subTitle": null,
            "description": null,
            "valueY": "78",
            "valueX": "5",
            "valueZ": null,
            "note": null
          },
          {
            "title": "Compliance Score",
            "subTitle": "/complianceScore",
            "description": null,
            "valueY": "83",
            "valueX": "4",
            "valueZ": null,
            "note": null
          },
          {
            "title": "Engagement Score",
            "subTitle": "/engagementScore",
            "description": null,
            "valueY": "87",
            "valueX": "4",
            "valueZ": null,
            "note": null
          },
          {
            "title": "Quality Score",
            "subTitle": "/qualityScore",
            "description": null,
            "valueY": "47",
            "valueX": "4",
            "valueZ": null,
            "note": null
          },
          {
            "title": "Average",
            "subTitle": null,
            "description": null,
            "valueY": "72",
            "valueX": "4",
            "valueZ": null,
            "note": null
          },
          {
            "title": "Compliance Score",
            "subTitle": "/complianceScore",
            "description": null,
            "valueY": "91",
            "valueX": "3",
            "valueZ": null,
            "note": null
          },
          {
            "title": "Engagement Score",
            "subTitle": "/engagementScore",
            "description": null,
            "valueY": "77",
            "valueX": "3",
            "valueZ": null,
            "note": null
          },
          {
            "title": "Quality Score",
            "subTitle": "/qualityScore",
            "description": null,
            "valueY": "86",
            "valueX": "3",
            "valueZ": null,
            "note": null
          },
          {
            "title": "Average",
            "subTitle": null,
            "description": null,
            "valueY": "84",
            "valueX": "3",
            "valueZ": null,
            "note": null
          },
          {
            "title": "Compliance Score",
            "subTitle": "/complianceScore",
            "description": null,
            "valueY": "71",
            "valueX": "2",
            "valueZ": null,
            "note": null
          },
          {
            "title": "Engagement Score",
            "subTitle": "/engagementScore",
            "description": null,
            "valueY": "67",
            "valueX": "2",
            "valueZ": null,
            "note": null
          },
          {
            "title": "Quality Score",
            "subTitle": "/qualityScore",
            "description": null,
            "valueY": "89",
            "valueX": "2",
            "valueZ": null,
            "note": null
          },
          {
            "title": "Average",
            "subTitle": null,
            "description": null,
            "valueY": "75",
            "valueX": "2",
            "valueZ": null,
            "note": null
          },
          {
            "title": "Compliance Score",
            "subTitle": "/complianceScore",
            "description": null,
            "valueY": "92",
            "valueX": "1",
            "valueZ": null,
            "note": null
          },
          {
            "title": "Engagement Score",
            "subTitle": "/engagementScore",
            "description": null,
            "valueY": "78",
            "valueX": "1",
            "valueZ": null,
            "note": null
          },
          {
            "title": "Quality Score",
            "subTitle": "/qualityScore",
            "description": null,
            "valueY": "93",
            "valueX": "1",
            "valueZ": null,
            "note": null
          },
          {
            "title": "Average",
            "subTitle": null,
            "description": null,
            "valueY": "87",
            "valueX": "1",
            "valueZ": null,
            "note": null
          }
        ],
        "active": true,
        "dataDate": "2020-05-01T00:00:00-04:00",
        "monthly": false,
        "hospitalName": null,
        "facilityName": "FE063AF9-99AB-4A0A-BCDD-DC9E76ECF567",
        "departmentName": "19F36BB1-82AE-4473-9AFB-C3E561ACA15E",
        "roomName": "92A1D4B7-806A-4D20-9D24-3376E0584124",
        "procedureName": "823774C6-5583-47B0-8397-1B2EBDA40794",
        "specialtyName": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F"
      },

      {
        "name": null,
        "reportName": "SSC_TS",
        "title": "Top 3 Specialties",
        "subTitle": "by Average Score",
        "body": null,
        "footer": null,
        "description": null,
        "total": null,
        "assets": null,
        "dataPoints": [
          {
            "title": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F",
            "subTitle": "",
            "description": "",
            "valueX": "89",
            "valueY": "",
            "valueZ": "",
            "note": ""
          },
          {
            "title": "95F656BA-06BE-4BB5-994C-3AC17FBC6DCB",
            "subTitle": "",
            "description": "",
            "valueX": "86",
            "valueY": "",
            "valueZ": "",
            "note": ""
          },
          {
            "title": "1E84E235-220B-4296-8BA2-9D6EA0FCE370",
            "subTitle": "",
            "description": "",
            "valueX": "80",
            "valueY": "",
            "valueZ": "",
            "note": ""
          }
        ],
        "active": true,
        "dataDate": "2020-05-01T00:00:00-04:00",
        "monthly": true,
        "hospitalName": "738D2883-5B17-454A-BD4D-9628218016F9",
        "facilityName": "FE063AF9-99AB-4A0A-BCDD-DC9E76ECF567",
        "departmentName": "19F36BB1-82AE-4473-9AFB-C3E561ACA15E",
        "roomName": "92A1D4B7-806A-4D20-9D24-3376E0584124",
        "procedureName": "823774C6-5583-47B0-8397-1B2EBDA40794",
        "specialtyName": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F"
      },
      {
        "name": null,
        "reportName": "SSC_CC",
        "title": null,
        "subTitle": null,
        "body": null,
        "footer": null,
        "description": "{0} Case Data based on filter criteria",
        "total": null,
        "assets": null,
        "dataPoints": [
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": "1000",
            "valueY": null,
            "valueZ": null,
            "note": null
          }
        ],
        "active": true,
        "dataDate": "2020-05-01T00:00:00-04:00",
        "monthly": false,
        "hospitalName": "738D2883-5B17-454A-BD4D-9628218016F9",
        "facilityName": "FE063AF9-99AB-4A0A-BCDD-DC9E76ECF567",
        "departmentName": "19F36BB1-82AE-4473-9AFB-C3E561ACA15E",
        "roomName": "92A1D4B7-806A-4D20-9D24-3376E0584124",
        "procedureName": "823774C6-5583-47B0-8397-1B2EBDA40794",
        "specialtyName": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F"
      }
      ]
      : [{
        "name": null,
        "reportName": null,
        "title": "Compliance Score",
        "subTitle": "View Compliance Details",
        "body": null,
        "footer": null,
        "description": null,
        "total": null,
        "assets": null,
        "dataPoints": [
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": 70,
            "valueY": null,
            "valueZ": null,
            "note": null
          }
        ],
        "active": true,
        "dataDate": "0001-01-01T00:00:00",
        "hospitalName": null,
        "facilityName": null,
        "departmentName": null,
        "roomName": null,
        "procedureName": null,
        "specialtyName": null
      },
      {
        "name": null,
        "reportName": null,
        "title": "Monthly Trend",
        "subTitle": "Score",
        "body": null,
        "footer": "Month",
        "description": null,
        "total": null,
        "assets": null,
        "dataPoints": [
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": 8,
            "valueY": 29,
            "valueZ": null,
            "note": null
          },
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": 9,
            "valueY": 37,
            "valueZ": null,
            "note": null
          },
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": 10,
            "valueY": 41,
            "valueZ": null,
            "note": null
          },
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": 11,
            "valueY": 68,
            "valueZ": null,
            "note": null
          },
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": 12,
            "valueY": 70,
            "valueZ": null,
            "note": null
          }
        ],
        "active": true,
        "dataDate": "0001-01-01T00:00:00",
        "hospitalName": null,
        "facilityName": null,
        "departmentName": null,
        "roomName": null,
        "procedureName": null,
        "specialtyName": null
      },
      {
        "name": null,
        "reportName": null,
        "title": "Missed Phases",
        "subTitle": "% of Cases",
        // "body": "Congratulations! In the month of December, there were 0 missed phases, and all phases were conducted at an appropriate time!",
        "body": null,
        "footer": "Phases",
        "description": null,
        "total": null,
        "assets": null,
        "dataPoints": [
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": "Briefing",
            "valueY": 20,
            "valueZ": 200,
            "note": null
          },
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": "Time Out",
            "valueY": 34,
            "valueZ": 340,
            "note": null
          },
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": "Postop Debrief",
            "valueY": 36,
            "valueZ": 360,
            "note": null
          }
        ],
        "active": true,
        "dataDate": "0001-01-01T00:00:00",
        "hospitalName": null,
        "facilityName": null,
        "departmentName": null,
        "roomName": null,
        "procedureName": null,
        "specialtyName": null
      },

      {
        "name": null,
        "reportName": "SSC_TS",
        "title": "Specialties of Interest",
        "subTitle": "by total missed phases and timing",
        // "body": "Congratulations! There were no lost opportunities thanks to everyone’s efforts.",
        "body": null,
        "footer": null,
        "description": null,
        "total": null,
        "assets": null,
        "dataPoints": [
          {
            "title": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F",
            "subTitle": "",
            "description": "",
            "valueX": "321",
            "valueY": "",
            "valueZ": "",
            "note": ""
          },
          {
            "title": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F",
            "subTitle": "E4E332CA-4908-4469-9F89-47895E54034D",
            "description": "",
            "valueX": "100",
            "valueY": "",
            "valueZ": "",
            "note": ""
          },
          {
            "title": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F",
            "subTitle": "823774C6-5583-47B0-8397-1B2EBDA40794",
            "description": "",
            "valueX": "67",
            "valueY": "",
            "valueZ": "",
            "note": ""
          },
          {
            "title": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F",
            "subTitle": "02A56FCE-67AB-4DD5-A048-F9B34FCFE00A",
            "description": "",
            "valueX": "66",
            "valueY": "",
            "valueZ": "",
            "note": ""
          },
          {
            "title": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F",
            "subTitle": "Other Procedures",
            "description": "",
            "valueX": "88",
            "valueY": "",
            "valueZ": "",
            "note": ""
          },
          {
            "title": "95F656BA-06BE-4BB5-994C-3AC17FBC6DCB",
            "subTitle": "",
            "description": "",
            "valueX": "300",
            "valueY": "",
            "valueZ": "",
            "note": ""
          },
          {
            "title": "95F656BA-06BE-4BB5-994C-3AC17FBC6DCB",
            "subTitle": "02A56FCE-67AB-4DD5-A048-F9B34FCFE00A",
            "description": "",
            "valueX": "111",
            "valueY": "",
            "valueZ": "",
            "note": ""
          },
          {
            "title": "95F656BA-06BE-4BB5-994C-3AC17FBC6DCB",
            "subTitle": "A3D407ED-DDDB-4F92-849C-C4C84E05659A",
            "description": "",
            "valueX": "82",
            "valueY": "",
            "valueZ": "",
            "note": ""
          },
          {
            "title": "95F656BA-06BE-4BB5-994C-3AC17FBC6DCB",
            "subTitle": "C1294BFB-E752-443E-AEA0-3C886512A4CF",
            "description": "",
            "valueX": "75",
            "valueY": "",
            "valueZ": "",
            "note": ""
          },
          {
            "title": "95F656BA-06BE-4BB5-994C-3AC17FBC6DCB",
            "subTitle": "Other procedures",
            "description": "",
            "valueX": "32",
            "valueY": "",
            "valueZ": "",
            "note": ""
          }
        ],
        "active": true,
        "dataDate": "2020-05-01T00:00:00-04:00",
        "monthly": true,
        "hospitalName": "738D2883-5B17-454A-BD4D-9628218016F9",
        "facilityName": "FE063AF9-99AB-4A0A-BCDD-DC9E76ECF567",
        "departmentName": "19F36BB1-82AE-4473-9AFB-C3E561ACA15E",
        "roomName": "92A1D4B7-806A-4D20-9D24-3376E0584124",
        "procedureName": "823774C6-5583-47B0-8397-1B2EBDA40794",
        "specialtyName": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F"
      },
      {
        "name": null,
        "reportName": null,
        "title": "Missed Timing",
        "subTitle": "% of Cases",
        "body": null,
        "footer": "Phases",
        "description": null,
        "total": null,
        "assets": null,
        "dataPoints": [
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": "Briefing After Skin Incision",
            "valueY": 30,
            "valueZ": 300,
            "note": null
          },
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": "Time Out After Skin Incision",
            "valueY": 34,
            "valueZ": 340,
            "note": null
          },
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": "Postop Debrief Before/During Skin Closing",
            "valueY": 30,
            "valueZ": 300,
            "note": null
          }
        ],
        "active": true,
        "dataDate": "0001-01-01T00:00:00",
        "hospitalName": null,
        "facilityName": null,
        "departmentName": null,
        "roomName": null,
        "procedureName": null,
        "specialtyName": null
      },
      {
        "name": null,
        "reportName": "SSC_CC",
        "title": null,
        "subTitle": null,
        "body": null,
        "footer": null,
        "description": "{0} Case Data based on filter criteria",
        "total": null,
        "assets": null,
        "dataPoints": [
          {
            "title": null,
            "subTitle": null,
            "description": null,
            "valueX": "1000",
            "valueY": null,
            "valueZ": null,
            "note": null
          }
        ],
        "active": true,
        "dataDate": "2020-05-01T00:00:00-04:00",
        "monthly": false,
        "hospitalName": "738D2883-5B17-454A-BD4D-9628218016F9",
        "facilityName": "FE063AF9-99AB-4A0A-BCDD-DC9E76ECF567",
        "departmentName": "19F36BB1-82AE-4473-9AFB-C3E561ACA15E",
        "roomName": "92A1D4B7-806A-4D20-9D24-3376E0584124",
        "procedureName": "823774C6-5583-47B0-8397-1B2EBDA40794",
        "specialtyName": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F"
      }
      ];
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reportType != this.props.reportType) {
      this.temp = this.getTemp();
      this.setState({ reportType: this.props.reportType, reportData: [] }, () => {
        this.getReportLayout();
      })
    }
  }

  componentDidMount() {
    this.loadFilter();
    this.getReportLayout();
  };

  getReportLayout() {
    this.state.source && this.state.source.cancel('Cancel outdated report calls');
    this.setState({ isLoading: true, source: axios.CancelToken.source() },
      () => {
        let jsonBody = {
          "reportType": this.state.reportType
        };
        globalFunctions.axiosFetch(process.env.SSC_API, this.props.userToken, jsonBody, this.state.source.token)
          .then(result => {
            result = result.data;
            if (result === 'error' || result === 'conflict') {
              this.notLoading();
            } else if (result) {
              if (result.tileRequest && result.tileRequest.length > 0) {
                let reportData = this.groupTiles(result.tileRequest.sort((a, b) => a.groupOrder - b.groupOrder || a.tileOrder - b.tileOrder));
                let tileRequest = result.tileRequest.filter((tile) => {
                  return moment(tile.startDate).isSame(this.state.month, 'month');
                });
                this.setState({ pendingTileCount: this.state.pendingTileCount + result.tileRequest.length, reportData, tileRequest },
                  () => {
                    //TODO: remove 'index' for hardcoded list 
                    let index = 0;
                    this.state.reportData.map((tileGroup, i) => {
                      tileGroup.group.map((tile, j) => {
                        index += 1;
                        this.getTile(tile, i, j, index);
                      });
                    })

                  });
              } else {
                //report does not exist
                this.notLoading();
              }
            } else {
              this.notLoading();
            }
          }).catch((error) => {
            this.state.source && this.state.source.cancel('Things have changed');
            // console.error("ssc",error)
          });
      });
  };

  getTile(tileRequest, i, j, index) {
    let jsonBody = {
      "facilityName": tileRequest.facilityName,
      "reportName": tileRequest.reportName,
      "hospitalName": tileRequest.hospitalName,
      "departmentName": tileRequest.departmentName,

      "startDate": this.state.month.startOf('month').format(),
      "endDate": this.state.month.endOf('month').format(),
      "tileType": tileRequest.tileType,
      "dashboardName": tileRequest.dashboardName,

      "roomName": this.state.selectedOperatingRoom && this.state.selectedOperatingRoom.value,
      "day": this.state.selectedWeekday,
      "specialtyName": this.state.selectedSpecialty && this.state.selectedSpecialty.value,
      "procedureName": this.state.selectedProcedure && this.state.selectedProcedure.value
    }

    globalFuncs.axiosFetch(process.env.SSCTILE_API, this.props.userToken, jsonBody, this.state.source.token)
      .then(result => {
        if (result === 'error' || result === 'conflict') {
          this.notLoading();
        } else {
          //TODO: remove hardcoded values
          result = this.temp[index - 1];
          result.tileOrder = tileRequest.tileOrder;
          result.tileType = tileRequest.tileType;
          result.groupOrder = tileRequest.groupOrder;

          let reportData = this.state.reportData;
          if (moment(tileRequest.startDate).isSame(this.state.month, 'month')) {
            reportData[i].group[j] = result;
          }
          this.setState({ reportData, pendingTileCount: this.state.pendingTileCount - 1 },
            () => {
              if (this.state.pendingTileCount <= 0) {
                // let reportData = this.state.rawData.sort((a, b) => a.groupOrder - b.groupOrder || a.tileOrder - b.tileOrder);
                this.notLoading();
              }
            });
        }
      }).catch((error) => {
        this.setState({ pendingTileCount: this.state.pendingTileCount - 1 })
        // console.error("tile",error)
      });
  }

  groupTiles(tileData) {
    //Group data by "Group"
    return [...tileData.reduce((hash, data) => {
      const current = hash.get(data.groupOrder) || { groupOrder: data.groupOrder, group: [] }
      current.group.push(data)
      return hash.set(data.groupOrder, current);
    }, new Map).values()];
  }

  updateMonth(month) {
    this.setState({
      month: month,
      isLoading: true
    }, () => {
      this.saveFilter();
      this.getReportLayout();
    });
  }

  updateState(key, value) {
    this.setState({
      [key]: value
    }, () => {
      this.saveFilter();
    });
  }

  loadFilter() {
    if (localStorage.getItem('sscFilter-' + this.props.userEmail)) {
      const recentSearchCache = JSON.parse(localStorage.getItem('sscFilter-' + this.props.userEmail));
      this.setState({ ...recentSearchCache, month: moment(recentSearchCache.month) });
    }
  }

  saveFilter() {
    localStorage.setItem('sscFilter-' + this.props.userEmail,
      JSON.stringify({
        month: this.state.month,
        selectedOperatingRoom: this.state.selectedOperatingRoom,
        selectedWeekday: this.state.selectedWeekday,
        selectedSpecialty: this.state.selectedSpecialty,
        selectedProcedure: this.state.selectedProcedure
      }));
  }

  redirect(requestId) {
    this.props.pushUrl('/emm/' + requestId);
  }

  renderTiles() {
    //Tiles of the same type get a different colour
    let tileTypeCount = {};

    return this.state.reportData.map((tileGroup, index) => {
      //Tiles in the same group are displayed in 1 "Card"
      let tile = tileGroup.group[0];
      if (tileGroup.group.length > 1) {
        return (
          <Grid item xs={12} key={`-${index}`}>
            <Card className="ssc-card">
              <CardContent>
                <Grid container spacing={0} alignItems="center">
                  {tile.tileType == 'StackedBarChart' && <Grid className="chart-title" style={{textAlign:'center',marginBottom:24}} item xs={12}>{tile.title}</Grid>}
                  {
                    tileGroup.group.map((tile, i) => {
                      tileTypeCount[tile.tileType] = tileTypeCount[tile.tileType] ? tileTypeCount[tile.tileType] + 1 : 1;
                      tile.tileTypeCount = tileTypeCount[tile.tileType];
                      return <Grid item xs={this.getTileSize(tile.tileType)} key={`${tile.tileType}${i}`}>{this.renderTile(tile)}</Grid>
                    })
                  }
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )
      }
      tileTypeCount[tile.tileType] = tileTypeCount[tile.tileType] ? tileTypeCount[tile.tileType] + 1 : 1;
      tile.tileTypeCount = tileTypeCount[tile.tileType];
      return (
        <Grid item xs={this.getTileSize(tile.tileType)} key={index}>
          <Card className={`ssc-card ${tile.tileType}`}>
            <CardContent>{this.renderTile(tile)}</CardContent>
          </Card>
        </Grid>
      )
    })
  }

  renderTile(tile) {
    switch (tile.tileType) {
      case 'List':
        return <HorizontalBarChart {...tile} specialties={this.props.specialties} />
      case 'InfographicText':
        return <ReportScore
          pushUrl={this.props.pushUrl}
          title={tile.title}
          redirectDisplay={tile.subTitle}
          redirectLink={tile.footer}
          score={tile.dataPoints && tile.dataPoints.length && tile.dataPoints[0].valueX}
          tooltipText={tile.description} />
      case 'BarChartDetailed':
        return <BarChartDetailed {...tile} pushUrl={this.props.pushUrl} />
      case 'InfographicParagraph':
        return <InfographicParagraph {...tile} />
      case 'LineChart':
      case 'AreaChart':
        return <AreaChart {...tile} />
      case 'BarChart':
        return <BarChart pattern={this.state.chartColours.slice(tile.tileTypeCount - 1 % this.state.chartColours.length)} {...tile} />
      case 'ListDetail':
      case 'ListDetailed':
      case 'Checklist':
        return <ListDetailed {...tile} specialties={this.props.specialties} />
      case 'StackedBarChart':
        return <StackedBarChart {...tile} specialties={this.props.specialties} />
    }
  }

  getTileSize(tileType) {
    switch (tileType) {
      case 'List':
      case 'ListDetail':
      case 'ListDetailed':
      case 'InfographicText':
      case 'Checklist':
        return 4;
      case 'BarChart':
      case 'AreaChart':
      case 'LineChart':
      case 'BarChartDetailed':
      case 'StackedBarChart':
        return 8;
      case 'InfographicParagraph':
        return 12;
    }
  }

  notLoading() {
    this.setState({
      isLoading: false
    });
  }

  render() {
    return (
      <div className="ssc-page">
        <Grid container spacing={0} className="ssc-picker-container" >
          <Grid item xs={12} className="ssc-picker">
            <div style={{ maxWidth: 800, margin: 'auto' }}><MonthPicker month={this.state.month} updateMonth={(month) => this.updateMonth(month)} /></div>
          </Grid>
          <Grid item xs={12}>
            <Divider className="ssc-divider" />
          </Grid>
          <Grid item xs={12} className="ssc-picker">
            <UniversalPicker
              specialties={this.props.specialties}
              userFacility={this.props.userFacility}
              userToken={this.props.userToken}
              defaultState={this.state}
              apply={() => this.getReportLayout()}
              updateState={(key, value) => this.updateState(key, value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider className="ssc-divider" />
          </Grid>
        </Grid>
        <LoadingOverlay
          active={this.state.loading}
          spinner
          text='Loading your content...'
          className="overlay"
          styles={{
            overlay: (base) => ({
              ...base,
              background: 'none',
              color: '#000',
              marginTop: 150
            }),
            spinner: (base) => ({
              ...base,
              '& svg circle': {
                stroke: 'rgba(0, 0, 0, 0.5)'
              }
            })
          }}
        >
          <Grid container spacing={3} className="ssc-main">
            {this.state.loading || !this.state.tileRequest.length ?
              <Grid item xs={12} className="ssc-message">
                No data available this month
            </Grid> :
              this.renderTiles()}
          </Grid>
        </LoadingOverlay>
      </div>
    );
  }
}