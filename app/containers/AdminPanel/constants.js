export const LEARNMORE_HEADER = "How does user management work?";
export const LEARNMORE_DESC = "This panel is used to control which <facility> users are able to access the Insights Portal. It is also used to control what type of access each user will have to the various products within Insights."
export const LEARNMORE_INFO = {
    "Efficiency": {
        order: 0,
        content: {
            "Full Access": "Has access to view all <facility> analytics. Users with this role will also be able to update the <facility> product configurations, within the settings page.",
            "View Only": "Has access to view Efficiency analytics. Users with this role can be given access to all <facility> analytics, or can be restricted to specific rooms."
        }
    },
    "eM&M": {
        order: 1,
        content: {
            "Full Access": "Has access to view all <facility>’s Enhanced M&M reports. Users with this role will also be able to request new Enhanced M&M reports, and present reports without security enabled, which allows sharing via video conference tools.",
            "View Only": "Has access to view <facility>’s Enhanced M&M reports. Users with this role can be given access to all <facility>’s Enhanced M&M reports, or can be restricted to specific rooms."
        }
    },
    "Case Discovery": {
        order: 2,
        content: {
            "Full Access": "Has access to view all <facility> cases within Case Discovery. Users with this role will also be able to flag eligible cases, update what information is requested when a user flags a case, and present flag video clips without security enabled, which allows sharing via video conference tools.",
            "View Only": "Has access to view <facility> cases within Case Discovery. Users with this role can be given access to all <facility> cases, or can be restricted to specific rooms."
        }

    },
    "Surgical Safety Checklist": {
        order: 3,
        content: {
            "Full Access": "Has access to view all <facility> Surgical Safety Checklist analytics. Users with this role will also be able to update the <facility> product configurations, within the settings page.",
            "View Only": "Has access to view <facility> Surgical Safety Checklist analytics. Users with this role can be given access to all <facility> analytics, or can be restricted to specific rooms."
        }
    },
}

