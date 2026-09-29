import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, createSecondaryAuthClient, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vsms_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved user', e);
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vsms_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('vsms_auth_user');
    }
  }, [currentUser]);

  // Listen to Supabase Auth State Changes on Mount
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && !profileError) {
            // Check if status is pending or rejected
            if (profile.status === 'PENDING' || profile.status === 'REJECTED' || profile.status === 'SUSPENDED') {
              await supabase.auth.signOut();
              setCurrentUser(null);
              localStorage.removeItem('vsms_auth_user');
            } else {
              setCurrentUser(profile);
            }
          } else {
            const fallbackProfile = {
              id: session.user.id,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
              email: session.user.email,
              role: session.user.user_metadata?.role || 'CUSTOMER',
              phone: session.user.user_metadata?.phone || '',
              city: session.user.user_metadata?.city || 'Coimbatore',
              status: 'ACTIVE'
            };
            setCurrentUser(fallbackProfile);
          }
        } else {
          setCurrentUser(null);
          localStorage.removeItem('vsms_auth_user');
        }
      } catch (err) {
        console.warn('Supabase auth session check notice:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            if (profile.status === 'PENDING' || profile.status === 'REJECTED' || profile.status === 'SUSPENDED') {
              await supabase.auth.signOut();
              setCurrentUser(null);
            } else {
              setCurrentUser(profile);
            }
          }
        } catch (e) {
          console.error('Error fetching profile on auth change:', e);
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        localStorage.removeItem('vsms_auth_user');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // 1. SUPABASE LOGIN FUNCTION (Handles Admin, Customer, and Approved Staff)
  const login = async (email, password) => {
    if (!isSupabaseConfigured) {
      return { success: false, message: 'Supabase authentication service is not configured.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data?.user) {
        // Query user profile to verify role and approval status
        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        let activeUser = profile;

        if (!activeUser) {
          // Construct profile from user metadata if table row is missing
          activeUser = {
            id: data.user.id,
            name: data.user.user_metadata?.name || email.split('@')[0],
            email: data.user.email,
            role: data.user.user_metadata?.role || 'CUSTOMER',
            phone: data.user.user_metadata?.phone || '',
            city: data.user.user_metadata?.city || 'Coimbatore',
            status: 'ACTIVE'
          };
          await supabase.from('profiles').upsert(activeUser);
        }

        // Check Account Status
        if (activeUser.status === 'PENDING') {
          await supabase.auth.signOut();
          setCurrentUser(null);
          return {
            success: false,
            message: 'Your staff registration request is currently PENDING review by the NexaCare Administrator. You will be granted access once approved.'
          };
        }

        if (activeUser.status === 'REJECTED') {
          await supabase.auth.signOut();
          setCurrentUser(null);
          return {
            success: false,
            message: 'Your staff registration request was reviewed and REJECTED by the administrator.'
          };
        }

        if (activeUser.status === 'SUSPENDED') {
          await supabase.auth.signOut();
          setCurrentUser(null);
          return {
            success: false,
            message: 'Your account has been suspended by the administrator. Please contact support.'
          };
        }

        setCurrentUser(activeUser);
        return { success: true, user: activeUser };
      }
    } catch (err) {
      console.error('Supabase login error:', err);
      return { success: false, message: err.message || 'Login failed. Please try again.' };
    }

    return { success: false, message: 'Authentication failed.' };
  };

  // 2. CUSTOMER SIGNUP FUNCTION (Direct Customer Registration with email verification)
  const signupCustomer = async ({ name, email, password, phone, address, city = 'Coimbatore' }) => {
    if (!isSupabaseConfigured) {
      return { success: false, message: 'Supabase is not configured.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            name,
            phone,
            role: 'CUSTOMER',
            address,
            city
          }
        }
      });

      if (error) {
        if (error.code === 'over_email_send_rate_limit' || error.message?.toLowerCase().includes('rate limit')) {
          return {
            success: false,
            message: 'Supabase email rate limit reached (Free tier allows 3 verification emails/hour). Please disable "Confirm email" in Supabase Dashboard -> Authentication -> Providers -> Email, or try again in a few minutes.'
          };
        }
        return { success: false, message: error.message };
      }

      if (data?.user) {
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`;

        const newProfile = {
          id: data.user.id,
          name,
          email: email.trim(),
          phone: phone || '',
          role: 'CUSTOMER',
          address: address || '',
          city: city || 'Coimbatore',
          avatar: avatarUrl,
          status: 'ACTIVE'
        };

        // Persist profile in database
        try {
          await supabase.from('profiles').upsert(newProfile);
        } catch (pErr) {
          console.warn('Profile upsert note:', pErr);
        }

        // Direct session authentication without email confirmation
        if (!data.session) {
          try {
            await supabase.auth.signInWithPassword({ email: email.trim(), password });
          } catch (sErr) {
            console.warn('Auto sign-in notice:', sErr);
          }
        }

        setCurrentUser(newProfile);

        return {
          success: true,
          user: newProfile
        };
      }
    } catch (err) {
      console.error('Customer signup error:', err);
      if (err.message?.includes('Failed to fetch') || err.name === 'AuthRetryableFetchError') {
        return {
          success: false,
          message: 'Unable to reach Supabase. This can happen if Supabase email rate limit was exceeded, or an adblocker/firewall is blocking the connection. Please disable "Confirm email" in your Supabase dashboard settings.'
        };
      }
      return { success: false, message: err.message || 'Registration failed.' };
    }

    return { success: false, message: 'Signup failed.' };
  };

  // 3. ADMIN-ONLY STAFF CREATION FUNCTION (Technician, Service Provider, Inventory Manager)
  // Flow: Admin enters details & temporary password -> Account created with ACTIVE status -> Staff logs in directly
  const createStaffAccountByAdmin = async ({
    name,
    email,
    password = 'Password@123',
    phone,
    role,
    specialty = '',
    experienceYears = 2,
    certifications = '',
    address = '',
    city = 'Coimbatore'
  }) => {
    if (!isSupabaseConfigured) {
      return { success: false, message: 'Supabase is not configured.' };
    }

    if (!['TECHNICIAN', 'SERVICE_PROVIDER', 'INVENTORY_MANAGER'].includes(role)) {
      return { success: false, message: 'Invalid staff role specified. Must be Technician, Service Provider, or Inventory Manager.' };
    }

    try {
      // 1. Create auth user in Supabase using isolated ephemeral client (does NOT overwrite logged-in Admin session)
      const tempClient = createSecondaryAuthClient();
      const { data, error } = await tempClient.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            name,
            phone,
            role,
            specialty,
            address,
            city
          }
        }
      });

      if (error) {
        if (error.code === 'over_email_send_rate_limit' || error.message?.toLowerCase().includes('rate limit')) {
          return {
            success: false,
            message: 'Supabase email rate limit reached. Please disable "Confirm email" in Supabase Dashboard -> Authentication -> Providers -> Email.'
          };
        }
        return { success: false, message: error.message };
      }

      const userId = data?.user?.id || `usr-${role.toLowerCase().slice(0, 4)}-${Date.now()}`;
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`;

      // 2. Persist Active Staff Profile
      const staffProfile = {
        id: userId,
        name,
        email: email.trim(),
        phone: phone || '',
        role,
        specialty: specialty || '',
        address: address || '',
        city: city || 'Coimbatore',
        avatar: avatarUrl,
        status: 'ACTIVE'
      };

      try {
        await supabase.from('profiles').upsert(staffProfile);
      } catch (pErr) {
        console.warn('Profile staff upsert notice:', pErr);
      }

      // 3. If Technician, register into technicians table for service job assignment
      if (role === 'TECHNICIAN') {
        try {
          await supabase.from('technicians').upsert({
            id: userId,
            user_id: userId,
            name,
            email: email.trim(),
            phone: phone || '',
            specialty: specialty || 'Diagnostics & Periodic Maintenance',
            experience_years: parseInt(experienceYears, 10) || 2,
            certifications: certifications || 'Automotive Technician Certified',
            rating: 5.0,
            active_jobs_count: 0,
            completed_jobs: 0,
            avatar: avatarUrl
          });
        } catch (tErr) {
          console.warn('Technician table upsert notice:', tErr);
        }
      }

      return {
        success: true,
        user: staffProfile,
        message: `Staff account for ${name} (${role.replace('_', ' ')}) created successfully! Initial password: ${password}`
      };
    } catch (err) {
      console.error('Staff creation error:', err);
      return { success: false, message: err.message || 'Failed to create staff account.' };
    }
  };

  // 4. LOGOUT FUNCTION
  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut notice:', err);
      }
    }
    setCurrentUser(null);
    localStorage.removeItem('vsms_auth_user');
  };

  // 5. UPDATE PROFILE FUNCTION
  const updateProfile = async (updatedFields) => {
    if (isSupabaseConfigured && currentUser?.id) {
      try {
        await supabase
          .from('profiles')
          .update(updatedFields)
          .eq('id', currentUser.id);
      } catch (err) {
        console.error('Failed to update Supabase profile:', err);
      }
    }

    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        role: currentUser?.role || null,
        loading,
        login,
        signupCustomer,
        createStaffAccountByAdmin,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
