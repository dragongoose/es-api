/**
 * Interface for the API response from function viewSchedule
 */
 export interface daySchedule {
    attendanceComment: null
    attendanceTypeId: number
    attendanceTypeDescription: null
    departmentDescription: null
    exportValue: null
    guidanceCounselor: null
    instructorExternalId: null
    meetingLink: null
    periodDescription: string | null
    schoolId: number
    sisPeriodId: null
    studentExternalId: null
    studentFirstName: null
    studentLastName: null
    studentYearOfGraduation: null
    studentWasTardy: boolean
    dateAdjusted: string | null
    updatedCourseName: null
    lastCommaFirst: string | null
    appointmentTypeId: number
    appointmentTypeDescription: null
    appointmentType: null
    courseDescription: null
    courseId: number
    courseName: string | null
    courseRoom: string | null
    instructorDepartmentId: number
    instructorFirstName: null
    instructorId: number
    instructorLastName: null
    isLocked: boolean
    maxDateAdjusted: string | null
    maxNumberStudents: number
    periodId: number
    scheduledById: number
    scheduleDate: string | null
    scheduleId: number
    schedulerComment: null
    schedulerFirstName: null
    schedulerFirstLetterLastName: string | null
    schedulerLastName: null
    studentId: number
    taughtByHomeroom: null
    userTypeId: number
    wasScheduledByStaffer: boolean
}