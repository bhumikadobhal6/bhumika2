import React from 'react';
import { NewAssignmentClient } from '@/components/NewAssignmentClient';

export const metadata = {
  title: 'Create Assignment | AssignFlow',
  description: 'Add a new assignment, project, or exam deadline to AssignFlow.',
};

export default function NewAssignmentPage() {
  return <NewAssignmentClient />;
}

