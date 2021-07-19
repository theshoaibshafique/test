import React, { useEffect } from 'react';
import moment from 'moment-timezone';
import axios from 'axios';
import globalFunctions from '../../utils/global-functions';
const events = ['mouseover', 'click', 'scroll', 'input']
const reducedEvents = ['mouseover', 'onchange', 'input']
const classPrefix = 'log-';
const displayLogs = false;

export class Logger {
    constructor(userToken) {
        this.recentEvents = [];
        this.userToken = userToken;
        this.logInterval = 30000; // In ms
        if (!userToken) {
            console.log('no user token')
            return;
        }
        this._addLog = this.addLog.bind(this);
        this._exitLog = this.sendExitLogs.bind(this);
        this.exitLogs = [];
        //Add close window/refresh listener
        this.connectExitListener();
        this.sendLogs();
        this.initialLogs();
    }
    get recent() {
        return this.recentEvents;
    }

    initialLogs() {
        this.manualAddLog('session', 'window-dimensions', globalFunctions.getWindowDimensions());
        const handleResize = () => {
            this.manualAddLog('onchange', 'window-resize', globalFunctions.getWindowDimensions());
        }
        window.addEventListener('resize', handleResize)
    }

    /*
        Each page might maintain a list of logs to send upon close
    */
    connectExitListener() {
        window.removeEventListener("beforeunload", this._exitLog);
        window.addEventListener("beforeunload", this._exitLog);
    }


    sendExitLogs() {
        this.exitLogs.forEach((log) => {
            this.manualAddLog(...log);
        })
        displayLogs && console.log("with exit logs " + this.recentEvents);
        this.sendLogs();
        this.exitLogs = [];
    }

    sendLogs() {
        displayLogs && console.log("sent", this.recentEvents)
        const jsonBody = {
            time: moment(),
            metadata: {},
            logs: {
                payload: this.recentEvents
            }
        }
        if (this.recentEvents.length) {
            // console.log(this.recent)
            this.postLogs(process.env.LOGGER_API, 'post', this.userToken, process.env.LOGGER_APP_ID, jsonBody);
            this.recentEvents = [];
        }

        setTimeout(() => {
            this.sendLogs();
        }, this.logInterval);
    }

    manualAddLog(event, id, value) {
        const log = {
            time: moment(),
            localTime: moment().format(),
            event: event,
            id: id
        }
        if (value) {
            if (event == 'onchange') {
                log.values = value;
            }
            else {
                log.description = value;
            }

        }
        const length = this.recentEvents.length;
        //If they updated the last value - and it wasnt a clear -> we just update the log
        if (reducedEvents.includes(event) && length && this.recentEvents[length - 1].id == id && value) {
            displayLogs && console.log("updated log", log)
            this.recentEvents.splice(length - 1, 1, log)
            return;
        }
        displayLogs && console.log("added log", log)
        this.recentEvents.push(log)
    }

    addLog(e) {
        const { type, currentTarget } = e;
        if (currentTarget) {
            const { id, value } = currentTarget;
            const description = currentTarget.getAttribute("description")
            const existingLog = this.recentEvents.findIndex((r) => r.id == id && JSON.stringify(r.description) == description);

            const log = {
                time: moment(),
                localTime: moment().format(),
                event: type,
                id: id
            };
            if (description) {
                log.description = JSON.parse(description);
            }
            if (value) {
                log.values = value;
            }
            //Dont log mouseOvers too much

            if (reducedEvents.includes(type) && existingLog >= 0) {
                //If its the most recent event - we update it
                const length = this.recentEvents.length;
                if (length && this.recentEvents[length - 1].id == id && value) {
                    displayLogs && console.log('updated log', log)
                    this.recentEvents.splice(length - 1, 1, log)
                }
                return;
            }
            displayLogs && console.log('added log', log)
            this.recentEvents.push(log)
        }

    }

    connectListeners() {
        // console.log('connected');
        events.forEach(event => {
            document.querySelectorAll(`.${classPrefix}${event}`).forEach(item => {
                item.removeEventListener(event, this._addLog);
                item.addEventListener(event, this._addLog);
            });
        });
    }

    postLogs(url, fetchMethod, userToken, appId, fetchBodyJSON) {
        if (!url || !userToken) {
            console.log('No User Token provided')
            return;
        }
        return axios({
            method: fetchMethod,
            url: url,
            headers: {
                'Authorization': 'Bearer ' + userToken,
                'x-app-id': appId,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(fetchBodyJSON),
            mode: 'cors'
        }).catch(error => {
            console.error(error);

        });
    }

}
