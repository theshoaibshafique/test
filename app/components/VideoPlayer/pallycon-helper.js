/*eslint-disable*/
// export const licenseUri =
//   'https://license-global.pallycon.com/ri/licenseManager.do';
export const licenseUri =
  'https://license-global.pallycon.com/ri/licenseManager.do';

export const fairplayCertUri =
  'https://license-global.pallycon.com/ri/fpsKeyManager.do?siteId=7MA7';
// Detect the browser and set proper DRM type
export function checkDrmType() {
  var drmType;
  var agent = navigator.userAgent.toLowerCase(),
    name = navigator.appName,
    browser;
  console.log(agent, name);
  if (
    name === 'Microsoft Internet Explorer' ||
    agent.indexOf('trident') > -1 ||
    agent.indexOf('edge/') > -1
  ) {
    browser = 'ie';
    if (name === 'Microsoft Internet Explorer') {
      // IE old version (IE 10 or Lower)
      agent = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(agent);
      // browser += parseInt(agent[1]);
    } else if (agent.indexOf('edge/') > -1) {
      // Edge
      browser = 'Edge';
    }
    drmType = 'Widevine';
  } else if (agent.indexOf('safari') > -1) {
    // Chrome or Safari
    if (agent.indexOf('opr') > -1) {
      // Opera
      browser = 'Opera';
      drmType = 'Widevine';
    } else if (agent.indexOf('whale') > -1) {
      // Chrome
      browser = 'Whale';
      drmType = 'Widevine';
    } else if (agent.indexOf('edg/') > -1 || agent.indexOf('Edge/') > -1) {
      // Chrome
      browser = 'Edge';
      drmType = 'PlayReady';
    } else if (agent.indexOf('chrome') > -1) {
      // Chrome
      browser = 'Chrome';
      drmType = 'Widevine';
    } else {
      // Safari
      browser = 'Safari';
      drmType = 'FairPlay';
    }
  } else if (agent.indexOf('firefox') > -1) {
    // Firefox
    browser = 'firefox';
    drmType = 'Widevine';
  }
  console.log(browser, drmType);
  return drmType;
}
export function arrayToString(array) {
  var uint16array = new Uint16Array(array.buffer);
  return String.fromCharCode.apply(null, uint16array);
}
export function arrayBufferToString(buffer) {
  var arr = new Uint8Array(buffer);
  var str = String.fromCharCode.apply(String, arr);
  // if(/[\u0080-\uffff]/.test(str)){
  //     throw new Error("this string seems to contain (still encoded) multibytes");
  // }
  return str;
}
export function base64DecodeUint8Array(input) {
  var raw = window.atob(input);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));
  for (var i = 0; i < rawLength; i++) array[i] = raw.charCodeAt(i);
  return array;
}
export function base64EncodeUint8Array(input) {
  var keyStr =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var output = '';
  var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  var i = 0;
  while (i < input.length) {
    chr1 = input[i++];
    chr2 = i < input.length ? input[i++] : Number.NaN;
    chr3 = i < input.length ? input[i++] : Number.NaN;
    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;
    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output +=
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4);
  }
  return output;
}