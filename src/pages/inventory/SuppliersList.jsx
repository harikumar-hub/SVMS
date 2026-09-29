import React, { useState } from 'react';
import { Truck, Phone, Mail, MapPin, Search, Star, Package } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';

export const SuppliersList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const suppliers = [
    {
      id: 'sup-01',
      name: 'Castrol India Distributor',
      contactPerson: 'Ramesh Kumar',
      phone: '+91 98421 23456',
      email: 'orders@castrol-cbe.in',
      city: 'Peelamedu, Coimbatore',
      categories: ['Fluids & Lubricants', 'Synthetic Oils', 'Greases'],
      leadTime: '24-48 Hours',
      rating: 4.9
    },
    {
      id: 'sup-02',
      name: 'Brembo Brakes India Ltd.',
      contactPerson: 'Karthikeyan P',
      phone: '+91 98443 45678',
      email: 'sales@brembo-india.in',
      city: 'Peenya, Bengaluru',
      categories: ['Braking System', 'Ceramic Pads', 'Brake Rotors'],
      leadTime: '48 Hours',
      rating: 4.95
    },
    {
      id: 'sup-03',
      name: 'Bosch Automotive India',
      contactPerson: 'Suresh Babu',
      phone: '+91 98432 34567',
      email: 'dealer@bosch-india.in',
      city: 'Ambattur, Chennai',
      categories: ['Filters', 'Electrical', 'Spark Plugs', 'Sensors'],
      leadTime: '24 Hours',
      rating: 5.0
    },
    {
      id: 'sup-04',
      name: 'Exide & Amaron Batteries Hub',
      contactPerson: 'Vignesh Raj',
      phone: '+91 98454 56789',
      email: 'inquiries@exidehub.in',
      city: 'RS Puram, Coimbatore',
      categories: ['12V Batteries', 'Electrical', 'Inverters'],
      leadTime: '12-24 Hours',
      rating: 4.85
    },
    {
      id: 'sup-05',
      name: 'Lumax & Minda Auto Components',
      contactPerson: 'Praveen Kumar',
      phone: '+91 98465 67890',
      email: 'supply@minda-auto.in',
      city: 'Guindy, Chennai',
      categories: ['Air Filters', 'Cabin Filters', 'Lighting & Horns'],
      leadTime: '2 Days',
      rating: 4.8
    }
  ];

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      <PageHeader
        title="Automotive Parts Suppliers Directory"
        subtitle="Authorized OEM parts manufacturers, supply chain contracts, and delivery lead times"
        breadcrumbs={[{ label: 'Suppliers' }]}
      />

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: '#ffffff' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search suppliers by name, supplied category, or location..."
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filtered.map((sup) => (
          <div
            key={sup.id}
            className="card card-hover"
            style={{
              backgroundColor: '#ffffff',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Truck size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {sup.name}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Contact: {sup.contactPerson}
                    </span>
                  </div>
                </div>

                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Star size={14} fill="#d97706" /> {sup.rating}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={15} style={{ color: 'var(--text-muted)' }} />
                  <span>{sup.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={15} style={{ color: 'var(--text-muted)' }} />
                  <span>{sup.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={15} style={{ color: 'var(--text-muted)' }} />
                  <span>{sup.city} &bull; Lead Time: <strong>{sup.leadTime}</strong></span>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {sup.categories.map((cat, cIdx) => (
                  <span
                    key={cIdx}
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-default)'
                    }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
