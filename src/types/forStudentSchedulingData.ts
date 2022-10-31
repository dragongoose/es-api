import {course} from './'

export interface forStudentSchedulingData {
    courses: course[],
    courseListStatusID: number,
    wasFoundInCache: boolean
}