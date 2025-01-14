import React from 'react'

import { Box } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { StudentAssessmentTable } from './components/StudentAssessmentTable'

function EducationStudentAssessment(): JSX.Element {
  useNamespaces('sp.education-student-assessment')

  return (
    <Box marginBottom={[6, 6, 10]}>
      <StudentAssessmentTable />
    </Box>
  )
}

export default EducationStudentAssessment
