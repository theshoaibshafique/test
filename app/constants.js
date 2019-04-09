

export const PACKAGE_STEPS_DISTRACTIONS = ['Home Dashboard', 'Distractions by Categories', 'Distractions by Procedure Type', 'Distractions by Operating Room']

export const PACKAGE_NAME = {
    DISTRACTIONS : {
        name: 'Distractions',
        link: 'distractions',
        subPackage: {
            BY_CATEGORY: {name: "By Category", link: 'distractions/category'},
            BY_PROCEDURE_TYPE: {name: "By Procedure Type", link: 'distractions/procedure'},
            BY_OPERATING_ROOM: {name: "By Operating Room", link: 'distractions/room'}
        }
    },
    CULTURE_SURVEY: {
        name: 'Culture survey',
        link: 'culture-survey',
        subPackage: {
            BY_DEMOGRAPHIC: {name: "By Demographic", link: 'culture-survey/demographic'},
            BY_QUESTION_RESULTS: {name: "By Question Results", link: 'culture-survey/question-results'},
        }
    },
    ROOM_TRAFFIC: {
        name: 'Room Traffic',
        link: 'room-traffic'
    }
}

export const ROLES = {
    INSIGHT : ['insight_role_1', 'insight_role_2', 'insight_role_3', 'insight_role_4'],
    SURVEY : ['survey_role_1', 'survey_role_2']
}