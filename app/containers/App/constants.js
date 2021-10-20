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
export const SPECIALTIES = 'insight/App/SPECIALTIES';
export const COMPLICATIONS = 'insight/App/COMPLICATIONS';
export const OPERATING_ROOM = 'insight/App/OPERATING_ROOM';
export const USER_ROLES = 'insight/App/USER_ROLES';
export const LOGGER = 'insight/App/LOGGER';
export const AUTH_LOGIN = 'insight/App/AUTH_LOGIN';
export const PROFILE = 'insight/App/PROFILE';
export const CURRENT_PRODUCT = 'insight/App/PRODUCT';
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

export const CD_EXIT = 'insights - Exit Case Discovery'
export const CD_DETAILED_CASE = 'insights - set Detailed Case data'
export const CD_CASES = 'insights - set Case List'
export const CD_OVERVIEW_DATA = 'insights - set Overview Data'
export const CD_OVERVIEW_TILE = 'insights - set Overview Tile'
export const CD_SAVED_CASES = 'insights - set Saved cases'
export const CD_RECENT_FLAGS = 'insights - set Recent Flags cases'
export const CD_RECOMMENDATIONS = 'insights - set Recommendations'
export const CD_RECENT_SAVED = 'insights - set Recently saved cases'
export const CD_FLAGGED_CLIP = 'insights - set Flagged Case data'
export const CD_FLAG_REPORT = 'insights - set Flag Report'
export const CD_CLIP_NOTIFICATION_STATUS = 'insights - set Clip Notification Status';