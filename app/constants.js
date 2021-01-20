export const idleTimeout = 1000 * 60 * 45; // in Milliseconds

export const EMM_DISTRACTION_TOOLTIP = 'Distraction Index consists of evidence-based audible and visual distractions such as conversation and machine alarms. The Distraction Index has a range between 0 and 100, with an average procedure having a Distraction Index of 30, and greater scores indicative of more distracting operating room environments.';
export const EMM_TECHNICAL_TOOLTIP = 'Performance Index consists of evidence-based components such as time based metrics, measures of manual dexterity and intraoperative adverse events. The Performance Index has a range between 0 and 100. An average procedure will have a Performance Index of 70, with higher scores indicative of better performance.'
export const EMM_ADVERSEEVENT_TOOLTIP = 'Adverse Event Rate is the number of intraoperative adverse events that occured per hour of surgical procedure.';

export const EFFICIENCY_DATA = {
    "dashboardName":"efficiency",
    "tiles":[
       {
          "groupOrder":1,
          "tileOrder":1,
          "tileType":"BarChart",
          "dataPoints":[
             {
                "title":null,
                "subTitle":null,
                "description":null,
                "valueX":"E018F3D4-4977-4F0A-8C39-15946927CCD8",
                "valueY":"74",
                "valueZ":null,
                "note":null,
                "active":false
             },
             {
                "title":null,
                "subTitle":null,
                "description":null,
                "valueX":"41DFABFF-FA26-4ABB-9AA0-3598C53513BE",
                "valueY":"95",
                "valueZ":null,
                "note":null,
                "active":false
             }
          ],
          "subReportData":[
             
          ],
          "dataPointRows":[
             
          ],
          "active":false,
          "name":null,
          "title":"First Case On-Time Start",
          "subTitle":null,
          "body":"",
          "footer":null,
          "description":null,
          "hospitalName":null,
          "facilityName":null,
          "departmentName":null,
          "roomName":null,
          "monthly":false,
          "procedureName":null,
          "specialtyName":null,
          "toolTip":"Percentage of days where the first case began at or before the scheduled start time.",
          "total":null,
          "unit":"%",
          "url":"/daysStarting",
          "urlText":"Learn more",
          "xAxis":null,
          "yAxis":"First Case On-Time Start (%)"
       },
       {
          "groupOrder":1,
          "tileOrder":2,
          "tileType":"BarChart",
          "dataPoints":[
             {
                "title":null,
                "subTitle":null,
                "description":null,
                "valueX":"E018F3D4-4977-4F0A-8C39-15946927CCD8",
                "valueY":"78",
                "valueZ":null,
                "note":null,
                "active":false
             },
             {
                "title":null,
                "subTitle":null,
                "description":null,
                "valueX":"41DFABFF-FA26-4ABB-9AA0-3598C53513BE",
                "valueY":"51",
                "valueZ":null,
                "note":null,
                "active":false
             }
          ],
          "subReportData":[
             
          ],
          "dataPointRows":[
             
          ],
          "active":false,
          "name":null,
          "title":"Turnover Time",
          "subTitle":null,
          "body":"",
          "footer":null,
          "description":null,
          "hospitalName":null,
          "facilityName":null,
          "departmentName":null,
          "roomName":null,
          "monthly":false,
          "procedureName":null,
          "specialtyName":null,
          "toolTip":"Average duration of non-outlier turnovers within block hours.",
          "total":null,
          "unit":" minutes",
          "url":"/turnoverTime",
          "urlText":"Learn more",
          "xAxis":null,
          "yAxis":"Average Turnover (minutes)"
       },
       {
          "groupOrder":2,
          "tileOrder":1,
          "tileType":"DETAILEDMULTILINECHART",
          "dataPoints":[
             
          ],
          "subReportData":[
             {
                "title":"E018F3D4-4977-4F0A-8C39-15946927CCD8",
                "subTitle":"Number of Cases: 49",
                "xAxis":"Last 6 months",
                "total":"59",
                "footer":"Utilization",
                "unit":"%",
                "dataPoints":[
                   {
                      "title":null,
                      "subTitle":null,
                      "description":null,
                      "valueX":"7",
                      "valueY":"NaN",
                      "valueZ":null,
                      "note":null,
                      "active":false
                   },
                   {
                      "title":null,
                      "subTitle":null,
                      "description":null,
                      "valueX":"8",
                      "valueY":"NaN",
                      "valueZ":null,
                      "note":null,
                      "active":false
                   },
                   {
                      "title":null,
                      "subTitle":null,
                      "description":null,
                      "valueX":"9",
                      "valueY":"NaN",
                      "valueZ":null,
                      "note":null,
                      "active":false
                   },
                   {
                      "title":null,
                      "subTitle":null,
                      "description":null,
                      "valueX":"10",
                      "valueY":"NaN",
                      "valueZ":null,
                      "note":null,
                      "active":false
                   },
                   {
                      "title":null,
                      "subTitle":null,
                      "description":null,
                      "valueX":"11",
                      "valueY":"NaN",
                      "valueZ":null,
                      "note":null,
                      "active":false
                   },
                   {
                      "title":null,
                      "subTitle":null,
                      "description":null,
                      "valueX":"12",
                      "valueY":"59",
                      "valueZ":null,
                      "note":null,
                      "active":false
                   }
                ]
             },
             {
                "title":"41DFABFF-FA26-4ABB-9AA0-3598C53513BE",
                "subTitle":"Number of Cases: 37",
                "xAxis":"Last 6 months",
                "total":"72",
                "footer":"Utilization",
                "unit":"%",
                "dataPoints":[
                   {
                      "title":null,
                      "subTitle":null,
                      "description":null,
                      "valueX":"7",
                      "valueY":"NaN",
                      "valueZ":null,
                      "note":null,
                      "active":false
                   },
                   {
                      "title":null,
                      "subTitle":null,
                      "description":null,
                      "valueX":"8",
                      "valueY":"NaN",
                      "valueZ":null,
                      "note":null,
                      "active":false
                   },
                   {
                      "title":null,
                      "subTitle":null,
                      "description":null,
                      "valueX":"9",
                      "valueY":"NaN",
                      "valueZ":null,
                      "note":null,
                      "active":false
                   },
                   {
                      "title":null,
                      "subTitle":null,
                      "description":null,
                      "valueX":"10",
                      "valueY":"NaN",
                      "valueZ":null,
                      "note":null,
                      "active":false
                   },
                   {
                      "title":null,
                      "subTitle":null,
                      "description":null,
                      "valueX":"11",
                      "valueY":"NaN",
                      "valueZ":null,
                      "note":null,
                      "active":false
                   },
                   {
                      "title":null,
                      "subTitle":null,
                      "description":null,
                      "valueX":"12",
                      "valueY":"72",
                      "valueZ":null,
                      "note":null,
                      "active":false
                   }
                ]
             }
          ],
          "dataPointRows":[
             
          ],
          "active":false,
          "name":null,
          "title":"OR Utilization",
          "subTitle":null,
          "body":"",
          "footer":null,
          "description":null,
          "hospitalName":null,
          "facilityName":null,
          "departmentName":null,
          "roomName":null,
          "monthly":false,
          "procedureName":null,
          "specialtyName":null,
          "toolTip":"Percentage of block hours used for case time (patient in to patient out).",
          "total":null,
          "unit":null,
          "url":"/orUtilization",
          "urlText":"Learn more",
          "xAxis":null,
          "yAxis":null
       },
       {
          "groupOrder":2,
          "tileOrder":2,
          "tileType":"DONUTCHART",
          "dataPoints":[
             {
                "title":"58ABBA4B-BEFC-4663-8373-6535EA6F1E5C",
                "subTitle":null,
                "description":null,
                "valueX":"86",
                "valueY":null,
                "valueZ":null,
                "note":null,
                "active":false
             }
          ],
          "subReportData":[
             
          ],
          "dataPointRows":[
             
          ],
          "active":false,
          "name":null,
          "title":"Case Analysis",
          "subTitle":"Cases Analyzed",
          "body":"",
          "footer":null,
          "description":null,
          "hospitalName":null,
          "facilityName":null,
          "departmentName":null,
          "roomName":null,
          "monthly":false,
          "procedureName":null,
          "specialtyName":null,
          "toolTip":null,
          "total":"86",
          "unit":null,
          "url":"/caseAnalysis",
          "urlText":"Learn more",
          "xAxis":null,
          "yAxis":null
       },
       {
          "groupOrder":3,
          "tileOrder":1,
          "tileType": "InfographicParagraph",
          "dataPoints":[
             {
                "active":false,
                "title":null,
                "subTitle":null,
                "description":null,
                "note":null,
                "valueX":"1 days",
                "valueY":null,
                "valueZ":null
             }
          ],
          "subReportData":[
             
          ],
          "dataPointRows":[
             
          ],
          "active":false,
          "name":null,
          "title":null,
          "subTitle":null,
          "body":"",
          "footer":null,
          "description":"Based on {0} with elective hours from your filter criteria",
          "hospitalName":null,
          "facilityName":null,
          "departmentName":null,
          "roomName":null,
          "monthly":false,
          "procedureName":null,
          "specialtyName":null,
          "toolTip":null,
          "total":null,
          "unit":null,
          "url":null,
          "urlText":null,
          "xAxis":null,
          "yAxis":null
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
        "active": false,
        "name": null,
        "title": "First Case On-Time Start",
        "subTitle": null,
        "body": null,
        "footer": null,
        "description": null,
        "hospitalName": null,
        "facilityName": null,
        "departmentName": null,
        "roomName": null,
        "monthly": false,
        "procedureName": null,
        "specialtyName": null,
        "toolTip": "Percentage of days where the first case began at or before the scheduled start time.",
        "total": "84",
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
            "valueX": "8.0",
            "valueY": "61",
            "valueZ": null
          },
          {
            "active": false,
            "title": null,
            "subTitle": null,
            "description": null,
            "note": null,
            "valueX": "9.0",
            "valueY": "67",
            "valueZ": null
          },
          {
            "active": false,
            "title": null,
            "subTitle": null,
            "description": null,
            "note": null,
            "valueX": "10.0",
            "valueY": "63",
            "valueZ": null
          },
          {
            "active": false,
            "title": null,
            "subTitle": null,
            "description": null,
            "note": null,
            "valueX": "11.0",
            "valueY": "70",
            "valueZ": null
          },
          {
            "active": false,
            "title": null,
            "subTitle": null,
            "description": null,
            "note": null,
            "valueX": "12.0",
            "valueY": "72",
            "valueZ": null
          },
          {
            "active": false,
            "title": null,
            "subTitle": null,
            "description": null,
            "note": null,
            "valueX": "1.0",
            "valueY": "66",
            "valueZ": null
          }
        ],
        "subReportData": [],
        "dataPointRows": [],
        "active": false,
        "name": null,
        "title": "First Case On-Time Start Trend",
        "subTitle": null,
        "body": null,
        "footer": null,
        "description": null,
        "hospitalName": null,
        "facilityName": null,
        "departmentName": null,
        "roomName": null,
        "monthly": false,
        "procedureName": null,
        "specialtyName": null,
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
          "note": '#6EDE95',
          "valueX": "-8",
          "valueY": "6",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": '#FF4D4D',
          "valueX": "-6",
          "valueY": "5",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": '#6EDE95',
          "valueX": "-4",
          "valueY": "16",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": '#6EDE95',
          "valueX": "-2",
          "valueY": "18",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": '#6EDE95',
          "valueX": "0",
          "valueY": "30",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": '#6EDE95',
          "valueX": "2",
          "valueY": "30",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": '#6EDE95',
          "valueX": "4",
          "valueY": "22",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": '#6EDE95',
          "valueX": "6",
          "valueY": "18",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": '#6EDE95',
          "valueX": "8",
          "valueY": "11",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": '#6EDE95',
          "valueX": "10",
          "valueY": "8",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": '#6EDE95',
          "valueX": "12",
          "valueY": "7",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": '#6EDE95',
          "valueX": "14",
          "valueY": "4",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": '#6EDE95',
          "valueX": "16",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": '#6EDE95',
          "valueX": "18",
          "valueY": "5",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": '#6EDE95',
          "valueX": "20",
          "valueY": "3",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "#FF4D4D",
          "valueX": "22",
          "valueY": "4",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "#FF4D4D",
          "valueX": "24",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "#FF4D4D",
          "valueX": "26",
          "valueY": "5",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "#FF4D4D",
          "valueX": "28",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "#FF4D4D",
          "valueX": "30",
          "valueY": "2",
          "valueZ": null
        }
      ],
        "subReportData": [],
        "dataPointRows": [],
        "active": false,
        "name": null,
        "title": "Distribution of First Case Delays",
        "subTitle": "Deltas between scheduled start and actual start",
        "body": null,
        "footer": null,
        "description": null,
        "hospitalName": null,
        "facilityName": null,
        "departmentName": null,
        "roomName": null,
        "monthly": false,
        "procedureName": null,
        "specialtyName": null,
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
            "valueX": "1 days",
            "valueY": null,
            "valueZ": null
          }
        ],
        "subReportData": [],
        "dataPointRows": [],
        "active": false,
        "name": null,
        "title": null,
        "subTitle": null,
        "body": null,
        "footer": null,
        "description": "Based on {0} with elective hours from your filter criteria",
        "hospitalName": null,
        "facilityName": null,
        "departmentName": null,
        "roomName": null,
        "monthly": false,
        "procedureName": null,
        "specialtyName": null,
        "toolTip": null,
        "total": null,
        "unit": null,
        "url": null,
        "urlText": null,
        "xAxis": null,
        "yAxis": null
      }
    ]
  };

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
      "active": false,
      "name": null,
      "title": "Total Cases",
      "subTitle": null,
      "body": "",
      "footer": null,
      "description": null,
      "hospitalName": null,
      "facilityName": null,
      "departmentName": null,
      "roomName": null,
      "monthly": false,
      "procedureName": null,
      "specialtyName": null,
      "toolTip": null,
      "total": "18",
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
          "valueY": "6",
          "valueZ": null
        },
        {
          "active": false,
          "title": "Setup",
          "subTitle": null,
          "description": null,
          "note": "The time between the first member of the surgical team commencing room preparation for a case, and the patient entering the operating room.",
          "valueX": "9.0",
          "valueY": "33",
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
          "valueY": "29",
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
          "valueY": "28",
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
          "valueY": "29",
          "valueZ": null
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "active": false,
      "name": null,
      "title": "Monthly Turnover Trend",
      "subTitle": null,
      "body": "",
      "footer": null,
      "description": "Avg.",
      "hospitalName": null,
      "facilityName": null,
      "departmentName": null,
      "roomName": null,
      "monthly": false,
      "procedureName": null,
      "specialtyName": null,
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
          "valueX": "29",
          "valueY": null,
          "valueZ": null
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "active": false,
      "name": null,
      "title": "Turnover Composition",
      "subTitle": "Avg. Turnover",
      "body": "",
      "footer": null,
      "description": "Avg. ",
      "hospitalName": null,
      "facilityName": null,
      "departmentName": null,
      "roomName": null,
      "monthly": false,
      "procedureName": null,
      "specialtyName": null,
      "toolTip": null,
      "total": "37",
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
          "valueX": "20",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "40",
          "valueY": "10",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "60",
          "valueY": "7",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "80",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "100",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "120",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "140",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "160",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "180",
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
          "valueY": "0",
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
          "valueX": "300",
          "valueY": "0",
          "valueZ": null
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "active": false,
      "name": null,
      "title": "Turnover Duration Distribution",
      "subTitle": null,
      "body": "",
      "footer": null,
      "description": null,
      "hospitalName": null,
      "facilityName": null,
      "departmentName": null,
      "roomName": null,
      "monthly": false,
      "procedureName": null,
      "specialtyName": null,
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
          "valueX": "11 days",
          "valueY": null,
          "valueZ": null
        }
      ],
      "subReportData": [],
      "dataPointRows": [],
      "active": false,
      "name": null,
      "title": null,
      "subTitle": null,
      "body": "",
      "footer": null,
      "description": "Based on {0} with elective hours from your filter criteria",
      "hospitalName": null,
      "facilityName": null,
      "departmentName": null,
      "roomName": null,
      "monthly": false,
      "procedureName": null,
      "specialtyName": null,
      "toolTip": null,
      "total": null,
      "unit": null,
      "url": null,
      "urlText": null,
      "xAxis": null,
      "yAxis": null
    }
  ]
}

export const TURNOVER2 = {
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
      "subTitle": null,
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

export const TURNOVER3 = {
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
      "tileType": "BarChart",
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
      "subTitle": null,
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
          "valueX": "5",
          "valueY": "0",
          "valueZ": null
        },
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
          "valueX": "15",
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
          "valueX": "25",
          "valueY": "13",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "30",
          "valueY": "30",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "35",
          "valueY": "44",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "40",
          "valueY": "36",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "45",
          "valueY": "29",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "50",
          "valueY": "12",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "55",
          "valueY": "10",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "60",
          "valueY": "11",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "65",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "70",
          "valueY": "12",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "75",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "80",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "85",
          "valueY": "4",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "90",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "95",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "100",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "105",
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
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "115",
          "valueY": "0",
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
          "valueX": "125",
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
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "135",
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
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "145",
          "valueY": "0",
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
          "valueX": "155",
          "valueY": "0",
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
          "valueX": "165",
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
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "175",
          "valueY": "0",
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
          "valueX": "185",
          "valueY": "0",
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
          "valueX": "195",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "200",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "205",
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
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "215",
          "valueY": "0",
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
          "valueX": "225",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "230",
          "valueY": "0",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": null,
          "valueX": "235",
          "valueY": "0",
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
          "valueX": "245",
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
          "valueX": "255",
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
          "valueX": "265",
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
          "valueX": "275",
          "valueY": "0",
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
          "valueX": "285",
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