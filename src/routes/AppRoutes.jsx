import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public & Auth Pages
import { LandingPage } from '../pages/public/LandingPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage';
import { ProfilePage } from '../pages/public/ProfilePage';
import { NotificationsPage } from '../pages/public/NotificationsPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';

// Customer Pages
import { CustomerDashboard } from '../pages/customer/CustomerDashboard';
import { MyVehicles } from '../pages/customer/MyVehicles';
import { ProviderSearch } from '../pages/customer/ProviderSearch';
import { ProviderDetails } from '../pages/customer/ProviderDetails';
import { BookService } from '../pages/customer/BookService';
import { MyAppointments } from '../pages/customer/MyAppointments';
import { AppointmentDetails } from '../pages/customer/AppointmentDetails';
import { ServiceTracking } from '../pages/customer/ServiceTracking';
import { ServiceHistory } from '../pages/customer/ServiceHistory';
import { RemindersPage } from '../pages/customer/RemindersPage';

// Service Provider Pages
import { ProviderDashboard } from '../pages/provider/ProviderDashboard';
import { ServiceRequests } from '../pages/provider/ServiceRequests';
import { ProviderAppointments } from '../pages/provider/ProviderAppointments';
import { TechniciansManagement } from '../pages/provider/TechniciansManagement';
import { ActiveServices } from '../pages/provider/ActiveServices';
import { ProviderServiceRecords } from '../pages/provider/ProviderServiceRecords';
import { ProviderPartsRequests } from '../pages/provider/ProviderPartsRequests';
import { ProviderReports } from '../pages/provider/ProviderReports';

// Technician Pages
import { TechnicianDashboard } from '../pages/technician/TechnicianDashboard';
import { AssignedServices } from '../pages/technician/AssignedServices';
import { TechnicianServiceDetails } from '../pages/technician/TechnicianServiceDetails';
import { TechnicianPartsRequests } from '../pages/technician/TechnicianPartsRequests';
import { CompletedServices } from '../pages/technician/CompletedServices';

// Inventory Manager Pages
import { InventoryDashboard } from '../pages/inventory/InventoryDashboard';
import { SparePartsCatalog } from '../pages/inventory/SparePartsCatalog';
import { StockManagement } from '../pages/inventory/StockManagement';
import { InventoryPartsRequests } from '../pages/inventory/InventoryPartsRequests';
import { LowStockAlerts } from '../pages/inventory/LowStockAlerts';
import { SuppliersList } from '../pages/inventory/SuppliersList';
import { InventoryReports } from '../pages/inventory/InventoryReports';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { UserManagement } from '../pages/admin/UserManagement';
import { AdminVehicles } from '../pages/admin/AdminVehicles';
import { AdminAppointments } from '../pages/admin/AdminAppointments';
import { AdminServices } from '../pages/admin/AdminServices';
import { AdminInventory } from '../pages/admin/AdminInventory';
import { AdminReports } from '../pages/admin/AdminReports';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/staff-request" element={<Navigate to="/login" replace />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Customer Module Routes */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="vehicles" element={<MyVehicles />} />
        <Route path="providers" element={<ProviderSearch />} />
        <Route path="providers/:providerId" element={<ProviderDetails />} />
        <Route path="book" element={<BookService />} />
        <Route path="appointments" element={<MyAppointments />} />
        <Route path="appointments/:appointmentId" element={<AppointmentDetails />} />
        <Route path="tracking" element={<ServiceTracking />} />
        <Route path="history" element={<ServiceHistory />} />
        <Route path="reminders" element={<RemindersPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Service Provider Module Routes */}
      <Route
        path="/provider"
        element={
          <ProtectedRoute allowedRoles={['SERVICE_PROVIDER', 'ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/provider/dashboard" replace />} />
        <Route path="dashboard" element={<ProviderDashboard />} />
        <Route path="requests" element={<ServiceRequests />} />
        <Route path="appointments" element={<ProviderAppointments />} />
        <Route path="technicians" element={<TechniciansManagement />} />
        <Route path="active-services" element={<ActiveServices />} />
        <Route path="records" element={<ProviderServiceRecords />} />
        <Route path="parts-requests" element={<ProviderPartsRequests />} />
        <Route path="reports" element={<ProviderReports />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Technician Module Routes */}
      <Route
        path="/technician"
        element={
          <ProtectedRoute allowedRoles={['TECHNICIAN', 'ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/technician/dashboard" replace />} />
        <Route path="dashboard" element={<TechnicianDashboard />} />
        <Route path="assigned" element={<AssignedServices />} />
        <Route path="service/:appointmentId" element={<TechnicianServiceDetails />} />
        <Route path="request-parts" element={<AssignedServices />} />
        <Route path="requests" element={<TechnicianPartsRequests />} />
        <Route path="completed" element={<CompletedServices />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Inventory Manager Module Routes */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute allowedRoles={['INVENTORY_MANAGER', 'ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/inventory/dashboard" replace />} />
        <Route path="dashboard" element={<InventoryDashboard />} />
        <Route path="parts" element={<SparePartsCatalog />} />
        <Route path="stock" element={<StockManagement />} />
        <Route path="requests" element={<InventoryPartsRequests />} />
        <Route path="low-stock" element={<LowStockAlerts />} />
        <Route path="suppliers" element={<SuppliersList />} />
        <Route path="reports" element={<InventoryReports />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Admin Module Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="customers" element={<UserManagement initialRoleFilter="CUSTOMER" />} />
        <Route path="providers" element={<UserManagement initialRoleFilter="SERVICE_PROVIDER" />} />
        <Route path="technicians" element={<UserManagement initialRoleFilter="TECHNICIAN" />} />
        <Route path="inventory-managers" element={<UserManagement initialRoleFilter="INVENTORY_MANAGER" />} />
        <Route path="vehicles" element={<AdminVehicles />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Standalone Common Pages */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProfilePage />} />
      </Route>

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<NotificationsPage />} />
      </Route>

      {/* 404 Not Found Page */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
