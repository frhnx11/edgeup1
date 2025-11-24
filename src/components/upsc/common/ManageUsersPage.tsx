import { useState } from 'react';
import { ManageUsersModal } from './ManageUsersModal';
import { CreateUserPage } from './CreateUserPage';
import { UploadBulkUsersPage } from './UploadBulkUsersPage';
import { ManageRolesPage } from './ManageRolesPage';
import { ManageBatchesPage } from './ManageBatchesPage';
import { ManageCoursesPage } from './ManageCoursesPage';

interface ManageUsersPageProps {
  onCancel?: () => void;
}

export function ManageUsersPage({ onCancel }: ManageUsersPageProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Show the selected component based on the clicked item
  if (selectedItem === 'Create User') {
    return <CreateUserPage onCancel={() => setSelectedItem(null)} />;
  }
  
  if (selectedItem === 'Upload Bulk Users') {
    return <UploadBulkUsersPage onCancel={() => setSelectedItem(null)} />;
  }
  
  if (selectedItem === 'Manage Roles') {
    return <ManageRolesPage onCancel={() => setSelectedItem(null)} />;
  }
  
  if (selectedItem === 'Manage Batches') {
    return <ManageBatchesPage onCancel={() => setSelectedItem(null)} />;
  }
  
  if (selectedItem === 'Manage Courses') {
    return <ManageCoursesPage onCancel={() => setSelectedItem(null)} />;
  }

  return (
    <div className="h-full w-full">
      {/* Manage Users Content displayed directly on the page */}
      <ManageUsersModal onSelectItem={setSelectedItem} />
    </div>
  );
}