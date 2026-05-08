import React from 'react';
import AssignmentsManager from '@/components/AssignmentsManager';
import { adminSidebarItems } from './adminSidebarItems';

const AdminAssignments = () => {
  return <AssignmentsManager role="admin" sidebarItems={adminSidebarItems} />;
};

export default AdminAssignments;
