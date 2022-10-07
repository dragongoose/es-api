import fetch, { HeadersInit, Response } from 'node-fetch'
import { EventEmitter } from 'stream';
import { EsAPIError, daySchedule, generalInformation, validateCredentials, EsAPIOptions } from './types'

/**
 * Class which represents the enriching students api.
 */
export default class EsAPI {
  /* variables */
  token: string;
  baseUrl: string;
  headers: HeadersInit;

  /**
   * Determines if the program is ready to precess requests
   */
  ready: boolean;
  status: EventEmitter;

  constructor(options: EsAPIOptions) {
    this.ready = false;
    this.status = new EventEmitter();

    let headers = {
      Host: "student.enrichingstudents.com",
      Connection: "keep-alive",
      Accept: "application/json",
      ESAuthToken: this.token,
    }

    if (options.token) {
      this.token = options.token
      headers.ESAuthToken = options.token
      this.headers = headers
      this.testAuthorization()

      this.ready = true;
      this.status.emit('ready', this.ready)
    } else if (options.email && options.password) {
      const accData = this.validateCredentials(options.email, options.password)
  
      accData.then((data) => {
        if (!data.IsAuthorized) throw new EsAPIError("Invalid credentials!")
        this.token = data.token
        headers.ESAuthToken = data.token
        this.headers = headers

        this.testAuthorization()
        this.ready = true;
        this.status.emit('ready', this.ready)
      })
    }



    this.baseUrl = "https://student.enrichingstudents.com/v1.0/"
  }
  private checkStatus(res: Response, txt: string) {
    if (res.status !== 200) {
      throw new EsAPIError('Error while contacting API: ' + res.statusText + ' Additional: ' + txt)
    }
  }

  private testAuthorization() {
    // attempt to authenticate
    const messageURL = 'https://student.enrichingstudents.com/v1.0/schoolmessage';
    fetch(messageURL, {
      headers: {
        ESAuthToken: this.token
      }
    }).then((res: Response) => {
      if (res.status !== 200) {
        throw new EsAPIError('Error authentication with enriching students: ' + res.statusText)
      }
    })

    return true
  }

  /**
   * Function that gets the pinned message
   * @returns string
   */
  public async schoolMessage(): Promise<string> {
    if(!this.ready) return;

    const schoolMessageURL = this.baseUrl + 'schoolmessage'

    const res = await fetch(schoolMessageURL, { headers: this.headers })
    this.checkStatus(res, 'schoolMessage')
    const data = await res.json()

    if (data.length === 0) {
      return 'No messages'
    }

    return data[0]
  }

  /**
   * Function that fetches a class scheduled on one day
   */
  public async viewSchedule(date: string): Promise<daySchedule> {
    const viewScheduleURL = this.baseUrl + 'appointment/viewschedule'
    const payload = {
      'startDate': date,
    }
    const res = await fetch(viewScheduleURL, { headers: this.headers, body: JSON.stringify(payload), method: 'post' })
    this.checkStatus(res, 'viewSchedule')
    const data = await res.json()
    const currentDay: daySchedule = data[0]
    return currentDay
  }

  /**
   * Returns general information about the school's setup for enriching students.
   */
  public async generalInformation() {
    const allURL = this.baseUrl + "period/all"

    const res = await fetch(allURL, { headers: this.headers })
    this.checkStatus(res, 'generalInformation')
    const data = await res.json()
    const info: generalInformation = data[0]
    return info
  }

  public async scheduleCourse(courseId: number, date: string, comment: string = '') {
    const scheduleCourseUrl = this.baseUrl + "/appointment/save"

    let payload = {
      "courseID": courseId,
      "scheduleDate": date,
      'scheduleComment': comment
    }

    let options = {
      method: 'post',
      body: JSON.stringify(payload),
      headers: this.headers,
    }
    const res = await fetch(scheduleCourseUrl, options)
    const data = await res.json()

    if (data.appointmentEditorResponse !== 1) {
      throw new EsAPIError(`Error while scheduling appointment (${data.appointmentEditorResponse}): ${data.errorMessages.join(', ')}`)
    }

    return data
  }

  /**
   * Takes credentials and gets a token
   */

  public async validateCredentials(email: string, pass: string): Promise<validateCredentials> {
    const validateUrl = 'https://app.enrichingstudents.com/LoginApi/Validate'

    const payload = {
      parameters: {
        'EmailAddress': email,
        'Password': pass
      }
    }

    const headers = {
      "Host": "app.enrichingstudents.com",
      "Connection": "keep-alive",
      "Accept": "application/json",
      "Content-Type": "application/json;charget=UTF-8"
    }
    const res = await fetch(validateUrl, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify(payload)
    })
    this.checkStatus(res, 'validateCredentials')
    const json: validateCredentials = await res.json()
    json.token = await this.viaTokens(json.ViewModel.Token1, json.ViewModel.Token2)
    return json
  }

  public async viaTokens(token1: string, token2: string): Promise<string> {
    const reqURL = "https://student.enrichingstudents.com/v1.0/login/viatokens"

    const headers = {
      "Host": "student.enrichingstudents.com",
      "Connection": "keep-alive",
      "Accept": "application/json",
      "Content-Type": "application/json;charget=UTF-8"
    }

    const payload = { token1, token2 }
    const res = await fetch(reqURL, { headers, method: 'POST', body: JSON.stringify(payload) })
    this.checkStatus(res, 'viaTokens')
    const json = await res.json()
    return json.authToken
  }
}