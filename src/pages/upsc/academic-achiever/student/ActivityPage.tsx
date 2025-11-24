import { AdminLayout } from '../../../../layouts/AdminLayout';
// Import the ActivityResourceModal and adapt it for inline use
import { ActivityResourceModal } from '../../../../components/upsc/common/ActivityResourceModal';

export function ActivityPage() {
  return (
    <AdminLayout>
      <div className="h-full w-full">
        {/* Activity Resource Content displayed directly on the page */}
        <ActivityResourceModal />
      </div>
    </AdminLayout>
  );
}
