import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:pl-[280px]">
        <AdminHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 