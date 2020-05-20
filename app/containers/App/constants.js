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

export const USER_TOKEN = 'insight/App/USER_TOKEN';
export const USER_FACILITY = 'insight/App/USER_FACILITY';
export const FACILITY_ROOMS = 'insight/App/FACILITY_ROOMS';
export const SHOWEMMREPORT = 'insights - showing emm reports';
export const HIDEEMMREPORT = 'insights - hiding emm reports';
export const SETEMMREPORT = 'insights - set emm reports';
export const SPECIALTIES = 'insight/App/SPECIALTIES';
export const COMPLICATIONS = 'insight/App/COMPLICATIONS';
export const DEFAULT_LOCALE = 'en';