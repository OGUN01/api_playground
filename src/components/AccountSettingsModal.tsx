import React, { useState } from 'react';
import { X, User, Lock, Upload, Camera, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';
import { uploadAvatar } from '../lib/storage';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import toast from 'react-hot-toast';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountSettingsModal({ isOpen, onClose }: AccountSettingsModalProps) {
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(auth.currentUser?.photoURL || null);
  const [loading, setLoading] = useState(false);
  const [slideOut, setSlideOut] = useState(false);

  const handleClose = () => {
    setSlideOut(true);
    setTimeout(() => {
      setSlideOut(false);
      onClose();
    }, 200);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      setLoading(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      setLoading(false);
      return;
    }

    try {
      // Upload to Puter and get public URL
      const avatarUrl = await uploadAvatar(file);
      
      // Update user profile with new avatar URL
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: avatarUrl });
        setAvatarPreview(avatarUrl);
        toast.success('Avatar updated successfully');
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Failed to update avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setLoading(true);

    try {
      // Update display name if changed
      if (displayName !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName });
        toast.success('Display name updated successfully');
      }

      // Update password if provided
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          toast.error('New passwords do not match');
          return;
        }

        if (!currentPassword) {
          toast.error('Please enter your current password');
          return;
        }

        // Re-authenticate user before password change
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email!,
          currentPassword
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, newPassword);
        toast.success('Password updated successfully');
      }

      // Update avatar if changed
      // Avatar is now handled separately in handleAvatarChange

      handleClose();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-md px-4">
        <div 
          className={cn(
            "bg-[#141414] rounded-2xl border border-[#232323] shadow-2xl overflow-hidden transform transition-all duration-200",
            slideOut ? 'animate-out slide-out-to-bottom-4 fade-out-0' : 'animate-in slide-in-from-bottom-4 fade-in-0'
          )}
        >
          {/* Header */}
          <div className="relative p-6 pb-0">
            <button 
              onClick={handleClose}
              className="absolute right-4 top-4 p-2 hover:bg-[#232323] rounded-full transition-all duration-200 hover:rotate-90"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
                <div className="w-full h-full rounded-[10px] bg-[#1A1A1A] flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Account Settings</h2>
                <p className="text-sm text-gray-400">Manage your profile and security</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Avatar Upload */}
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-[#1A1A1A] flex items-center justify-center overflow-hidden">
                      {avatarPreview ? (
                        <img 
                          src={avatarPreview} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera className="h-6 w-6 text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Profile Picture</h3>
                  <p className="text-sm text-gray-400">
                    Click to upload a new avatar
                  </p>
                </div>
              </div>
            </div>

            {/* Display Name */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-medium text-gray-400">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#232323] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all duration-200"
                placeholder="Enter your display name"
              />
            </div>

            {/* Password Change */}
            <div className="space-y-4 mb-6">
              <h3 className="font-medium">Change Password</h3>
              <div className="space-y-2">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#232323] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all duration-200"
                  placeholder="Current password"
                />
              </div>
              <div className="space-y-2">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#232323] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all duration-200"
                  placeholder="New password"
                />
              </div>
              <div className="space-y-2">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#232323] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all duration-200"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 border border-[#232323] hover:bg-[#1A1A1A] rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}