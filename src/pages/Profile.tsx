import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User as UserIcon, Mail, Briefcase, FileText, CreditCard, Lock } from 'lucide-react';
import type { User } from '../types';

export const Profile: React.FC = () => {
  const { user: currentUser, changePassword } = useAuth();
  const { employees, updateEmployee } = useData();
  const { employeeId } = useParams<{ employeeId: string }>();
 
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'employment' | 'bank' | 'documents' | 'security'>('personal');
 
  // Form state
  const [formData, setFormData] = useState<Partial<User>>({});
 
  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (employeeId) {
      const found = employees.find(e => e.id === employeeId);
      setProfileUser(found || null);
      setFormData(found || {});
    } else {
      setProfileUser(currentUser);
      setFormData(currentUser || {});
    }
  }, [employeeId, currentUser, employees]);

  if (!profileUser) return <div>Loading...</div>;

  const isOwnProfile = currentUser?.id === profileUser.id;
  const canEdit = isOwnProfile || currentUser?.role === 'admin';

  const handleSave = () => {
    if (profileUser.id) {
      updateEmployee(profileUser.id, formData);
      setIsEditing(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    // In a real app, we'd verify current password with backend
    // Here we just simulate success if it's the current user
    if (isOwnProfile) {
      try {
        await changePassword(passwordData.newPassword);
        setPasswordSuccess('Password updated successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } catch (err) {
        setPasswordError('Failed to update password');
      }
    }
  };

  const renderPersonalTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={!isEditing}
        />
        <Input
          label="Email"
          value={formData.email}
          disabled={true} // Email usually not editable
        />
        <Input
          label="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          disabled={!isEditing}
        />
        <Input
          label="Date of Birth"
          type="date"
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          disabled={!isEditing}
        />
        <Input
          label="Gender"
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
          disabled={!isEditing}
        />
        <Input
          label="Marital Status"
          value={formData.maritalStatus}
          onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value as any })}
          disabled={!isEditing}
        />
        <Input
          label="Nationality"
          value={formData.nationality}
          onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
          disabled={!isEditing}
        />
        <div className="md:col-span-2">
          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );

  const renderEmploymentTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Employee ID"
          value={profileUser.id}
          disabled={true}
        />
        <Input
          label="Company Name"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          disabled={!isEditing || currentUser?.role !== 'admin'}
        />
        <Input
          label="Department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          disabled={!isEditing || currentUser?.role !== 'admin'}
        />
        <Input
          label="Position"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          disabled={!isEditing || currentUser?.role !== 'admin'}
        />
        <Input
          label="Manager"
          value={formData.managerName}
          onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
          disabled={!isEditing || currentUser?.role !== 'admin'}
        />
        <Input
          label="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          disabled={!isEditing || currentUser?.role !== 'admin'}
        />
        <Input
          label="Date of Joining"
          type="date"
          value={formData.joinDate}
          onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
          disabled={!isEditing || currentUser?.role !== 'admin'}
        />
        {currentUser?.role === 'admin' && (
          <Input
            label="Salary"
            type="number"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
            disabled={!isEditing}
          />
        )}
      </div>
    </div>
  );

  const renderBankTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Bank Name"
          value={formData.bankDetails?.bankName || ''}
          onChange={(e) => setFormData({
            ...formData,
            bankDetails: { ...formData.bankDetails!, bankName: e.target.value }
          })}
          disabled={!isEditing}
        />
        <Input
          label="Account Number"
          value={formData.bankDetails?.accountNumber || ''}
          onChange={(e) => setFormData({
            ...formData,
            bankDetails: { ...formData.bankDetails!, accountNumber: e.target.value }
          })}
          disabled={!isEditing}
        />
        <Input
          label="IFSC Code"
          value={formData.bankDetails?.ifscCode || ''}
          onChange={(e) => setFormData({
            ...formData,
            bankDetails: { ...formData.bankDetails!, ifscCode: e.target.value }
          })}
          disabled={!isEditing}
        />
        <Input
          label="PAN Number"
          value={formData.bankDetails?.panNumber || ''}
          onChange={(e) => setFormData({
            ...formData,
            bankDetails: { ...formData.bankDetails!, panNumber: e.target.value }
          })}
          disabled={!isEditing}
        />
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Uploaded Documents</h3>
        {isEditing && <Button size="sm">Upload New</Button>}
      </div>
     
      {formData.documents && formData.documents.length > 0 ? (
        <ul className="divide-y divide-gray-200 border rounded-md">
          {formData.documents.map((doc) => (
            <li key={doc.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-500">Uploaded on {doc.uploadDate}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => alert(`Viewing ${doc.name}`)}>
                View
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-8">No documents uploaded.</p>
      )}
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {isOwnProfile ? (
        <div className="max-w-md">
          <h3 className="text-lg font-medium mb-4">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              type="password"
              label="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
            />
            <Input
              type="password"
              label="New Password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
            />
            <Input
              type="password"
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
            />
           
            {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
            {passwordSuccess && <p className="text-green-600 text-sm">{passwordSuccess}</p>}
           
            <Button type="submit">Update Password</Button>
          </form>
        </div>
      ) : (
        <p className="text-gray-500">Security settings are only available to the account owner.</p>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:space-x-5">
            <div className="flex-shrink-0">
              <img className="mx-auto h-20 w-20 rounded-full object-cover" src={profileUser.avatar} alt="" />
            </div>
            <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
              <p className="text-xl font-bold text-gray-900 sm:text-2xl">{profileUser.name}</p>
              <p className="text-sm font-medium text-gray-600">{profileUser.position} • {profileUser.department}</p>
              <div className="mt-2 flex items-center justify-center sm:justify-start text-sm text-gray-500">
                <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                {profileUser.email}
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-center sm:mt-0">
            {canEdit && activeTab !== 'security' && (
              <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'secondary' : 'primary'}>
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="-mb-px flex min-w-max">
            <button
              onClick={() => setActiveTab('personal')}
              className={`${
                activeTab === 'personal'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center`}
            >
              <UserIcon className="w-4 h-4 mr-2" /> Personal
            </button>
            <button
              onClick={() => setActiveTab('employment')}
              className={`${
                activeTab === 'employment'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center`}
            >
              <Briefcase className="w-4 h-4 mr-2" /> Employment
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className={`${
                activeTab === 'bank'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center`}
            >
              <CreditCard className="w-4 h-4 mr-2" /> Bank
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center`}
            >
              <FileText className="w-4 h-4 mr-2" /> Documents
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center`}
            >
              <Lock className="w-4 h-4 mr-2" /> Security
            </button>
          </nav>
        </div>
       
        <div className="p-6">
          {activeTab === 'personal' && renderPersonalTab()}
          {activeTab === 'employment' && renderEmploymentTab()}
          {activeTab === 'bank' && renderBankTab()}
          {activeTab === 'documents' && renderDocumentsTab()}
          {activeTab === 'security' && renderSecurityTab()}
         
          {isEditing && activeTab !== 'security' && (
            <div className="mt-6 flex justify-end border-t pt-4">
              <Button onClick={handleSave} className="w-full sm:w-auto">
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
