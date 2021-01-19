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
          "note": "Range: [-10, -8)\nFrequency: 6",
          "valueX": "<-8",
          "valueY": "6",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "Range: [-8, -6)\nFrequency: 5",
          "valueX": "<-6",
          "valueY": "5",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "Range: [-6, -4)\nFrequency: 16",
          "valueX": "<-4",
          "valueY": "16",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "Range: [-4, -2)\nFrequency: 18",
          "valueX": "<-2",
          "valueY": "18",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "Range: [-2, 0)\nFrequency: 30",
          "valueX": "<0",
          "valueY": "30",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "Range: [0, 2)\nFrequency: 30",
          "valueX": "<2",
          "valueY": "30",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "Range: [2, 4)\nFrequency: 22",
          "valueX": "<4",
          "valueY": "22",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "Range: [4, 6)\nFrequency: 18",
          "valueX": "<6",
          "valueY": "18",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "Range: [6, 8)\nFrequency: 11",
          "valueX": "<8",
          "valueY": "11",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "Range: [8, 10)\nFrequency: 8",
          "valueX": "<10",
          "valueY": "8",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "Range: [10, 12)\nFrequency: 7",
          "valueX": "<12",
          "valueY": "7",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "Range: [12, 14)\nFrequency: 4",
          "valueX": "<14",
          "valueY": "4",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "Range: [14, 16)\nFrequency: 1",
          "valueX": "<16",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "Range: [16, 18)\nFrequency: 5",
          "valueX": "<18",
          "valueY": "5",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "Range: [18, 20)\nFrequency: 3",
          "valueX": "<20",
          "valueY": "3",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "Range: [20, 22)\nFrequency: 4",
          "valueX": "<22",
          "valueY": "4",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "Range: [22, 24)\nFrequency: 1",
          "valueX": "<24",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "Range: [24, 26)\nFrequency: 5",
          "valueX": "<26",
          "valueY": "5",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "Range: [26, 28)\nFrequency: 1",
          "valueX": "<28",
          "valueY": "1",
          "valueZ": null
        },
        {
          "active": false,
          "title": null,
          "subTitle": null,
          "description": null,
          "note": "Range: [28, 30)\nFrequency: 2",
          "valueX": "<30",
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