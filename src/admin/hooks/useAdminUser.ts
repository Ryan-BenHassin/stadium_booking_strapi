import { useState, useEffect } from 'react';
import axios from 'axios';

interface AdminUser {
  id: number;
  email: string;
  firstname: string;
  username: string;
}

export const useAdminUser = () => {
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Get token from local storage with correct key
        const token = sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
        
        if (!token) {
          console.error('No auth token found');
          return;
        }

        const { data } = await axios.get('/admin/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          withCredentials: true
        });

        setUser(data.data);
      } catch (error) {
        console.error('Failed to fetch admin user:', error);
      }
    };

    fetchUser();
  }, []);

  return user;
};
