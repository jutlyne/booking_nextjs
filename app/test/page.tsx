'use client';

import { apiFetch } from '@/lib/api';
import apiClient from '@/lib/api-client';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  [key: string]: any;
}

export default function TestUsersPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiClient<User[]>('/users');
        console.log(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div>
      <h1>Danh sách người dùng</h1>
      {users && users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có người dùng nào.</p>
      )}
    </div>
  );
}
