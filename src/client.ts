import fetch, { HeadersInit, Response } from 'node-fetch'
import { EventEmitter } from 'stream';
import { EsAPIError, course, generalInformation, validateCredentials, EsAPIOptions, scheduledData, forStudentSchedulingData, periodInformationData, selfSchedulingInfo } from './types'

/**
 * Class which represents the enriching students api.
 */
export class EsAPI {
  /* variables */
  token: string;
  private baseUrl: string;
  private headers: HeadersInit;
  userAgent: string;

  /**
   * Determines if the program is ready to precess requests
   */
  ready: boolean;
  status: EventEmitter;

  constructor(options: EsAPIOptions) {
    this.ready = false;
    this.status = new EventEmitter();
    this.userAgent = "User-Agent: Mozilla/5.0 (X11; CrOS x86_64 15054.98.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"

    let headers = {
      Host: "student.enrichingstudents.com",
      Connection: "keep-alive",
      Accept: "application/json",
      ESAuthToken: this.token,
      "User-Agent": this.userAgent,
      "Content-Type": "application/json;charset=UTF-8",
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
      throw new EsAPIError('Error while contacting API: ' + res.status + ' ' + res.statusText + ' Additional: ' + txt)
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
    if(!this.ready) throw new EsAPIError('Client not ready.');

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
  public async viewSchedule(date: string): Promise<course> {
    if(!this.ready) throw new EsAPIError('Client not ready.');

    const viewScheduleURL = this.baseUrl + 'appointment/viewschedule'
    const payload = {
      'startDate': date,
    }

    const res = await fetch(viewScheduleURL, { headers: this.headers, body: JSON.stringify(payload), method: 'post' })
    this.checkStatus(res, 'viewSchedule')
    const data = await res.json()
    const currentDay: course = data[0]
    return currentDay
  }

  /**
   * General information endpoint
   * @returns generalInformation
   */
  public async generalInformation(): Promise<generalInformation> {
    if(!this.ready) throw new EsAPIError('Client not ready.');

    const allURL = this.baseUrl + "period/all"

    const res = await fetch(allURL, { headers: this.headers })
    this.checkStatus(res, 'generalInformation')
    const data = await res.json()
    const info: generalInformation = data[0]
    return info
  }

  public async scheduleCourse(courseId: number, date: string, comment: string): Promise<scheduledData> {
    if(!this.ready) throw new EsAPIError('Client not ready.');

    const scheduleCourseUrl = this.baseUrl + "/appointment/save"

    let payload = {
      "courseID": courseId,
      "scheduleDate": date,
      'scheduleComment': comment || ''
    }

    let options = {
      method: 'post',
      body: JSON.stringify(payload),
      headers: this.headers,
    }
    const res = await fetch(scheduleCourseUrl, options)
    const data: scheduledData = await res.json()

    if (data.appointmentEditorResponse !== 1) {
      throw new EsAPIError(`Error while scheduling appointment (${data.appointmentEditorResponse}): ${data.errorMessages.join(', ')}`)
    }

    return data
  }

  /**
   * Checks if certain credentials are valid.
   * @param email Email for enriching students
   * @param pass Password for enriching students
   * @returns validateCredentials
   */
  private async validateCredentials(email: string, pass: string): Promise<validateCredentials> {
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

  /**
   * Not exactly sure what this does, but it's required to login.
   * @param token1 string
   * @param token2 string
   * @returns Promise<string>
   */
  private async viaTokens(token1: string, token2: string): Promise<string> {
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

  /**
   * get all courses that the student can schedule
   * @param periodId 
   * @param startDate 
   * @returns forStudentSchedulingData
   */
  public async forStudentScheduling(periodId: number, startDate: string): Promise<forStudentSchedulingData> {
    const reqURL = this.baseUrl + 'course/forstudentscheduling'

    const payload = {
      periodId,
      startDate
    }

    const res = await fetch(reqURL, { headers: this.headers, body: JSON.stringify(payload), method: 'POST'})
    this.checkStatus(res, 'forStudentScheduling')
    const json: forStudentSchedulingData = await res.json()
    return json
  }

  /**
   * Get information about each period you can schedule
   * @returns periodInformationData
   */
  public async periodInformation(): Promise<periodInformationData> {
    const reqUrl = this.baseUrl + "period/all"

    const res = await fetch(reqUrl, { headers: this.headers });
    this.checkStatus(res, 'periodInformation')
    const json: periodInformationData = await res.json()
    return json
  }

  public async selfSchedulingInfo(): Promise<selfSchedulingInfo> {
    const reqUrl = this.baseUrl + "student/setupforscheduling"

    const res = await fetch(reqUrl, { headers: this.headers })
    this.checkStatus(res, 'selfSchedulingInfo')
    const json: selfSchedulingInfo = await res.json()
    return json
  }
}

