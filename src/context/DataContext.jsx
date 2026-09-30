import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_USERS } from '../data/initialUsers';
import { INITIAL_VEHICLES } from '../data/initialVehicles';
import { INITIAL_SERVICE_PROVIDERS } from '../data/initialServiceProviders';
import { INITIAL_TECHNICIANS } from '../data/initialTechnicians';
import { INITIAL_SPARE_PARTS } from '../data/initialSpareParts';
import { INITIAL_APPOINTMENTS } from '../data/initialAppointments';
import { INITIAL_PARTS_REQUESTS } from '../data/initialPartsRequests';
import { INITIAL_REMINDERS } from '../data/initialReminders';
import { INITIAL_NOTIFICATIONS } from '../data/initialNotifications';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  // Helper to load or initialize fallback state
  const loadState = (key, initial) => {
    try {
      const saved = localStorage.getItem(`vsms_${key}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (key === 'providers') {
          if (!Array.isArray(parsed) || parsed.length !== 1 || parsed[0]?.name?.includes('Apex') || !parsed[0]?.name?.includes('NexaCare')) {
            localStorage.setItem('vsms_providers', JSON.stringify(initial));
            return initial;
          }
        }
        if (key === 'users') {
          if (Array.isArray(parsed) && (parsed.some(u => u.email?.includes('autocare.com') || u.name?.includes('Apex') || u.id === 'usr-admin-1' || u.email === 'hari@example.com' || u.id === 'usr-cust-1'))) {
            localStorage.removeItem('vsms_users');
            return initial;
          }
        }
        if (key === 'appointments') {
          if (Array.isArray(parsed) && parsed.some(a => a.providerName?.includes('Apex') || a.providerName?.includes('AutoCare') || a.providerName?.includes('Auto Care'))) {
            localStorage.setItem('vsms_appointments', JSON.stringify(initial));
            return initial;
          }
        }
        return parsed;
      }
    } catch (e) {
      console.error(`Error loading state for ${key}`, e);
    }
    return initial;
  };

  const [users, setUsers] = useState(() => loadState('users', INITIAL_USERS));
  const [vehicles, setVehicles] = useState(() => loadState('vehicles', INITIAL_VEHICLES));
  const [providers, setProviders] = useState(() => loadState('providers', INITIAL_SERVICE_PROVIDERS));
  const [technicians, setTechnicians] = useState(() => loadState('technicians', INITIAL_TECHNICIANS));
  const [spareParts, setSpareParts] = useState(() => loadState('spareParts', INITIAL_SPARE_PARTS));
  const [appointments, setAppointments] = useState(() => loadState('appointments', INITIAL_APPOINTMENTS));
  const [reminders, setReminders] = useState(() => {
    const loaded = loadState('reminders', INITIAL_REMINDERS);
    if (!loaded || !Array.isArray(loaded) || loaded.length === 0 || loaded.some((r) => r.userId === 'usr-cust-1')) {
      return INITIAL_REMINDERS;
    }
    return loaded;
  });
  const [staffRequests, setStaffRequests] = useState(() => loadState('staffRequests', []));
  const [serviceRecords, setServiceRecords] = useState([]);
  const [serviceProgressList, setServiceProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync to local storage for fast offline access
  useEffect(() => { localStorage.setItem('vsms_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('vsms_vehicles', JSON.stringify(vehicles)); }, [vehicles]);
  useEffect(() => { localStorage.setItem('vsms_providers', JSON.stringify(providers)); }, [providers]);
  useEffect(() => { localStorage.setItem('vsms_technicians', JSON.stringify(technicians)); }, [technicians]);
  useEffect(() => { localStorage.setItem('vsms_spareParts', JSON.stringify(spareParts)); }, [spareParts]);
  useEffect(() => { localStorage.setItem('vsms_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('vsms_partsRequests', JSON.stringify(partsRequests)); }, [partsRequests]);
  useEffect(() => { localStorage.setItem('vsms_reminders', JSON.stringify(reminders)); }, [reminders]);
  useEffect(() => { localStorage.setItem('vsms_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('vsms_staffRequests', JSON.stringify(staffRequests)); }, [staffRequests]);

  // Load live data from Supabase if connected
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const fetchAllSupabaseData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Profiles / Users
        const { data: profilesData } = await supabase.from('profiles').select('*');
        if (profilesData && profilesData.length > 0) {
          setUsers(profilesData);
        }

        // 2. Fetch Vehicles
        const { data: vehiclesData } = await supabase.from('vehicles').select('*');
        if (vehiclesData && vehiclesData.length > 0) {
          const mappedVehicles = vehiclesData.map(v => ({
            id: v.id,
            ownerId: v.owner_id,
            ownerName: v.owner_name,
            brand: v.brand,
            model: v.model,
            year: v.year,
            registrationNumber: v.registration_number,
            fuelType: v.fuel_type,
            mileage: v.mileage,
            lastServiceDate: v.last_service_date,
            insuranceExpiry: v.insurance_expiry,
            pucExpiry: v.puc_expiry,
            image: v.image,
            status: v.status || 'ACTIVE'
          }));
          setVehicles(mappedVehicles);
        }

        // 3. Fetch Technicians
        const { data: techData } = await supabase.from('technicians').select('*');
        if (techData && techData.length > 0) {
          const mappedTechs = techData.map(t => ({
            id: t.id,
            userId: t.user_id,
            name: t.name,
            email: t.email,
            phone: t.phone,
            specialty: t.specialty,
            experienceYears: t.experience_years,
            rating: t.rating,
            activeJobsCount: t.active_jobs_count,
            completedJobs: t.completed_jobs,
            certifications: t.certifications,
            avatar: t.avatar
          }));
          setTechnicians(mappedTechs);
        }

        // 4. Fetch Spare Parts
        const { data: partsData } = await supabase.from('spare_parts').select('*');
        if (partsData && partsData.length > 0) {
          const mappedParts = partsData.map(p => ({
            id: p.id,
            partNumber: p.part_number || p.partNumber,
            name: p.name || p.partName,
            partName: p.name || p.partName || p.part_name || 'Spare Part',
            category: p.category || 'General',
            brand: p.brand || 'OEM',
            compatibleModels: p.compatible_models || p.compatibleModels || 'All Models',
            unitPrice: p.unit_price !== undefined ? p.unit_price : p.unitPrice,
            availableQuantity: p.available_quantity !== undefined ? p.available_quantity : p.availableQuantity,
            minimumStock: p.minimum_stock !== undefined ? p.minimum_stock : p.minimumStock,
            location: p.location || 'Store Bay',
            supplier: p.supplier || 'NexaCare Direct',
            status: p.status || 'IN_STOCK',
            image: p.image || 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop&q=80'
          }));
          setSpareParts(mappedParts);
        }

        // 5. Fetch Appointments
        const { data: aptsData } = await supabase
          .from('appointments')
          .select('*')
          .order('created_at', { ascending: false });

        if (aptsData && aptsData.length > 0) {
          const mappedApts = aptsData.map(a => ({
            id: a.id,
            bookingCode: a.booking_code,
            customerId: a.customer_id,
            customerName: a.customer_name,
            customerPhone: a.customer_phone,
            vehicleId: a.vehicle_id,
            vehicleName: a.vehicle_name,
            registrationNumber: a.registration_number,
            providerId: a.provider_id || 'usr-prov-1',
            providerName: a.provider_name || 'NexaCare Service Center',
            technicianId: a.technician_id,
            technicianName: a.technician_name,
            serviceType: a.service_type,
            scheduledDate: a.scheduled_date,
            scheduledTime: a.scheduled_time,
            problemDescription: a.problem_description,
            additionalNotes: a.additional_notes,
            estimatedCost: a.estimated_cost,
            status: a.status,
            progressPercentage: a.progress_percentage,
            createdAt: a.created_at,
            updatedAt: a.updated_at
          }));
          setAppointments(mappedApts);
        }

        // 6. Fetch Parts Requests
        const { data: prData } = await supabase
          .from('parts_requests')
          .select('*')
          .order('requested_at', { ascending: false });

        if (prData && prData.length > 0) {
          const mappedPRs = prData.map(r => ({
            id: r.id,
            appointmentId: r.appointment_id,
            technicianId: r.technician_id,
            technicianName: r.technician_name,
            partId: r.part_id,
            partNumber: r.part_number,
            partName: r.part_name,
            requestedQuantity: r.requested_quantity,
            issuedQuantity: r.issued_quantity,
            status: r.status,
            reason: r.reason,
            requestedAt: r.requested_at,
            reviewedAt: r.reviewed_at,
            reviewedBy: r.reviewed_by,
            issuedAt: r.issued_at,
            rejectionReason: r.rejection_reason
          }));
          setPartsRequests(mappedPRs);
        }

        // 7. Fetch Reminders
        const { data: remData } = await supabase.from('reminders').select('*');
        if (remData && remData.length > 0) {
          const mappedReminders = remData.map(rm => ({
            id: rm.id,
            userId: rm.user_id,
            vehicleId: rm.vehicle_id,
            vehicleName: rm.vehicle_name,
            title: rm.title,
            reminderType: rm.reminder_type,
            dueDate: rm.due_date,
            status: rm.status,
            notes: rm.notes
          }));
          setReminders(mappedReminders);
        }

        // 8. Fetch Notifications
        const { data: notifsData } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (notifsData && notifsData.length > 0) {
          setNotifications(notifsData);
        }

        // 9. Fetch Service Records
        const { data: recData } = await supabase.from('service_records').select('*');
        if (recData) setServiceRecords(recData);

        // 10. Fetch Staff Registration Requests
        const { data: staffData } = await supabase.from('staff_requests').select('*').order('created_at', { ascending: false });
        if (staffData && staffData.length > 0) {
          setStaffRequests(staffData);
        }

      } catch (err) {
        console.warn('Supabase data hydration notice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSupabaseData();
  }, []);

  // Reset to default mock data
  const resetToMockData = () => {
    setUsers(INITIAL_USERS);
    setVehicles(INITIAL_VEHICLES);
    setProviders(INITIAL_SERVICE_PROVIDERS);
    setTechnicians(INITIAL_TECHNICIANS);
    setSpareParts(INITIAL_SPARE_PARTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setPartsRequests(INITIAL_PARTS_REQUESTS);
    setReminders(INITIAL_REMINDERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
  };

  // --- 1. VEHICLE ACTIONS (SUPABASE + LOCAL STATE) ---
  const addVehicle = async (vehicleData) => {
    const newVehicle = {
      ...vehicleData,
      id: vehicleData.id || `veh-${Date.now()}`,
      status: 'ACTIVE',
      image: vehicleData.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80'
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('vehicles').insert([{
          owner_id: vehicleData.ownerId,
          owner_name: vehicleData.ownerName,
          brand: vehicleData.brand,
          model: vehicleData.model,
          year: Number(vehicleData.year) || 2022,
          registration_number: vehicleData.registrationNumber,
          fuel_type: vehicleData.fuelType || 'Petrol',
          mileage: vehicleData.mileage || '15,000 km',
          last_service_date: vehicleData.lastServiceDate || null,
          insurance_expiry: vehicleData.insuranceExpiry || null,
          puc_expiry: vehicleData.pucExpiry || null,
          image: newVehicle.image,
          status: 'ACTIVE'
        }]).select().single();

        if (data && !error) {
          newVehicle.id = data.id;
        }
      } catch (err) {
        console.error('Supabase vehicle insert exception:', err);
      }
    }

    setVehicles(prev => [newVehicle, ...prev]);

    addNotification({
      title: 'Vehicle Added',
      message: `Successfully registered ${newVehicle.brand} ${newVehicle.model} (${newVehicle.registrationNumber})`,
      type: 'VEHICLE_ADDED',
      badge: 'SUCCESS'
    });

    return newVehicle;
  };

  const updateVehicle = async (id, updatedFields) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('vehicles').update({
          brand: updatedFields.brand,
          model: updatedFields.model,
          year: updatedFields.year ? Number(updatedFields.year) : undefined,
          registration_number: updatedFields.registrationNumber,
          fuel_type: updatedFields.fuelType,
          mileage: updatedFields.mileage,
          last_service_date: updatedFields.lastServiceDate,
          insurance_expiry: updatedFields.insuranceExpiry,
          puc_expiry: updatedFields.pucExpiry,
          image: updatedFields.image
        }).eq('id', id);
      } catch (err) {
        console.error('Supabase vehicle update exception:', err);
      }
    }

    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updatedFields } : v));
  };

  const deleteVehicle = async (id) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('vehicles').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase vehicle delete exception:', err);
      }
    }
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  // --- 2. APPOINTMENT / SERVICE ACTIONS ---
  const bookAppointment = async (appointmentData) => {
    const bookingCode = `APT-${new Date().getFullYear()}-${String(appointments.length + 1).padStart(3, '0')}`;
    const newApt = {
      ...appointmentData,
      id: appointmentData.id || bookingCode,
      bookingCode: bookingCode,
      providerId: 'usr-prov-1',
      providerName: 'NexaCare Service Center',
      status: 'PENDING',
      progressPercentage: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('appointments').insert([{
          booking_code: bookingCode,
          customer_id: appointmentData.customerId,
          customer_name: appointmentData.customerName,
          customer_phone: appointmentData.customerPhone,
          vehicle_id: appointmentData.vehicleId,
          vehicle_name: appointmentData.vehicleName,
          registration_number: appointmentData.registrationNumber,
          provider_id: 'usr-prov-1',
          provider_name: 'NexaCare Service Center',
          service_type: appointmentData.serviceType,
          scheduled_date: appointmentData.scheduledDate,
          scheduled_time: appointmentData.scheduledTime,
          problem_description: appointmentData.problemDescription,
          additional_notes: appointmentData.additionalNotes,
          estimated_cost: parseFloat(String(appointmentData.estimatedCost).replace(/[^0-9.]/g, '')) || 1500,
          status: 'PENDING',
          progress_percentage: 10
        }]).select().single();

        if (data && !error) {
          newApt.id = data.id;
        }
      } catch (err) {
        console.error('Supabase appointment insert exception:', err);
      }
    }

    setAppointments(prev => [newApt, ...prev]);

    // Add notification for both customer and provider
    addNotification({
      userId: newApt.customerId,
      role: 'CUSTOMER',
      title: 'Service Request Submitted',
      message: `Your booking for ${newApt.vehicleName} has been received at NexaCare Service Center.`,
      badge: 'PENDING',
      link: `/customer/appointments/${newApt.id}`
    });

    addNotification({
      role: 'SERVICE_PROVIDER',
      title: 'New Service Request',
      message: `New booking request for ${newApt.serviceType} from ${newApt.customerName}.`,
      badge: 'PENDING',
      link: '/provider/requests'
    });

    return newApt;
  };

  const updateAppointmentStatus = async (id, newStatus, additionalData = {}) => {
    let progress = 10;
    switch (newStatus) {
      case 'ACCEPTED': progress = 20; break;
      case 'TECHNICIAN_ASSIGNED': progress = 35; break;
      case 'VEHICLE_RECEIVED': progress = 45; break;
      case 'INSPECTION': progress = 55; break;
      case 'IN_PROGRESS': progress = 70; break;
      case 'PARTS_REQUIRED': progress = 60; break;
      case 'QUALITY_CHECK': progress = 85; break;
      case 'COMPLETED': progress = 100; break;
      case 'VEHICLE_READY': progress = 100; break;
      case 'REJECTED': case 'CANCELLED': progress = 0; break;
      default: break;
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('appointments').update({
          status: newStatus,
          progress_percentage: progress,
          technician_id: additionalData.technicianId || undefined,
          technician_name: additionalData.technicianName || undefined,
          updated_at: new Date().toISOString()
        }).eq('id', id);

        // Record stage progress history
        await supabase.from('service_progress').insert([{
          appointment_id: id,
          status: newStatus,
          notes: additionalData.inspectionNotes || `Status updated to ${newStatus.replace('_', ' ')}`,
          updated_by: additionalData.technicianName || 'NexaCare Staff'
        }]);

        // If completed, create or update service_record
        if (newStatus === 'COMPLETED' || newStatus === 'VEHICLE_READY') {
          const apt = appointments.find(a => a.id === id);
          if (apt) {
            await supabase.from('service_records').upsert({
              appointment_id: id,
              vehicle_id: apt.vehicleId,
              customer_id: apt.customerId,
              technician_id: apt.technicianId,
              service_type: apt.serviceType,
              inspection_checklist: additionalData.inspectionChecklist || apt.inspectionChecklist || {},
              inspection_notes: additionalData.inspectionNotes || apt.inspectionNotes || 'Completed multi-point check.',
              work_performed: `${apt.serviceType} performed according to NexaCare OEM standards.`,
              total_cost: parseFloat(String(apt.estimatedCost).replace(/[^0-9.]/g, '')) || 1800,
              completed_date: new Date().toISOString().split('T')[0],
              invoice_number: `INV-NX-${Date.now().toString().slice(-6)}`
            });
          }
        }
      } catch (err) {
        console.error('Supabase updateAppointmentStatus error:', err);
      }
    }

    setAppointments(prev => prev.map(apt => {
      if (apt.id === id) {
        const updated = {
          ...apt,
          ...additionalData,
          status: newStatus,
          progressPercentage: progress,
          updatedAt: new Date().toISOString()
        };

        addNotification({
          userId: apt.customerId,
          role: 'CUSTOMER',
          title: `Service Status Updated: ${newStatus.replace('_', ' ')}`,
          message: `Your appointment #${apt.id} (${apt.vehicleName}) is now ${newStatus.replace('_', ' ')}.`,
          badge: newStatus,
          link: `/customer/appointments/${apt.id}`
        });

        return updated;
      }
      return apt;
    }));
  };

  const assignTechnician = async (appointmentId, technicianId) => {
    const tech = technicians.find(t => t.id === technicianId);
    if (!tech) return;

    await updateAppointmentStatus(appointmentId, 'TECHNICIAN_ASSIGNED', {
      technicianId: tech.id,
      technicianName: tech.name
    });

    addNotification({
      userId: tech.userId || tech.id,
      role: 'TECHNICIAN',
      title: 'New Service Job Assigned',
      message: `You have been assigned to service appointment #${appointmentId}.`,
      badge: 'TECHNICIAN_ASSIGNED',
      link: `/technician/service/${appointmentId}`
    });
  };

  // --- 3. SPARE PARTS & INVENTORY ACTIONS ---
  const addPart = async (partData) => {
    const newPart = {
      ...partData,
      id: partData.id || `part-${String(spareParts.length + 1).padStart(3, '0')}`,
      status: Number(partData.availableQuantity) <= Number(partData.minimumStock)
        ? (Number(partData.availableQuantity) === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK')
        : 'IN_STOCK',
      image: partData.image || 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop&q=80'
    };

    if (isSupabaseConfigured) {
      try {
        const { data } = await supabase.from('spare_parts').insert([{
          part_number: partData.partNumber,
          name: partData.name,
          category: partData.category,
          brand: partData.brand,
          compatible_models: partData.compatibleModels,
          unit_price: Number(partData.unitPrice),
          available_quantity: Number(partData.availableQuantity),
          minimum_stock: Number(partData.minimumStock),
          location: partData.location || 'Shelf A-1',
          supplier: partData.supplier || 'NexaCare OEM Direct',
          status: newPart.status,
          image: newPart.image
        }]).select().single();

        if (data) newPart.id = data.id;
      } catch (err) {
        console.error('Supabase addPart exception:', err);
      }
    }

    setSpareParts(prev => [newPart, ...prev]);
    return newPart;
  };

  const updatePart = async (id, updatedFields) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('spare_parts').update({
          name: updatedFields.name,
          part_number: updatedFields.partNumber,
          category: updatedFields.category,
          brand: updatedFields.brand,
          compatible_models: updatedFields.compatibleModels,
          unit_price: updatedFields.unitPrice ? Number(updatedFields.unitPrice) : undefined,
          available_quantity: updatedFields.availableQuantity !== undefined ? Number(updatedFields.availableQuantity) : undefined,
          minimum_stock: updatedFields.minimumStock !== undefined ? Number(updatedFields.minimumStock) : undefined,
          location: updatedFields.location,
          supplier: updatedFields.supplier,
          status: updatedFields.status,
          image: updatedFields.image
        }).eq('id', id);
      } catch (err) {
        console.error('Supabase updatePart exception:', err);
      }
    }

    setSpareParts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updatedFields };
        const qty = Number(updated.availableQuantity);
        const min = Number(updated.minimumStock);
        updated.status = qty === 0 ? 'OUT_OF_STOCK' : (qty <= min ? 'LOW_STOCK' : 'IN_STOCK');
        return updated;
      }
      return p;
    }));
  };

  const adjustStock = async (id, changeAmount) => {
    const part = spareParts.find(p => p.id === id);
    if (!part) return;

    const newQty = Math.max(0, Number(part.availableQuantity) + Number(changeAmount));
    const min = Number(part.minimumStock);
    const newStatus = newQty === 0 ? 'OUT_OF_STOCK' : (newQty <= min ? 'LOW_STOCK' : 'IN_STOCK');

    if (isSupabaseConfigured) {
      try {
        await supabase.from('spare_parts').update({
          available_quantity: newQty,
          status: newStatus
        }).eq('id', id);
      } catch (err) {
        console.error('Supabase adjustStock error:', err);
      }
    }

    setSpareParts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          availableQuantity: newQty,
          status: newStatus
        };
      }
      return p;
    }));
  };

  const deletePart = async (id) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('spare_parts').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deletePart error:', err);
      }
    }
    setSpareParts(prev => prev.filter(p => p.id !== id));
  };

  // --- 4. PARTS REQUESTS ACTIONS ---
  const createPartsRequest = async (requestData) => {
    const newReq = {
      ...requestData,
      id: requestData.id || `req-pr-${String(partsRequests.length + 1).padStart(3, '0')}`,
      status: 'PENDING',
      requestedAt: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { data } = await supabase.from('parts_requests').insert([{
          appointment_id: requestData.appointmentId,
          technician_id: requestData.technicianId,
          technician_name: requestData.technicianName,
          part_id: requestData.partId,
          part_number: requestData.partNumber,
          part_name: requestData.partName,
          requested_quantity: Number(requestData.requestedQuantity) || 1,
          issued_quantity: 0,
          status: 'PENDING',
          reason: requestData.reason || 'Component worn out during inspection'
        }]).select().single();

        if (data) newReq.id = data.id;
      } catch (err) {
        console.error('Supabase createPartsRequest error:', err);
      }
    }

    setPartsRequests(prev => [newReq, ...prev]);

    // Notify Inventory Manager
    addNotification({
      role: 'INVENTORY_MANAGER',
      title: 'New Spare Part Requisition',
      message: `Technician ${newReq.technicianName} requested ${newReq.requestedQuantity}x ${newReq.partName}.`,
      badge: 'PARTS_REQUIRED',
      link: '/inventory/requests'
    });

    return newReq;
  };

  const approvePartsRequest = async (requestId, managerName = 'Karthik R') => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('parts_requests').update({
          status: 'APPROVED',
          reviewed_at: new Date().toISOString(),
          reviewed_by: managerName
        }).eq('id', requestId);
      } catch (err) {
        console.error('Supabase approvePartsRequest error:', err);
      }
    }

    setPartsRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        const updated = {
          ...r,
          status: 'APPROVED',
          reviewedAt: new Date().toISOString(),
          reviewedBy: managerName
        };

        addNotification({
          userId: r.technicianId,
          role: 'TECHNICIAN',
          title: 'Parts Request Approved',
          message: `Your request for ${r.partName} has been approved by ${managerName}. Ready for issue.`,
          badge: 'COMPLETED',
          link: '/technician/requests'
        });

        return updated;
      }
      return r;
    }));
  };

  const issueParts = async (requestId, managerName = 'Karthik R') => {
    const req = partsRequests.find(r => r.id === requestId);
    if (!req) return;

    // Deduct stock in spare_parts
    await adjustStock(req.partId, -Number(req.requestedQuantity));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('parts_requests').update({
          status: 'ISSUED',
          issued_quantity: Number(req.requestedQuantity),
          issued_at: new Date().toISOString(),
          reviewed_by: managerName
        }).eq('id', requestId);
      } catch (err) {
        console.error('Supabase issueParts error:', err);
      }
    }

    setPartsRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'ISSUED',
          issuedQuantity: Number(req.requestedQuantity),
          issuedAt: new Date().toISOString(),
          reviewedBy: managerName
        };
      }
      return r;
    }));

    addNotification({
      userId: req.technicianId,
      role: 'TECHNICIAN',
      title: 'Parts Issued from Store',
      message: `${req.requestedQuantity}x ${req.partName} issued to Job #${req.appointmentId}. Ready for installation.`,
      badge: 'COMPLETED',
      link: '/technician/requests'
    });
  };

  const rejectPartsRequest = async (requestId, reason = 'Out of stock or non-compatible') => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('parts_requests').update({
          status: 'REJECTED',
          rejection_reason: reason,
          reviewed_at: new Date().toISOString()
        }).eq('id', requestId);
      } catch (err) {
        console.error('Supabase rejectPartsRequest error:', err);
      }
    }

    setPartsRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'REJECTED',
          rejectionReason: reason,
          reviewedAt: new Date().toISOString()
        };
      }
      return r;
    }));
  };

  // --- 5. REMINDERS ACTIONS ---
  const addReminder = async (reminderData) => {
    const newReminder = {
      ...reminderData,
      id: reminderData.id || `rem-${Date.now()}`,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { data } = await supabase.from('reminders').insert([{
          user_id: reminderData.userId,
          vehicle_id: reminderData.vehicleId,
          vehicle_name: reminderData.vehicleName,
          title: reminderData.title,
          reminder_type: reminderData.reminderType || 'SERVICE',
          due_date: reminderData.dueDate,
          status: 'ACTIVE',
          notes: reminderData.notes
        }]).select().single();

        if (data) newReminder.id = data.id;
      } catch (err) {
        console.error('Supabase addReminder error:', err);
      }
    }

    setReminders(prev => [newReminder, ...prev]);
    return newReminder;
  };

  const updateReminder = async (id, updatedFields) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('reminders').update({
          title: updatedFields.title,
          due_date: updatedFields.dueDate,
          status: updatedFields.status,
          notes: updatedFields.notes
        }).eq('id', id);
      } catch (err) {
        console.error('Supabase updateReminder error:', err);
      }
    }
    setReminders(prev => prev.map(r => r.id === id ? { ...r, ...updatedFields } : r));
  };

  const deleteReminder = async (id) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('reminders').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deleteReminder error:', err);
      }
    }
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  // --- 6. NOTIFICATION ACTIONS ---
  const addNotification = async (notif) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notif
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('notifications').insert([{
          user_id: notif.userId || null,
          role: notif.role || null,
          title: notif.title,
          message: notif.message,
          badge: notif.badge || 'INFO',
          link: notif.link || null,
          read: false
        }]);
      } catch (err) {
        console.warn('Supabase notification insert notice:', err);
      }
    }

    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = async (id) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('notifications').update({ read: true }).eq('id', id);
      } catch (err) {
        console.error('Supabase markNotificationRead error:', err);
      }
    }
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = async (role) => {
    if (isSupabaseConfigured) {
      try {
        if (role) {
          await supabase.from('notifications').update({ read: true }).eq('role', role);
        } else {
          await supabase.from('notifications').update({ read: true });
        }
      } catch (err) {
        console.error('Supabase markAllNotificationsRead error:', err);
      }
    }
    setNotifications(prev => prev.map(n => (!role || n.role === role ? { ...n, read: true } : n)));
  };

  // --- 7. USER & STAFF ACTIONS ---
  const addUser = async (userData) => {
    const newUser = {
      ...userData,
      id: `usr-${userData.role.toLowerCase().slice(0, 4)}-${Date.now()}`,
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('profiles').insert([{
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          address: userData.address,
          city: userData.city || 'Coimbatore',
          specialty: userData.specialty,
          avatar: newUser.avatar,
          status: 'ACTIVE'
        }]);
      } catch (err) {
        console.error('Supabase addUser error:', err);
      }
    }

    setUsers(prev => [newUser, ...prev]);
    return newUser;
  };

  const updateUserStatus = async (id, newStatus) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('profiles').update({ status: newStatus }).eq('id', id);
      } catch (err) {
        console.error('Supabase updateUserStatus error:', err);
      }
    }
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
  };

  // --- 8. ADMIN DIRECT STAFF CREATION ---
  const createStaffMember = async (staffData) => {
    const userId = staffData.id || `usr-${staffData.role.toLowerCase().slice(0, 4)}-${Date.now()}`;
    const avatarUrl = staffData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(staffData.name)}&background=2563eb&color=fff`;

    const newStaff = {
      id: userId,
      name: staffData.name,
      email: staffData.email,
      phone: staffData.phone,
      role: staffData.role,
      specialty: staffData.specialty || '',
      address: staffData.address || '',
      city: staffData.city || 'Coimbatore',
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: avatarUrl
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('profiles').upsert(newStaff);

        if (staffData.role === 'TECHNICIAN') {
          const newTech = {
            id: userId,
            user_id: userId,
            name: staffData.name,
            email: staffData.email,
            phone: staffData.phone,
            specialty: staffData.specialty || 'General Diagnostics & Repair',
            experience_years: parseInt(staffData.experienceYears, 10) || 2,
            certifications: staffData.certifications || 'Automotive Technician Certified',
            rating: 5.0,
            active_jobs_count: 0,
            completed_jobs: 0,
            avatar: avatarUrl
          };

          await supabase.from('technicians').upsert(newTech);
          setTechnicians(prev => [newTech, ...prev]);
        }
      } catch (err) {
        console.error('Supabase createStaffMember error:', err);
      }
    }

    setUsers(prev => [newStaff, ...prev]);
    return newStaff;
  };

  return (
    <DataContext.Provider
      value={{
        users,
        vehicles,
        providers,
        technicians,
        spareParts,
        appointments,
        partsRequests,
        reminders,
        notifications,
        serviceRecords,
        serviceProgressList,
        loading,
        // Methods
        resetToMockData,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        bookAppointment,
        updateAppointmentStatus,
        assignTechnician,
        addPart,
        updatePart,
        deletePart,
        adjustStock,
        createPartsRequest,
        approvePartsRequest,
        rejectPartsRequest,
        issueParts,
        addReminder,
        updateReminder,
        deleteReminder,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        addUser,
        updateUserStatus,
        createStaffMember
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
