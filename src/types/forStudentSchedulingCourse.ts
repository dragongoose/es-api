/**
 * A course with less information that viewScheduleCourse
 */
export interface forStudentSchedulingCourse {
    appointmentRequestCourseId: number
    appointmentTypeId: number
    blockedDateDetailId: number
    blockedDateId: number
    blockedReason: string | null
    courseNameOriginal: string | null
    currentCourseId: number
    isAdjusted: boolean
    isOpenForScheduling: boolean
    blockedType: number
    courseDescription: string | null
    courseRoom: string | null
    defaultAppointmentTypeId: number
    departmentName: string | null
    maxNumberStudents: number
    periodId: number
    preventStudentRequesting: boolean
    preventStudentSelfScheduling: boolean
    scheduleDate: string | null
    schoolId: number
    numberOfAppointments: number
    courseId: number
    courseName: string | null
    departmentId: number
    isActive: boolean
    isHomeroom: boolean
    meetingLink: string | null
    stafferId: number
    staffFirstName: string | null
    staffLastName: string | null
}