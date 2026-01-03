import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import type { Role } from '../types';

export const Register: React.FC = () => {
  const [role, setRole] = useState<Role>('employee');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { addPendingEmployee } = useData();
  const { registerAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'employee') {
      // Employee Flow: Submit Request Only
      addPendingEmployee({
        id: `REQ${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: 'employee',
        requestDate: new Date().toISOString().split('T')[0]
      });
      setSubmitted(true);
    } else if (role === 'admin') {
      // Admin Flow: Create Full Account
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      try {
        await registerAdmin({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'admin'
        });
        navigate('/dashboard/admin');
      } catch (err: any) {
        setError(err.message || 'Failed to create admin account');
      }
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Request Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your request to join as an Employee has been sent to the Administrator.
              <br/><br/>
              Once approved, you will receive your <strong>Login ID</strong> and <strong>Password</strong> from the Admin to log in.
            </p>
            <Link to="/login">
              <Button className="w-full">Back to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {role === 'admin' ? 'Create Admin Account' : 'Join the Team'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                I am a...
              </label>
              <select
                id="role"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin / HR</option>
              </select>
            </div>

            <Input
              id="name"
              type="text"
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              id="email"
              type="email"
              label="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            {role === 'admin' && (
              <>
                <Input
                  id="password"
                  type="password"
                  label="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />

                <Input
                  id="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </>
            )}

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div>
              <Button type="submit" className="w-full">
                {role === 'admin' ? 'Create Account' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
