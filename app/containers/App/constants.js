/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const LOAD_REPOS = 'boilerplate/App/LOAD_REPOS';
export const LOAD_REPOS_SUCCESS = 'boilerplate/App/LOAD_REPOS_SUCCESS';
export const LOAD_REPOS_ERROR = 'boilerplate/App/LOAD_REPOS_ERROR';
export const USER_TOKEN = 'insight/App/USER_TOKEN';
export const USER_FACILITY = 'insight/App/USER_FACILITY';
export const FACILITY_ROOMS = 'insight/App/FACILITY_ROOMS';
export const PROCEDURES = 'insight/App/PROCEDURES';
export const PUBLISHEDSURVEYS = 'insight/App/PUBLISHEDSURVEYS';
export const RECENTPUBLISHEDSURVEYS = 'insight/App/RECENTPUBLISHEDSURVEYS';
export const DEFAULT_LOCALE = 'en';