const json = {"attendanceComment":null,"attendanceTypeId":0,"attendanceTypeDescription":null,"departmentDescription":null,"exportValue":null,"guidanceCounselor":null,"instructorExternalId":null,"meetingLink":null,"periodDescription":"FLEX [ 8:41-9:13am]","schoolId":0,"sisPeriodId":null,"studentExternalId":null,"studentFirstName":null,"studentLastName":null,"studentYearOfGraduation":null,"studentWasTardy":false,"dateAdjusted":"0001-01-01T00:00:00+00:00","updatedCourseName":null,"lastCommaFirst":", ","appointmentTypeId":0,"appointmentTypeDescription":null,"appointmentType":null,"courseDescription":null,"courseId":291100,"courseName":"Marwah-D167-Math","courseRoom":"D167","instructorDepartmentId":0,"instructorFirstName":null,"instructorId":0,"instructorLastName":null,"isLocked":false,"maxDateAdjusted":"0001-01-01T00:00:00+00:00","maxNumberStudents":0,"periodId":1,"scheduledById":0,"scheduleDate":"2022-10-07T00:00:00","scheduleId":0,"schedulerComment":null,"schedulerFirstName":null,"schedulerFirstLetterLastName":"","schedulerLastName":null,"studentId":0,"taughtByHomeroom":null,"userTypeId":0,"wasScheduledByStaffer":false}

const inter = ['export interface name {']

// will go through the json and create an interface based on the types in the json
for (let key in json) {
    const item: any = json[key]
    
    if(typeof item === 'string') {
        inter.push(`    ${key}: string | null`)
    } else if (item === null) {
        inter.push(`    ${key}: null`)
    } else {
        inter.push(`    ${key}: ${typeof item}`)
    }
}

inter.push('}')

console.log(inter.join('\n'));
