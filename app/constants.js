export const idleTimeout = 1000 * 60 * 45; // in Milliseconds

export const EMM_DISTRACTION_TOOLTIP = 'Distraction Index consists of evidence-based audible and visual distractions such as conversation and machine alarms. The Distraction Index has a range between 0 and 100, with an average procedure having a Distraction Index of 30, and greater scores indicative of more distracting operating room environments.';
export const EMM_TECHNICAL_TOOLTIP = 'Performance Index consists of evidence-based components such as time based metrics, measures of manual dexterity and intraoperative adverse events. The Performance Index has a range between 0 and 100. An average procedure will have a Performance Index of 70, with higher scores indicative of better performance.'
export const EMM_ADVERSEEVENT_TOOLTIP = 'Adverse Event Rate is the number of intraoperative adverse events that occured per hour of surgical procedure.';

export const SSC_CONFIG = {
    "facilityId": "77c6f277-d2e7-4d37-ac68-bd8c9fb21b92",
    "facilityName": "Clements University Hospital",
    "abbreviation": "CUH",
    "startDate": "2020-08-15",
    "endDate": "2021-01-31",
    "complianceGoal": 80,
    "engagementGoal": 80,
    "qualityGoal": 80,
    "checklists": [
      {
        "checklistId": 2,
        "checklistName": "Standard",
        "phases": [
          {
            "phaseId": "dab64746-7a9e-4b5b-bfd4-1f7468d1e0c7",
            "phaseName": "Briefing",
            "isActive": true,
            "questions": [
              {
                "questionId": "6dd5eb0a-4ff1-4059-89c6-37b991388498",
                "questionName": "Allergies",
                "isActive": false
              },
              {
                "questionId": "15d58c95-8c77-458b-8330-e0b44bab7bf4",
                "questionName": "Antibiotic prophylaxis",
                "isActive": false
              },
              {
                "questionId": "b995ccae-cfc7-429a-bb6b-e4504f4a898f",
                "questionName": "ASA grade",
                "isActive": false
              },
              {
                "questionId": "7520dfdf-7eca-4e3b-8e36-16832a299e7f",
                "questionName": "Confirmation of equipment sterility",
                "isActive": false
              },
              {
                "questionId": "a356e060-46ec-4f50-8ac6-4088ca5a6cd4",
                "questionName": "DVT prophylaxis",
                "isActive": false
              },
              {
                "questionId": "a33dbe53-783d-4385-a812-a2aef3dec2ec",
                "questionName": "Essential/relevant imaging displayed",
                "isActive": false
              },
              {
                "questionId": "bbc18430-634f-44ec-b0b0-526228cc089f",
                "questionName": "Expected blood loss",
                "isActive": false
              },
              {
                "questionId": "a3eb6461-350f-4394-a48c-431c32abb45b",
                "questionName": "Foley",
                "isActive": false
              },
              {
                "questionId": "6d70e3c0-f582-4ae4-87c6-207f8e5cc1a7",
                "questionName": "Indication for procedure",
                "isActive": false
              },
              {
                "questionId": "69ac25d1-7dc0-42f4-818e-2671aa2a0dfc",
                "questionName": "Intravenous/Lines",
                "isActive": false
              },
              {
                "questionId": "915f5835-cced-45fc-8c78-2756bd6982a4",
                "questionName": "Nursing equipment check",
                "isActive": false
              },
              {
                "questionId": "b4734d8d-d742-475a-a879-ef0d0c109ba7",
                "questionName": "Other equipment/support required (Anesthesia)",
                "isActive": false
              },
              {
                "questionId": "9c3dd964-9889-419b-b79c-6e0292d26eef",
                "questionName": "Past medical history",
                "isActive": false
              },
              {
                "questionId": "7834f12c-7cd0-48bd-aca0-c83c98a59446",
                "questionName": "Patient ID",
                "isActive": false
              },
              {
                "questionId": "1a3dafef-3a31-4595-8cd4-5b67d0e6ac25",
                "questionName": "Patient positioning",
                "isActive": false
              },
              {
                "questionId": "888d7c40-33b3-4de3-a8ab-11d3501061f9",
                "questionName": "Patient-specific concerns (Anesthesia)",
                "isActive": false
              },
              {
                "questionId": "26ba2cb2-d015-4ebc-b3a3-c7fce6da166e",
                "questionName": "Patient warming",
                "isActive": false
              },
              {
                "questionId": "32260b5d-5b3e-40e1-97ca-1c47aaf6571a",
                "questionName": "Potential risks (Surgery)",
                "isActive": false
              },
              {
                "questionId": "449bfc11-5988-47f9-b3af-06443242027c",
                "questionName": "Procedure name",
                "isActive": false
              },
              {
                "questionId": "d3dbbe2a-194a-4cb8-afff-dfc9561c9584",
                "questionName": "Site",
                "isActive": false
              },
              {
                "questionId": "83f11c20-286f-4fb4-91d9-28bcbda186cb",
                "questionName": "Special equipment/investigations required (Surgery)",
                "isActive": false
              }
            ]
          },
          {
            "phaseId": "dce646bc-49f3-4ce0-a2dd-adb68f93b69b",
            "phaseName": "Debriefing",
            "isActive": true,
            "questions": [
              {
                "questionId": "fe718867-b78d-494b-ac68-5aa76066017d",
                "questionName": "Anesthesia concerns",
                "isActive": true
              },
              {
                "questionId": "32e5c0c1-4303-43b3-8540-3d9e071ac14e",
                "questionName": "Disposition",
                "isActive": true
              },
              {
                "questionId": "53470764-e693-427c-9733-8b5fbf66d562",
                "questionName": "Equipment problems",
                "isActive": true
              },
              {
                "questionId": "7b13c39f-9531-4839-81d0-a9c776a2c188",
                "questionName": "Estimated blood loss",
                "isActive": true
              },
              {
                "questionId": "ba004b21-86ea-4e65-b9ed-d28330359eb4",
                "questionName": "Indication for procedure",
                "isActive": true
              },
              {
                "questionId": "31720d25-85c6-4ebb-aab4-c2ef1ed27e3a",
                "questionName": "Instrument/sponge and needle count",
                "isActive": true
              },
              {
                "questionId": "228b5b7f-f300-42b5-8c66-e175253ebd37",
                "questionName": "Name of procedure",
                "isActive": true
              },
              {
                "questionId": "3d3fac2b-3b81-4c90-837b-82129c97ca66",
                "questionName": "Next of kin update",
                "isActive": true
              },
              {
                "questionId": "128e7ff0-a84a-46fe-a891-847592abf049",
                "questionName": "Number of specimens",
                "isActive": true
              },
              {
                "questionId": "930f8121-33ce-45fa-be58-10c6c938a901",
                "questionName": "Nursing concerns",
                "isActive": true
              },
              {
                "questionId": "8ac9bbdd-5e86-4321-84ed-de8ba2ad1d44",
                "questionName": "Specimen labelled",
                "isActive": true
              },
              {
                "questionId": "7f1e2d0b-5021-469e-ba74-b7b152f56e8c",
                "questionName": "Surgical concerns",
                "isActive": true
              },
              {
                "questionId": "e7b4145a-4ae6-42f7-a174-19e007f81535",
                "questionName": "Wound Classification",
                "isActive": true
              }
            ]
          },
          {
            "phaseId": "e54b387c-6b9b-42dd-a7f2-9602eeb61ced",
            "phaseName": "Timeout",
            "isActive": true,
            "questions": [
              {
                "questionId": "6dd5eb0a-4ff1-4059-89c6-37b991388498",
                "questionName": "Allergies",
                "isActive": true
              },
              {
                "questionId": "15d58c95-8c77-458b-8330-e0b44bab7bf4",
                "questionName": "Antibiotic prophylaxis",
                "isActive": true
              },
              {
                "questionId": "b995ccae-cfc7-429a-bb6b-e4504f4a898f",
                "questionName": "ASA grade",
                "isActive": true
              },
              {
                "questionId": "7520dfdf-7eca-4e3b-8e36-16832a299e7f",
                "questionName": "Confirmation of equipment sterility",
                "isActive": true
              },
              {
                "questionId": "a356e060-46ec-4f50-8ac6-4088ca5a6cd4",
                "questionName": "DVT prophylaxis",
                "isActive": true
              },
              {
                "questionId": "a33dbe53-783d-4385-a812-a2aef3dec2ec",
                "questionName": "Essential/relevant imaging displayed",
                "isActive": true
              },
              {
                "questionId": "bbc18430-634f-44ec-b0b0-526228cc089f",
                "questionName": "Expected blood loss",
                "isActive": true
              },
              {
                "questionId": "a3eb6461-350f-4394-a48c-431c32abb45b",
                "questionName": "Foley",
                "isActive": true
              },
              {
                "questionId": "6d70e3c0-f582-4ae4-87c6-207f8e5cc1a7",
                "questionName": "Indication for procedure",
                "isActive": true
              },
              {
                "questionId": "69ac25d1-7dc0-42f4-818e-2671aa2a0dfc",
                "questionName": "Intravenous/Lines",
                "isActive": true
              },
              {
                "questionId": "915f5835-cced-45fc-8c78-2756bd6982a4",
                "questionName": "Nursing equipment check",
                "isActive": true
              },
              {
                "questionId": "b4734d8d-d742-475a-a879-ef0d0c109ba7",
                "questionName": "Other equipment/support required (Anesthesia)",
                "isActive": true
              },
              {
                "questionId": "9c3dd964-9889-419b-b79c-6e0292d26eef",
                "questionName": "Past medical history",
                "isActive": true
              },
              {
                "questionId": "7834f12c-7cd0-48bd-aca0-c83c98a59446",
                "questionName": "Patient ID",
                "isActive": true
              },
              {
                "questionId": "1a3dafef-3a31-4595-8cd4-5b67d0e6ac25",
                "questionName": "Patient positioning",
                "isActive": true
              },
              {
                "questionId": "888d7c40-33b3-4de3-a8ab-11d3501061f9",
                "questionName": "Patient-specific concerns (Anesthesia)",
                "isActive": true
              },
              {
                "questionId": "26ba2cb2-d015-4ebc-b3a3-c7fce6da166e",
                "questionName": "Patient warming",
                "isActive": true
              },
              {
                "questionId": "32260b5d-5b3e-40e1-97ca-1c47aaf6571a",
                "questionName": "Potential risks (Surgery)",
                "isActive": true
              },
              {
                "questionId": "449bfc11-5988-47f9-b3af-06443242027c",
                "questionName": "Procedure name",
                "isActive": true
              },
              {
                "questionId": "d3dbbe2a-194a-4cb8-afff-dfc9561c9584",
                "questionName": "Site",
                "isActive": true
              },
              {
                "questionId": "83f11c20-286f-4fb4-91d9-28bcbda186cb",
                "questionName": "Special equipment/investigations required (Surgery)",
                "isActive": true
              }
            ]
          }
        ]
      }
    ]
  };