import React, { useEffect } from 'react';
import moment from 'moment/moment';
import axios from 'axios';
const events = ['mouseover', 'click']
const classPrefix = 'log-';

export class Logger {
    constructor() {
        this.recentEvents = [];
        this.userToken = '';
        this.logInterval = 30000; // In ms
        // this.logInterval = 5000; // In ms
        this.sendLogs();
        this._addLog = this.addLog.bind(this);
    }
    get recent() {
        return this.recentEvents;
    }

    sendLogs() {
        // console.log("sent", this.recentEvents)
        const jsonBody = {
            time: moment(),
            metadata: {},
            logs: {
                payload: this.recentEvents
            }
        }
        if (this.recentEvents.length) {
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
            event: event,
            id: id
        }
        if (value) {
            if (Array.isArray(value)) {
                log.values = value;
            } else {
                log.description = value;
            }

        }
        const length = this.recentEvents.length;
        //If they updated the last value - and it wasnt a clear -> we just update the log
        if (event == 'onchange' && length && this.recentEvents[length - 1].id == id && value) {
            // console.log("updated log", log)
            this.recentEvents.splice(length - 1, 1, log)
            return;
        }
        console.log("added log", log)
        this.recentEvents.push(log)
    }

    addLog(e) {
        const { type, currentTarget } = e;
        if (currentTarget) {
            const { id } = currentTarget;
            // TODO: make less specific
            const emrCaseId = currentTarget.getAttribute("emrCaseId")
            const existingLog = this.recentEvents.findIndex((r) => r.id == id);

            //Dont log mouseOvers too much
            if (type == 'mouseover' && existingLog >= 0) {
                return;
            }
            const log = {
                time: moment(),
                event: type,
                id: id,
                emrCaseId: emrCaseId
            };
            console.log('logged', log)
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
        if (!url) {
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
        });
    }

}
