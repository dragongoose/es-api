/**
 * Used in generalInformation function
 */

 export interface generalInformation {
    schoolUsesPrebooking: boolean
    isActive: boolean
    periodDescription: string | null
    periodStartTime: string | null
    periodEndTime: string | null
    periodStartTimeDisplay: string | null
    periodEndTimeDisplay: string | null
    periodId: number
    schoolId: number
    prebookMonday: boolean
    prebookTuesday: boolean
    prebookWednesday: boolean
    prebookThursday: boolean
    prebookFriday: boolean
    sisPeriodId: null
}