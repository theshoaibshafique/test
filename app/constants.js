export const idleTimeout = 1000 * 60 * 45; // in Milliseconds

export const EMM_DISTRACTION_TOOLTIP = 'Distraction Index consists of evidence-based audible and visual distractions such as conversation and machine alarms. The Distraction Index has a range between 0 and 100, with an average procedure having a Distraction Index of 30, and greater scores indicative of more distracting operating room environments.';
export const EMM_TECHNICAL_TOOLTIP = 'Performance Index consists of evidence-based components such as time based metrics, measures of manual dexterity and intraoperative adverse events. The Performance Index has a range between 0 and 100. An average procedure will have a Performance Index of 70, with higher scores indicative of better performance.'
export const EMM_ADVERSEEVENT_TOOLTIP = 'Adverse Event Rate is the number of intraoperative adverse events that occured per hour of surgical procedure.';

export const EFFICIENCY_DATA = {
  "dashboardName": "efficiency",
  "tiles": [
    {
      "groupOrder": 1,
      "tileOrder": 1,
      "tileType": "NoData",
      "dataPoints": null,
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": "First Case On-Time Start",
      "subTitle": null,
      "body": "First Case On Time analysis cannot be completed due to unavailable EMR data.",
      "footer": null,
      "description": null,
      "toolTip": "Percentage of days where the first case began at or before the scheduled start time.",
      "total": null,
      "unit": "%",
      // "url": "/daysStarting",
      // "urlText": "Learn more",
      "xAxis": null,
      "yAxis": "First Case On-Time Start (%)"
    },
    {
      "groupOrder": 1,
      "tileOrder": 2,
      "tileType": "BarChart",
      "dataPoints": [
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "OR30",
          "valueY": "44",
          "valueZ": null,
          "toolTip": [
            "44 minutes"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "OR05",
          "valueY": "43",
          "valueZ": null,
          "toolTip": [
            "43 minutes"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "OR06",
          "valueY": "42",
          "valueZ": null,
          "toolTip": [
            "42 minutes"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "OR07",
          "valueY": "35",
          "valueZ": null,
          "toolTip": [
            "35 minutes"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "OR08",
          "valueY": "34",
          "valueZ": null,
          "toolTip": [
            "34 minutes"
          ]
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": "Turnover Time",
      "subTitle": null,
      "body": null,
      "footer": null,
      "description": null,
      "toolTip": "Average duration of non-outlier turnovers within block hours.",
      "total": null,
      "unit": null,
      "url": "/turnoverTime",
      "urlText": "Learn more",
      "xAxis": null,
      "yAxis": "Average Turnover (minutes)"
    },
    {
      "groupOrder": 2,
      "tileOrder": 1,
      "tileType": "DetailedMultiLineChart",
      "dataPoints": [],
      "subReportData": [
        {
          "title": "OR07",
          "subTitle": "19 cases",
          "footer": "Utilization",
          "total": "76",
          "unit": "%",
          "xAxis": "Last 6 months",
          "dataPoints": [
            {
              "active": false,
              "title": null,
              "subTitle": null,
              "description": null,
              "note": null,
              "valueX": "8.0",
              "valueY": null,
              "valueZ": null,
              "toolTip": []
            },
            {
              "active": false,
              "title": null,
              "subTitle": null,
              "description": null,
              "note": null,
              "valueX": "9.0",
              "valueY": "60",
              "valueZ": null,
              "toolTip": []
            },
            {
              "active": false,
              "title": null,
              "subTitle": null,
              "description": null,
              "note": null,
              "valueX": "10.0",
              "valueY": "69",
              "valueZ": null,
              "toolTip": []
            },
            {
              "active": false,
              "title": null,
              "subTitle": null,
              "description": null,
              "note": null,
              "valueX": "11.0",
              "valueY": "67",
              "valueZ": null,
              "toolTip": []
            },
            {
              "active": false,
              "title": null,
              "subTitle": null,
              "description": null,
              "note": null,
              "valueX": "12.0",
              "valueY": "73",
              "valueZ": null,
              "toolTip": []
            },
            {
              "active": false,
              "title": null,
              "subTitle": null,
              "description": null,
              "note": null,
              "valueX": "1.0",
              "valueY": "76",
              "valueZ": null,
              "toolTip": []
            }
          ]
        },
        {
          "title": "OR05",
          "subTitle": "19 cases",
          "footer": "Utilization",
          "total": "72",
          "unit": "%",
          "xAxis": "Last 6 months",
          "dataPoints": [
            {
              "active": false,
              "title": null,
              "subTitle": null,
              "description": null,
              "note": null,
              "valueX": "8.0",
              "valueY": null,
              "valueZ": null,
              "toolTip": []
            },
            {
              "active": false,
              "title": null,
              "subTitle": null,
              "description": null,
              "note": null,
              "valueX": "9.0",
              "valueY": "67",
              "valueZ": null,
              "toolTip": []
            },
            {
              "active": false,
              "title": null,
              "subTitle": null,
              "description": null,
              "note": null,
              "valueX": "10.0",
              "valueY": "73",
              "valueZ": null,
              "toolTip": []
            },
            {
              "active": false,
              "title": null,
              "subTitle": null,
              "description": null,
              "note": null,
              "valueX": "11.0",
              "valueY": "64",
              "valueZ": null,
              "toolTip": []
            },
            {
              "active": false,
              "title": null,
              "subTitle": null,
              "description": null,
              "note": null,
              "valueX": "12.0",
              "valueY": "67",
              "valueZ": null,
              "toolTip": []
            },
            {
              "active": false,
              "title": null,
              "subTitle": null,
              "description": null,
              "note": null,
              "valueX": "1.0",
              "valueY": "72",
              "valueZ": null,
              "toolTip": []
            }
          ]
        },
        {
          "title": "OR06",
          "subTitle": "17 cases",
          "footer": "Utilization",
          "total": "72",
          "unit": "%",
          "xAxis": "Last 6 months",
          "dataPoints": [
            {
              "active": false,
              "title": null,
              "subTitle": null,
              "description": null,
              "note": null,
              "valueX": "8.0",
              "valueY": null,
              "valueZ": null,
              "toolTip": []
            },
            {
              "active": false,
              "title": null,
              "subTitle": null,
              "description": null,
              "note": null,
              "valueX": "9.0",
              "valueY": "80",
              "valueZ": null,
              "toolTip": []
            },
            {
              "active": false,
              "title": null,
              "subTitle": null,
              "description": null,
              "note": null,
              "valueX": "10.0",
              "valueY": "74",
              "valueZ": null,
              "toolTip": []
            },
            {
              "active": false,
              "title": null,
              "subTitle": null,
              "description": null,
              "note": null,
              "valueX": "11.0",
              "valueY": "69",
              "valueZ": null,
              "toolTip": []
            },
            {
              "active": false,
              "title": null,
              "subTitle": null,
              "description": null,
              "note": null,
              "valueX": "12.0",
              "valueY": "73",
              "valueZ": null,
              "toolTip": []
            },
            {
              "active": false,
              "title": null,
              "subTitle": null,
              "description": null,
              "note": null,
              "valueX": "1.0",
              "valueY": "72",
              "valueZ": null,
              "toolTip": []
            }
          ]
        }
      ],
      "dataPointRows": [],
      "name": null,
      "title": "OR Utilization",
      "subTitle": null,
      "body": null,
      "footer": null,
      "description": null,
      "toolTip": "Percentage of block hours used for case time (wheels in to wheels out).",
      "total": null,
      "unit": null,
      "url": "/orUtilization",
      "urlText": "Learn more",
      "xAxis": null,
      "yAxis": null
    },
    {
      "groupOrder": 2,
      "tileOrder": 2,
      "tileType": "DonutChart",
      "dataPoints": [
        {
          "active": false,
          "title": "NOT PROVIDED",
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "1",
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "NOT PROVIDED: 1"
          ]
        },
        {
          "active": false,
          "title": "PLASTIC",
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "1",
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "PLASTIC: 1"
          ]
        },
        {
          "active": false,
          "title": "CARDIOTHORACIC",
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "2",
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "CARDIOTHORACIC: 2"
          ]
        },
        {
          "active": false,
          "title": "GYNECOLOGY & OBSTETRICS",
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "5",
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "GYNECOLOGY & OBSTETRICS: 5"
          ]
        },
        {
          "active": false,
          "title": "GENERAL",
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "10",
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "GENERAL: 10"
          ]
        },
        {
          "active": false,
          "title": "UROLOGY",
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "29",
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "UROLOGY: 29"
          ]
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": "Case Analysis",
      "subTitle": "Total Cases",
      "body": null,
      "footer": null,
      "description": null,
      "toolTip": null,
      "total": "48",
      "unit": null,
      "url": "/caseAnalysis",
      "urlText": "Learn more",
      "xAxis": null,
      "yAxis": null
    },
    {
      "groupOrder": 3,
      "tileOrder": 1,
      "tileType": "InfographicParagraph",
      "dataPoints": [
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "11 days",
          "valueY": null,
          "valueZ": null,
          "toolTip": []
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": null,
      "subTitle": null,
      "body": null,
      "footer": null,
      "description": "Based on {0} with elective hours from your filter criteria",
      "toolTip": null,
      "total": null,
      "unit": null,
      "url": null,
      "urlText": null,
      "xAxis": null,
      "yAxis": null
    }
  ],
  "globalTiles": [
    {
      "groupOrder": 1,
      "tileOrder": 1,
      "tileType": "BarChart",
      "dataPoints": [
        {
          "active": false,
          "title": "Idle",
          "subTitle": null,
          "description": null,
          "note": "The time when the room is not in use between room clean-up and room setup.",
          "valueX": "Clements University Hospital",
          "valueY": "0",
          "valueZ": null,
          "toolTip": [
            "0 minute idle"
          ]
        },
        {
          "active": false,
          "title": "Clean-up",
          "subTitle": null,
          "description": null,
          "note": "The time between the patient leaving the operating room and the last member of the cleaning team leaving the operating room.",
          "valueX": "Clements University Hospital",
          "valueY": "8",
          "valueZ": null,
          "toolTip": [
            "8 minute clean-up"
          ]
        },
        {
          "active": false,
          "title": "Setup",
          "subTitle": null,
          "description": null,
          "note": "The time between the first member of the surgical team commencing room preparation for a case, and the patient entering the operating room.",
          "valueX": "Clements University Hospital",
          "valueY": "30",
          "valueZ": null,
          "toolTip": [
            "30 minute setup"
          ]
        },
        {
          "active": false,
          "title": "Idle",
          "subTitle": null,
          "description": null,
          "note": "The time when the room is not in use between room clean-up and room setup.",
          "valueX": "Global",
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "None minute idle"
          ]
        },
        {
          "active": false,
          "title": "Clean-up",
          "subTitle": null,
          "description": null,
          "note": "The time between the patient leaving the operating room and the last member of the cleaning team leaving the operating room.",
          "valueX": "Global",
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "None minute clean-up"
          ]
        },
        {
          "active": false,
          "title": "Setup",
          "subTitle": null,
          "description": null,
          "note": "The time between the first member of the surgical team commencing room preparation for a case, and the patient entering the operating room.",
          "valueX": "Global",
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "None minute setup"
          ]
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": "Turnover Comparison",
      "subTitle": null,
      "body": null,
      "footer": null,
      "description": null,
      "toolTip": null,
      "total": null,
      "unit": " mins",
      "url": null,
      "urlText": null,
      "xAxis": null,
      "yAxis": "Average Duration (minutes)"
    },
    {
      "groupOrder": 1,
      "tileOrder": 2,
      "tileType": "BarChart",
      "dataPoints": [
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": null,
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "None% utilization"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": null,
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "None% utilization"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": null,
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "None% utilization"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": null,
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "None% utilization"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": null,
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "None% utilization"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": null,
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "None% utilization"
          ]
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": "Block Utilization Comparison",
      "subTitle": null,
      "body": null,
      "footer": null,
      "description": null,
      "toolTip": null,
      "total": null,
      "unit": "%",
      "url": null,
      "urlText": null,
      "xAxis": null,
      "yAxis": "Block Utilization (%)"
    }
  ]
}
 export const FCOT = {
  "dashboardName": "firstCaseOnTimeStart",
  "tiles": [
    {
      "groupOrder": 1,
      "tileOrder": 1,
      "tileType": "InfographicText",
      "dataPoints": [],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": "First Case On-Time Start",
      "subTitle": null,
      "body": null,
      "footer": null,
      "description": null,
      "toolTip": "Percentage of days where the first case began at or before the scheduled start time.",
      "total": "67",
      "unit": "%",
      "url": null,
      "urlText": null,
      "xAxis": null,
      "yAxis": null
    },
    {
      "groupOrder": 2,
      "tileOrder": 1,
      "tileType": "BarChart",
      "dataPoints": [
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "Aug",
          "valueY": "0",
          "valueZ": null,
          "toolTip": [
            "0 first case on-time start"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "Sep",
          "valueY": "70",
          "valueZ": null,
          "toolTip": [
            "70 first case on-time start"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "Oct",
          "valueY": "64",
          "valueZ": null,
          "toolTip": [
            "64 first case on-time start"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "Nov",
          "valueY": "71",
          "valueZ": null,
          "toolTip": [
            "71 first case on-time start"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "Dec",
          "valueY": "72",
          "valueZ": null,
          "toolTip": [
            "72 first case on-time start"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "Jan",
          "valueY": "67",
          "valueZ": null,
          "toolTip": [
            "67 first case on-time start"
          ]
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": "First Case On-Time Start Trend",
      "subTitle": null,
      "body": null,
      "footer": null,
      "description": null,
      "toolTip": null,
      "total": null,
      "unit": "%",
      "url": null,
      "urlText": null,
      "xAxis": null,
      "yAxis": "First Case On-Time Start (%)"
    },
    {
      "groupOrder": 2,
      "tileOrder": 2,
      "tileType": "Histogram",
      "dataPoints": [
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "-5",
          "valueY": "2",
          "valueZ": null,
          "toolTip": [
            "Range: [-10, -5)",
            "Frequency: 2"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "0",
          "valueY": "9",
          "valueZ": null,
          "toolTip": [
            "Range: [-5, 0)",
            "Frequency: 9"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "5",
          "valueY": "12",
          "valueZ": null,
          "toolTip": [
            "Range: [0, 5)",
            "Frequency: 12"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "10",
          "valueY": "6",
          "valueZ": null,
          "toolTip": [
            "Range: [5, 10)",
            "Frequency: 6"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "15",
          "valueY": "2",
          "valueZ": null,
          "toolTip": [
            "Range: [10, 15)",
            "Frequency: 2"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "20",
          "valueY": "2",
          "valueZ": null,
          "toolTip": [
            "Range: [15, 20)",
            "Frequency: 2"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "25",
          "valueY": "2",
          "valueZ": null,
          "toolTip": [
            "Range: [20, 25)",
            "Frequency: 2"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "30",
          "valueY": "1",
          "valueZ": null,
          "toolTip": [
            "Range: [25, 30)",
            "Frequency: 1"
          ]
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": "Distribution of First Case Delays",
      "subTitle": "Deltas between scheduled start and actual start",
      "body": null,
      "footer": null,
      "description": null,
      "toolTip": null,
      "total": null,
      "unit": null,
      "url": null,
      "urlText": null,
      "xAxis": "Scheduled Start Delay (minutes)",
      "yAxis": "Frequency"
    },
    {
      "groupOrder": 3,
      "tileOrder": 1,
      "tileType": "InfographicParagraph",
      "dataPoints": [
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "11 days",
          "valueY": null,
          "valueZ": null,
          "toolTip": []
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": null,
      "subTitle": null,
      "body": null,
      "footer": null,
      "description": "Based on {0} with elective hours from your filter criteria",
      "toolTip": null,
      "total": null,
      "unit": null,
      "url": null,
      "urlText": null,
      "xAxis": null,
      "yAxis": null
    }
  ],
  "globalTiles": []
}

export const TURNOVER = {
  "dashboardName": "turnoverTime",
  "tiles": [
    {
      "groupOrder": 1,
      "tileOrder": 1,
      "tileType": "InfographicText",
      "dataPoints": [],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": "Total Cases",
      "subTitle": null,
      "body": null,
      "footer": null,
      "description": null,
      "toolTip": null,
      "total": "193",
      "unit": null,
      "url": null,
      "urlText": null,
      "xAxis": null,
      "yAxis": null
    },
    {
      "groupOrder": 2,
      "tileOrder": 2,
      "tileType": "StackedBarChart",
      "dataPoints": [
        {
          "active": false,
          "title": "Idle",
          "subTitle": null,
          "description": null,
          "note": "The time when the room is not in use between room clean-up and room setup.",
          "valueX": "8.0",
          "valueY": null,
          "valueZ": null
        },
        {
          "active": false,
          "title": "Clean-up",
          "subTitle": null,
          "description": null,
          "note": "The time between the patient leaving the operating room and the last member of the cleaning team leaving the operating room.",
          "valueX": "8.0",
          "valueY": null,
          "valueZ": null
        },
        {
          "active": false,
          "title": "Setup",
          "subTitle": null,
          "description": null,
          "note": "The time between the first member of the surgical team commencing room preparation for a case, and the patient entering the operating room.",
          "valueX": "8.0",
          "valueY": null,
          "valueZ": null
        },
        {
          "active": false,
          "title": "Idle",
          "subTitle": null,
          "description": null,
          "note": "The time when the room is not in use between room clean-up and room setup.",
          "valueX": "9.0",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": "Clean-up",
          "subTitle": null,
          "description": null,
          "note": "The time between the patient leaving the operating room and the last member of the cleaning team leaving the operating room.",
          "valueX": "9.0",
          "valueY": "5",
          "valueZ": null
        },
        {
          "active": false,
          "title": "Setup",
          "subTitle": null,
          "description": null,
          "note": "The time between the first member of the surgical team commencing room preparation for a case, and the patient entering the operating room.",
          "valueX": "9.0",
          "valueY": "37",
          "valueZ": null
        },
        {
          "active": false,
          "title": "Idle",
          "subTitle": null,
          "description": null,
          "note": "The time when the room is not in use between room clean-up and room setup.",
          "valueX": "10.0",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": "Clean-up",
          "subTitle": null,
          "description": null,
          "note": "The time between the patient leaving the operating room and the last member of the cleaning team leaving the operating room.",
          "valueX": "10.0",
          "valueY": "6",
          "valueZ": null
        },
        {
          "active": false,
          "title": "Setup",
          "subTitle": null,
          "description": null,
          "note": "The time between the first member of the surgical team commencing room preparation for a case, and the patient entering the operating room.",
          "valueX": "10.0",
          "valueY": "31",
          "valueZ": null
        },
        {
          "active": false,
          "title": "Idle",
          "subTitle": null,
          "description": null,
          "note": "The time when the room is not in use between room clean-up and room setup.",
          "valueX": "11.0",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": "Clean-up",
          "subTitle": null,
          "description": null,
          "note": "The time between the patient leaving the operating room and the last member of the cleaning team leaving the operating room.",
          "valueX": "11.0",
          "valueY": "7",
          "valueZ": null
        },
        {
          "active": false,
          "title": "Setup",
          "subTitle": null,
          "description": null,
          "note": "The time between the first member of the surgical team commencing room preparation for a case, and the patient entering the operating room.",
          "valueX": "11.0",
          "valueY": "31",
          "valueZ": null
        },
        {
          "active": false,
          "title": "Idle",
          "subTitle": null,
          "description": null,
          "note": "The time when the room is not in use between room clean-up and room setup.",
          "valueX": "12.0",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": "Clean-up",
          "subTitle": null,
          "description": null,
          "note": "The time between the patient leaving the operating room and the last member of the cleaning team leaving the operating room.",
          "valueX": "12.0",
          "valueY": "8",
          "valueZ": null
        },
        {
          "active": false,
          "title": "Setup",
          "subTitle": null,
          "description": null,
          "note": "The time between the first member of the surgical team commencing room preparation for a case, and the patient entering the operating room.",
          "valueX": "12.0",
          "valueY": "29",
          "valueZ": null
        },
        {
          "active": false,
          "title": "Idle",
          "subTitle": null,
          "description": null,
          "note": "The time when the room is not in use between room clean-up and room setup.",
          "valueX": "1.0",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": "Clean-up",
          "subTitle": null,
          "description": null,
          "note": "The time between the patient leaving the operating room and the last member of the cleaning team leaving the operating room.",
          "valueX": "1.0",
          "valueY": "8",
          "valueZ": null
        },
        {
          "active": false,
          "title": "Setup",
          "subTitle": null,
          "description": null,
          "note": "The time between the first member of the surgical team commencing room preparation for a case, and the patient entering the operating room.",
          "valueX": "1.0",
          "valueY": "31",
          "valueZ": null
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": "Monthly Turnover Trend",
      "subTitle": null,
      "body": null,
      "footer": null,
      "description": null,
      "toolTip": null,
      "total": null,
      "unit": " mins",
      "url": null,
      "urlText": null,
      "xAxis": null,
      "yAxis": "Average Duration (minutes)"
    },
    {
      "groupOrder": 2,
      "tileOrder": 1,
      "tileType": "DonutChart",
      "dataPoints": [
        {
          "active": false,
          "title": "Idle",
          "subTitle": null,
          "description": null,
          "note": "The time when the room is not in use between room clean-up and room setup.",
          "valueX": "0",
          "valueY": null,
          "valueZ": null
        },
        {
          "active": false,
          "title": "Clean-up",
          "subTitle": null,
          "description": null,
          "note": "The time between the patient leaving the operating room and the last member of the cleaning team leaving the operating room.",
          "valueX": "8",
          "valueY": null,
          "valueZ": null
        },
        {
          "active": false,
          "title": "Setup",
          "subTitle": null,
          "description": null,
          "note": "The time between the first member of the surgical team commencing room preparation for a case, and the patient entering the operating room.",
          "valueX": "30",
          "valueY": null,
          "valueZ": null
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": "Turnover Composition",
      "subTitle": "Avg. Turnover",
      "body": null,
      "footer": null,
      "description": "Avg.",
      "toolTip": null,
      "total": "38",
      "unit": "mins",
      "url": null,
      "urlText": null,
      "xAxis": null,
      "yAxis": null
    },
    {
      "groupOrder": 3,
      "tileOrder": 1,
      "tileType": "Histogram",
      "dataPoints": [
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "10",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "20",
          "valueY": "2",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "30",
          "valueY": "43",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "40",
          "valueY": "80",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "50",
          "valueY": "41",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "60",
          "valueY": "21",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "70",
          "valueY": "13",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "80",
          "valueY": "2",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "90",
          "valueY": "5",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "100",
          "valueY": "2",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "110",
          "valueY": "3",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "120",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "130",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "140",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "150",
          "valueY": "2",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "160",
          "valueY": "2",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "170",
          "valueY": "2",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "180",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "190",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "200",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "210",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "220",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "230",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "240",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "250",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "260",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "270",
          "valueY": "2",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "280",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "290",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "300",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "310",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "320",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "330",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "340",
          "valueY": "0",
          "valueZ": null
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": "Turnover Duration Distribution",
      "subTitle": null,
      "body": null,
      "footer": null,
      "description": null,
      "toolTip": null,
      "total": null,
      "unit": null,
      "url": null,
      "urlText": null,
      "xAxis": "Duration of Turnover (minutes)",
      "yAxis": "Frequency"
    },
    {
      "groupOrder": 4,
      "tileOrder": 1,
      "tileType": "InfographicParagraph",
      "dataPoints": [
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "54 days",
          "valueY": null,
          "valueZ": null
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": null,
      "subTitle": null,
      "body": null,
      "footer": null,
      "description": "Based on {0} with elective hours from your filter criteria",
      "toolTip": null,
      "total": null,
      "unit": null,
      "url": null,
      "urlText": null,
      "xAxis": null,
      "yAxis": null
    }
  ],
  "globalTiles": []
};

export const BLOCKUTILIZATION = {
  "dashboardName": "blockUtilization",
  "tiles": [
    {
      "groupOrder": 1,
      "tileOrder": 1,
      "tileType": "InfographicText",
      "dataPoints": [],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": "Block Utilization",
      "subTitle": null,
      "body": null,
      "footer": null,
      "description": null,
      "toolTip": "Percentage of block hours used for case time (wheels in to wheels out).",
      "total": "67",
      "unit": "%",
      "url": null,
      "urlText": null,
      "xAxis": null,
      "yAxis": null
    },
    {
      "groupOrder": 2,
      "tileOrder": 1,
      "tileType": "BarChart",
      "dataPoints": [
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "Aug",
          "valueY": "0",
          "valueZ": null,
          "toolTip": [
            "0% utilization"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "Sep",
          "valueY": "71",
          "valueZ": null,
          "toolTip": [
            "71% utilization"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "Oct",
          "valueY": "67",
          "valueZ": null,
          "toolTip": [
            "67% utilization"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "Nov",
          "valueY": "63",
          "valueZ": null,
          "toolTip": [
            "63% utilization"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "Dec",
          "valueY": "69",
          "valueZ": null,
          "toolTip": [
            "69% utilization"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "Jan",
          "valueY": "67",
          "valueZ": null,
          "toolTip": [
            "67% utilization"
          ]
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": "Block Utilization Trend",
      "subTitle": null,
      "body": null,
      "footer": null,
      "description": null,
      "toolTip": null,
      "total": null,
      "unit": null,
      "url": null,
      "urlText": null,
      "xAxis": null,
      "yAxis": "Block Utilization (%)"
    },
    {
      "groupOrder": 2,
      "tileOrder": 2,
      "tileType": "DonutChart",
      "dataPoints": [
        {
          "active": false,
          "title": "NOT PROVIDED",
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "1",
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "NOT PROVIDED: 1"
          ]
        },
        {
          "active": false,
          "title": "GI",
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "1",
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "GI: 1"
          ]
        },
        {
          "active": false,
          "title": "PLASTIC",
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "2",
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "PLASTIC: 2"
          ]
        },
        {
          "active": false,
          "title": "CARDIOTHORACIC",
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "6",
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "CARDIOTHORACIC: 6"
          ]
        },
        {
          "active": false,
          "title": "GYNECOLOGY & OBSTETRICS",
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "12",
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "GYNECOLOGY & OBSTETRICS: 12"
          ]
        },
        {
          "active": false,
          "title": "GENERAL",
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "15",
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "GENERAL: 15"
          ]
        },
        {
          "active": false,
          "title": "UROLOGY",
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "48",
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "UROLOGY: 48"
          ]
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": "Case Distribution by Specialty",
      "subTitle": "Total Cases",
      "body": null,
      "footer": null,
      "description": null,
      "toolTip": null,
      "total": "85",
      "unit": null,
      "url": null,
      "urlText": null,
      "xAxis": null,
      "yAxis": null
    },
    {
      "groupOrder": 3,
      "tileOrder": 1,
      "tileType": "DonutChart",
      "dataPoints": [
        {
          "active": false,
          "title": "Idle",
          "subTitle": null,
          "description": null,
          "note": "The time when the room is not in use between room clean-up and room setup.",
          "valueX": 1,
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "None%",
            "None hours"
          ]
        },
        {
          "active": false,
          "title": "Clean-up",
          "subTitle": null,
          "description": null,
          "note": "The time between the patient leaving the operating room and the last member of the cleaning team leaving the operating room.",
          "valueX": 33,
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "None%",
            "None hours"
          ]
        },
        {
          "active": false,
          "title": "Setup",
          "subTitle": null,
          "description": null,
          "note": "The time between the first member of the surgical team commencing room preparation for a case, and the patient entering the operating room.",
          "valueX": 22,
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "None%",
            "None hours"
          ]
        },
        {
          "active": false,
          "title": "Case",
          "subTitle": null,
          "description": null,
          "note": "\n The time between the patient entering and the patient leaving \n the operating room.\n ",
          "valueX": 5,
          "valueY": null,
          "valueZ": null,
          "toolTip": [
            "None%",
            "None hours"
          ]
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": "Block Composition",
      "subTitle": "Total Block Hours",
      "body": null,
      "footer": null,
      "description": null,
      "toolTip": null,
      "total": "410.0",
      "unit": "hours",
      "url": null,
      "urlText": null,
      "xAxis": null,
      "yAxis": null
    },
    {
      "groupOrder": 3,
      "tileOrder": 2,
      "tileType": "Histogram",
      "dataPoints": [
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "-5",
          "valueY": "0",
          "valueZ": null,
          "toolTip": [
            "Range: [-10, -5)",
            "Frequency: 0"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "0",
          "valueY": "7",
          "valueZ": null,
          "toolTip": [
            "Range: [-5, 0)",
            "Frequency: 7"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "5",
          "valueY": "9",
          "valueZ": null,
          "toolTip": [
            "Range: [0, 5)",
            "Frequency: 9"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "10",
          "valueY": "8",
          "valueZ": null,
          "toolTip": [
            "Range: [5, 10)",
            "Frequency: 8"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "15",
          "valueY": "1",
          "valueZ": null,
          "toolTip": [
            "Range: [10, 15)",
            "Frequency: 1"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "20",
          "valueY": "0",
          "valueZ": null,
          "toolTip": [
            "Range: [15, 20)",
            "Frequency: 0"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "25",
          "valueY": "0",
          "valueZ": null,
          "toolTip": [
            "Range: [20, 25)",
            "Frequency: 0"
          ]
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "30",
          "valueY": "1",
          "valueZ": null,
          "toolTip": [
            "Range: [25, 30)",
            "Frequency: 1"
          ]
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": "Distribution of Block Start Gaps",
      "subTitle": "Deltas between block start and first case start",
      "body": null,
      "footer": null,
      "description": null,
      "toolTip": null,
      "total": null,
      "unit": null,
      "url": null,
      "urlText": null,
      "xAxis": "Block Start Gap (minutes)",
      "yAxis": "Frequency"
    },
    {
      "groupOrder": 4,
      "tileOrder": 1,
      "tileType": "InfographicParagraph",
      "dataPoints": [
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "11 days",
          "valueY": null,
          "valueZ": null,
          "toolTip": []
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": null,
      "subTitle": null,
      "body": null,
      "footer": null,
      "description": "Based on {0} with elective hours from your filter criteria",
      "toolTip": null,
      "total": null,
      "unit": null,
      "url": null,
      "urlText": null,
      "xAxis": null,
      "yAxis": null
    }
  ],
  "globalTiles": []
};

export const CASEANALYSIS = {
  "dashboardName": "caseAnalysis",
  "tiles": [
    {
      "groupOrder": 1,
      "tileOrder": 1,
      "tileType": "InfographicText",
      "dataPoints": [],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": "Total Cases",
      "subTitle": null,
      "body": null,
      "footer": null,
      "description": null,
      "toolTip": "Outlier turnovers are excluded from room setup and room clean-up calculations.",
      "total": "48",
      "unit": null,
      "url": null,
      "urlText": null,
      "xAxis": null,
      "yAxis": null
    },
    {
      "groupOrder": 2,
      "tileOrder": 1,
      "tileType": "Table",
      "dataPoints": [],
      "subReportData": [],
      "dataPointRows": [
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "APPLICATION, WOUND VAC"
            },
            {
              "key": "avgRoomSetup",
              "value": 60
            },
            {
              "key": "avgCase",
              "value": 96
            },
            {
              "key": "avgRoomCleanup",
              "value": 7
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "CHOLECYSTECTOMY, ROBOT-ASSISTED, LAPAROSCOPIC, USING DA VINCI XI"
            },
            {
              "key": "avgRoomSetup",
              "value": 35
            },
            {
              "key": "avgCase",
              "value": 147
            },
            {
              "key": "avgRoomCleanup",
              "value": 10
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "COLPOCLEISIS"
            },
            {
              "key": "avgRoomSetup",
              "value": 20
            },
            {
              "key": "avgCase",
              "value": 181
            },
            {
              "key": "avgRoomCleanup",
              "value": 8
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "CYSTECTOMY, ROBOT-ASSISTED, USING DA VINCI XI"
            },
            {
              "key": "avgRoomSetup",
              "value": 26
            },
            {
              "key": "avgCase",
              "value": 358
            },
            {
              "key": "avgRoomCleanup",
              "value": 6
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "CYSTOSCOPY"
            },
            {
              "key": "avgRoomSetup",
              "value": 36
            },
            {
              "key": "avgCase",
              "value": 205
            },
            {
              "key": "avgRoomCleanup",
              "value": 9
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "CYSTOSCOPY, WITH LASER LITHOTRIPSY, WITH CALCULUS REMOVAL"
            },
            {
              "key": "avgRoomSetup",
              "value": 22
            },
            {
              "key": "avgCase",
              "value": 190
            },
            {
              "key": "avgRoomCleanup",
              "value": 13
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "CYSTOSCOPY, WITH PERIURETHRAL BULKING AGENT INJECTION"
            },
            {
              "key": "avgRoomSetup",
              "value": 16
            },
            {
              "key": "avgCase",
              "value": 57
            },
            {
              "key": "avgRoomCleanup",
              "value": 5
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "CYSTOSCOPY, WITH TRANSURETHRAL VAPORIZATION OF PROSTATE USING BIPOLAR ELECTROCAUTERIZATION"
            },
            {
              "key": "avgRoomSetup",
              "value": null
            },
            {
              "key": "avgCase",
              "value": 80
            },
            {
              "key": "avgRoomCleanup",
              "value": null
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "CYSTOSCOPY,WITH URETERAL STENT INSERTION OR REMOVAL"
            },
            {
              "key": "avgRoomSetup",
              "value": 28
            },
            {
              "key": "avgCase",
              "value": 99
            },
            {
              "key": "avgRoomCleanup",
              "value": 9
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "EXCISION,ENDOMETRIOSIS,ROBOT-ASSISTED,USING DA VINCI XI"
            },
            {
              "key": "avgRoomSetup",
              "value": 37
            },
            {
              "key": "avgCase",
              "value": 147
            },
            {
              "key": "avgRoomCleanup",
              "value": 5
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "EXCISION, LESION"
            },
            {
              "key": "avgRoomSetup",
              "value": 39
            },
            {
              "key": "avgCase",
              "value": 39
            },
            {
              "key": "avgRoomCleanup",
              "value": 8
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "FLEXIBLE BRONCHOSCOPY"
            },
            {
              "key": "avgRoomSetup",
              "value": 22
            },
            {
              "key": "avgCase",
              "value": 260
            },
            {
              "key": "avgRoomCleanup",
              "value": 17
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "FULGURATION, BLADDER, WITH CYSTOSCOPY"
            },
            {
              "key": "avgRoomSetup",
              "value": 36
            },
            {
              "key": "avgCase",
              "value": 66
            },
            {
              "key": "avgRoomCleanup",
              "value": 7
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "HEPATECTOMY"
            },
            {
              "key": "avgRoomSetup",
              "value": null
            },
            {
              "key": "avgCase",
              "value": 357
            },
            {
              "key": "avgRoomCleanup",
              "value": null
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "HYSTERECTOMY, ROBOT-ASSISTED, LAPAROSCOPIC, USING DA VINCI XI, WITH BILATERAL SALPINGO-OOPHORECTOMY"
            },
            {
              "key": "avgRoomSetup",
              "value": 32
            },
            {
              "key": "avgCase",
              "value": 248
            },
            {
              "key": "avgRoomCleanup",
              "value": 7
            },
            {
              "key": "totalCases",
              "value": 2
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "INSERTION, STENT, URETER, CYSTOSCOPIC"
            },
            {
              "key": "avgRoomSetup",
              "value": 15
            },
            {
              "key": "avgCase",
              "value": 42
            },
            {
              "key": "avgRoomCleanup",
              "value": 18
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "IRRIGATION AND DEBRIDEMENT, ABSCESS, PERINEUM"
            },
            {
              "key": "avgRoomSetup",
              "value": 38
            },
            {
              "key": "avgCase",
              "value": 100
            },
            {
              "key": "avgRoomCleanup",
              "value": 4
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "LAPAROSCOPY, DIAGNOSTIC"
            },
            {
              "key": "avgRoomSetup",
              "value": 35
            },
            {
              "key": "avgCase",
              "value": 99
            },
            {
              "key": "avgRoomCleanup",
              "value": 15
            },
            {
              "key": "totalCases",
              "value": 2
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "LYMPHADENECTOMY, INGUINAL, ILIAC, OR BOTH"
            },
            {
              "key": "avgRoomSetup",
              "value": 34
            },
            {
              "key": "avgCase",
              "value": 107
            },
            {
              "key": "avgRoomCleanup",
              "value": 6
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "LYMPHADENECTOMY, RETROPERITONEUM, ROBOT-ASSISTED, USING DA VINCI XI"
            },
            {
              "key": "avgRoomSetup",
              "value": 26
            },
            {
              "key": "avgCase",
              "value": 12
            },
            {
              "key": "avgRoomCleanup",
              "value": 9
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "NEPHRECTOMY, PARTIAL, ROBOT-ASSISTED"
            },
            {
              "key": "avgRoomSetup",
              "value": 43
            },
            {
              "key": "avgCase",
              "value": 270
            },
            {
              "key": "avgRoomCleanup",
              "value": 8
            },
            {
              "key": "totalCases",
              "value": 3
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "NEPHRECTOMY, ROBOT-ASSISTED"
            },
            {
              "key": "avgRoomSetup",
              "value": 22
            },
            {
              "key": "avgCase",
              "value": 193
            },
            {
              "key": "avgRoomCleanup",
              "value": 8
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "NOT PROVIDED"
            },
            {
              "key": "avgRoomSetup",
              "value": 52
            },
            {
              "key": "avgCase",
              "value": 242
            },
            {
              "key": "avgRoomCleanup",
              "value": 7
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "PLICATION,DIAPHRAGM,ROBOT-ASSISTED,USING DA VINCI XI"
            },
            {
              "key": "avgRoomSetup",
              "value": null
            },
            {
              "key": "avgCase",
              "value": 363
            },
            {
              "key": "avgRoomCleanup",
              "value": null
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "PROSTATECTOMY, ROBOT-ASSISTED"
            },
            {
              "key": "avgRoomSetup",
              "value": 25
            },
            {
              "key": "avgCase",
              "value": 185
            },
            {
              "key": "avgRoomCleanup",
              "value": 6
            },
            {
              "key": "totalCases",
              "value": 9
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "PROSTATECTOMY, ROBOT-ASSISTED, USING DA VINCI XI"
            },
            {
              "key": "avgRoomSetup",
              "value": 28
            },
            {
              "key": "avgCase",
              "value": 179
            },
            {
              "key": "avgRoomCleanup",
              "value": 4
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "PROSTATECTOMY, SIMPLE, ROBOT-ASSISTED"
            },
            {
              "key": "avgRoomSetup",
              "value": 28
            },
            {
              "key": "avgCase",
              "value": 199
            },
            {
              "key": "avgRoomCleanup",
              "value": 5
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "PROSTATECTOMY, SIMPLE, ROBOT-ASSISTED, USING DA VINCI XI"
            },
            {
              "key": "avgRoomSetup",
              "value": 29
            },
            {
              "key": "avgCase",
              "value": 229
            },
            {
              "key": "avgRoomCleanup",
              "value": 9
            },
            {
              "key": "totalCases",
              "value": 3
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "REMOVAL, PUBOVAGINAL SLING"
            },
            {
              "key": "avgRoomSetup",
              "value": 17
            },
            {
              "key": "avgCase",
              "value": 88
            },
            {
              "key": "avgRoomCleanup",
              "value": 7
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "REPAIR,HERNIA,HIATAL,ROBOT-ASSISTED,WITH NISSEN FUNDOPLICATION,USING DA VINCI XI"
            },
            {
              "key": "avgRoomSetup",
              "value": 38
            },
            {
              "key": "avgCase",
              "value": 219
            },
            {
              "key": "avgRoomCleanup",
              "value": 10
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "SALPINGO-OOPHORECTOMY, ROBOT-ASSISTED, USING DA VINCI XI"
            },
            {
              "key": "avgRoomSetup",
              "value": 23
            },
            {
              "key": "avgCase",
              "value": 269
            },
            {
              "key": "avgRoomCleanup",
              "value": 13
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "XI ROBOTIC ASSISTED APR/LAR/SIGMOIDECTOMY"
            },
            {
              "key": "avgRoomSetup",
              "value": 40
            },
            {
              "key": "avgCase",
              "value": 352
            },
            {
              "key": "avgRoomCleanup",
              "value": 12
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "XI ROBOTIC INGUINAL HERNIA"
            },
            {
              "key": "avgRoomSetup",
              "value": 30
            },
            {
              "key": "avgCase",
              "value": 229
            },
            {
              "key": "avgRoomCleanup",
              "value": 6
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        },
        {
          "columns": [
            {
              "key": "procedureName",
              "value": "XI ROBOTIC VENTRAL HERNIA"
            },
            {
              "key": "avgRoomSetup",
              "value": 46
            },
            {
              "key": "avgCase",
              "value": 232
            },
            {
              "key": "avgRoomCleanup",
              "value": 6
            },
            {
              "key": "totalCases",
              "value": 1
            }
          ]
        }
      ],
      "name": null,
      "title": null,
      "subTitle": null,
      "body": null,
      "footer": null,
      "description": null,
      "toolTip": null,
      "total": null,
      "unit": null,
      "url": null,
      "urlText": null,
      "xAxis": null,
      "yAxis": null
    },
    {
      "groupOrder": 3,
      "tileOrder": 1,
      "tileType": "InfographicParagraph",
      "dataPoints": [
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "11 days",
          "valueY": null,
          "valueZ": null,
          "toolTip": []
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "name": null,
      "title": null,
      "subTitle": null,
      "body": null,
      "footer": null,
      "description": "Based on {0} with elective hours from your filter criteria",
      "toolTip": null,
      "total": null,
      "unit": null,
      "url": null,
      "urlText": null,
      "xAxis": null,
      "yAxis": null
    }
  ],
  "globalTiles": []
};