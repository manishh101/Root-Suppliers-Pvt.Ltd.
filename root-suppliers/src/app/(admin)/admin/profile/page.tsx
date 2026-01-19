'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User as UserIcon,
  Mail,
  Lock,
  Save,
  Loader2,
  Camera,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { CloudinaryImage } from '@/components/ui/CloudinaryImage';
import { useRouter } from 'next/navigation';

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  avatar: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  avatar?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema)
  });

  const avatarUrl = watch('avatar');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // 1. Get session to find userId
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();

      if (!sessionData.success || !sessionData.user) {
        router.push('/admin/login');
        return;
      }

      // 2. Fetch full user details
      const userRes = await fetch(`/api/users/${sessionData.user.userId}`, {
        cache: 'no-store'
      });
      const userData = await userRes.json();

      if (userData.success) {
        console.log('Profile Data Fetched:', userData.user);
        setUser(userData.user);

        // Use user data from API, fallback to session data if missing (safeguard)
        reset({
          name: userData.user.name || sessionData.user.name || '',
          email: userData.user.email || sessionData.user.email || '',
          avatar: userData.user.avatar || sessionData.user.image || '', // NextAuth often uses 'image'
        });
      } else {
        console.error('Profile fetch unsuccessful:', userData);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "root-suppliers/avatars");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setValue('avatar', data.url, { shouldDirty: true });
        // Auto-save avatar? Or let them hit save. Let's wait for save.
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setMessage({ type: 'error', text: 'Failed to upload image' });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setIsSaving(true);
    setMessage(null);

    try {
      // Clean up data
      const payload: any = {
        name: data.name,
        email: data.email,
        avatar: data.avatar,
      };

      if (data.password) {
        payload.password = data.password;
      }

      const response = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
        // Refresh valid session data if name/email changed involves auth re-check usually but here just UI update
        setUser(result.user);
        setValue('password', ''); // Clear password field
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (error: any) {
      console.error('Update error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-cardinal-red" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Avatar Section */}
        <div className="p-6 sm:p-8 border-b bg-gray-50 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white border-2 border-white shadow-md relative">
              {avatarUrl ? (
                <CloudinaryImage
                  src={avatarUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <UserIcon className="w-10 h-10" />
                </div>
              )}

              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-1.5 bg-cardinal-red text-white rounded-full cursor-pointer shadow-sm hover:bg-cardinal-red/90 transition-colors">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </label>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-semibold text-gray-900">
              {watch('name') || user?.name || 'User'}
            </h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                <Shield className="w-3 h-3" />
                {user?.role === 'admin' ? 'Administrator' : 'Editor'}
              </span>
              <span>•</span>
              <span>{watch('email') || user?.email}</span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('name')}
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red outline-none transition-colors"
                />
              </div>
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red outline-none transition-colors"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
          </div>

          {user?.role === 'admin' && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">Security</h3>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-cardinal-red hover:text-cardinal-red/80 font-medium"
                >
                  {showPassword ? "Cancel Change" : "Change Password"}
                </button>
              </div>

              {showPassword && (
                <div className="space-y-2 max-w-md animate-in slide-in-from-top-2 duration-200">
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register('password')}
                      type="password"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-cardinal-red/20 focus:border-cardinal-red outline-none transition-colors"
                      placeholder="Enter new password"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Minimum 8 characters.
                  </p>
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50 border-t flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="flex items-center gap-2 px-6 py-2 bg-cardinal-red text-white rounded-lg hover:bg-cardinal-red/90 transition-colors shadow-sm disabled:opacity-50 font-medium"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
