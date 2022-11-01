import {forStudentSchedulingCourse} from './'

export interface forStudentSchedulingData {
    courses: forStudentSchedulingCourse[],
    courseListStatusID: number,
    wasFoundInCache: boolean
}