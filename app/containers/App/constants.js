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
export const USER_STATUS = 'insight/App/USER_STATUS';
export const USER_FACILITY = 'insight/App/USER_FACILITY';
export const FACILITY_ROOMS = 'insight/App/FACILITY_ROOMS';
export const SPECIALTIES = 'insight/App/SPECIALTIES';
export const COMPLICATIONS = 'insight/App/COMPLICATIONS';
export const OPERATING_ROOM = 'insight/App/OPERATING_ROOM';
export const USER_ROLES = 'insight/App/USER_ROLES';
export const LOGGER = 'insight/App/LOGGER';
export const AUTH_LOGIN = 'insight/App/AUTH_LOGIN';
export const PROFILE = 'insight/App/PROFILE';
export const FACILITY_DETAILS = 'insight/App/FACILITY_DETAILS';
export const CURRENT_PRODUCT = 'insight/App/PRODUCT';
export const TOGGLE_SNACKBAR = 'insight/App/SNACKBAR';
export const EXIT_SNACKBAR = 'insight/App/EXIT_SNACKBAR';
export const SHOWEMMREPORT = 'insights - showing emm reports';
export const HIDEEMMREPORT = 'insights - hiding emm reports';
export const SETEMMREPORT = 'insights - set emm reports';
export const EMM_SWITCH_TAB = 'insights - switch emm tab';
export const EMM_SWITCH_PHASE = 'insights - set emm phase'
export const EMM_SET_VIDEO_TIME = 'insights - update video time'
export const EMM_PUBLISH_ACCESS = 'insights - set emm publish access'
export const EMM_PRESENTER_DIALOG = 'insights - set emm presenter dialog'
export const EMM_PRESENTER_MODE = 'insights - set emm presenter mode'
export const DEFAULT_LOCALE = 'en';

export const CD_EXIT = 'insight/App/CD/EXIT'
export const CD_DETAILED_CASE = 'insight/App/CD/DetailedCase'
export const CD_CASES = 'insight/App/CD/CASES'
export const CD_OVERVIEW_DATA = 'insight/App/CD/OVERVIEW/DATA'
export const CD_OVERVIEW_TILE = 'insight/App/CD/OVERVIEW/TILE'
export const CD_SAVED_CASES = 'insight/App/CD/SAVEDCASES'
export const CD_RECENT_FLAGS = 'insight/App/CD/RECENTFLAGS'
export const CD_RECOMMENDATIONS = 'insight/App/CD/RECOMMENDATIONS'
export const CD_RECENT_SAVED = 'insight/App/CD/RECENTSAVED'
export const CD_FLAGGED_CLIP = 'insight/App/CD/FLAGGEDCLIP'
export const CD_FLAG_REPORT = 'insight/App/CD/FLAGREPORT'
export const CD_CLIP_NOTIFICATION_STATUS = 'insights - set Clip Notification Status';

export const UM_FILTERS = 'insight/App/UM/Filters'
export const UM_USERS = 'insight/App/UM/Users'
export const UM_ASSIGNABLE_ROLES = 'insight/App/UM/Assignable/roles'
export const UM_LOCATION = 'insight/App/UM/Location'
export const UM_EXIT = 'insight/App/UM/exit'

export const AM_FILTERS = 'insight/App/AM/Filters'
export const AM_CLIENTS = 'insight/App/AM/Clients'
export const AM_ASSIGNABLE_ROLES = 'insight/App/AM/Assignable/roles'
export const AM_EXIT = 'insight/App/AM/exit'
