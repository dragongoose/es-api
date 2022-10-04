import fetch, { HeadersInit, Response } from 'node-fetch'
import { EsAPIError, daySchedule, generalInformation } from './types'

/**
 * Class which represents the enriching students api.
 */
export default class EsAPI {
  /* variables */
  token: string;
  baseUrl: string;
  headers: HeadersInit;

  constructor (token: string) {
    this.token = token
    this.baseUrl = "https://student.enrichingstudents.com/v1.0/"
    this.headers = {
      "Host": "student.enrichingstudents.com",
      "Connection": "keep-alive",
      "Accept": "application/json",
      "ESAuthToken": this.token,
      "Content-Type": "application/json;charget=UTF-8"
  }

    // attempt to authenticate
    const messageURL = 'https://student.enrichingstudents.com/v1.0/schoolmessage';
    fetch(messageURL, {
      headers: {
        ESAuthToken: token
      }
    }).then((res: Response) => {
      if(res.status !== 200) {
        throw new EsAPIError('Error authentication with enriching students. ' + res.statusText)
      }
    })
  }

  private checkStatus(res: Response) {
    if (res.status !== 200) {
      throw new EsAPIError('Error while contacting API ' + res.statusText)
    }
  }

  /**
   * Function that gets the pinned message
   * @returns string
   */
  public async schoolMessage(): Promise<string> {
    const schoolMessageURL = this.baseUrl + 'schoolmessage'

    const res = await fetch(schoolMessageURL, { headers: this.headers })
    this.checkStatus(res)
    const data = await res.json()
    
    if(data.length === 0) {
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
    this.checkStatus(res)
    const data = await res.json()
    const currentDay: daySchedule = data[0]
    return currentDay
  }

  /**
   * Returns general information about the school's setup for enriching students.
   */
  public async generalInformation() {
    const allURL = this.baseUrl + "period/all"

    const res = await fetch(allURL, { headers: this.headers})
    this.checkStatus(res)
    const data = await res.json()
    const info: generalInformation = data[0]
    return info
  }
}