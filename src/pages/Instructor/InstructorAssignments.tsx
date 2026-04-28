import React from 'react';
import AssignmentsManager from '@/components/AssignmentsManager';
import { instructorSidebarItems } from './instructorSidebarItems';

const InstructorAssignments = () => {
  return <AssignmentsManager role="instructor" sidebarItems={instructorSidebarItems} />;
};

export default InstructorAssignments;
