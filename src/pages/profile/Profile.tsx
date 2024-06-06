import React, { useContext, useState, ChangeEvent, FormEvent } from 'react';
import { AuthContext, updateUser } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { AuthService } from '../../api/AuthService';
import { Button } from '../../ui/Button/Button';
import CloseIcon from '@mui/icons-material/Close';
import { Input } from '../../ui/Input/Input';

interface UserProfile {
  firstName: string;
  lastName: string;
  address: string;
  username: string;
  password: string;
  email: string;
  profilePicture?: string | File;
}

export const Profile: React.FC = () => {
  const { state: authState, dispatch } = useContext(AuthContext);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: authState.user?.firstName || '',
    lastName: authState.user?.lastName || '',
    address: authState.user?.address || '',
    username: authState.user?.username || '',
    password: '',
    email: authState.user?.email || '',
    profilePicture: authState.user?.profilePicture || '',
  });

  const clearProfilePicture = () => {
    setProfile((prev) => ({ ...prev, profilePicture: '' }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        profilePicture: e?.target?.files?.[0],
      }));
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('firstName', profile.firstName);
      formData.append('lastName', profile.lastName);
      formData.append('address', profile.address);
      formData.append('username', profile.username);
      formData.append('password', profile.password);
      formData.append('email', profile.email);
      if (profile.profilePicture instanceof File) {
        formData.append('profilePicture', profile.profilePicture);
      }

      const updatedUser = await AuthService.updateUserProfile(formData);
      dispatch(updateUser(updatedUser));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="profile-container">
      <h2>Профиль пользователя</h2>
      <div className="profile-content">
        <form onSubmit={handleSave} className="profile-form">
          <Input name="firstName" placeholder="Имя" value={profile.firstName} onChange={handleChange} />
          <Input name="lastName" placeholder="Фамилия" value={profile.lastName} onChange={handleChange} />
          <Input name="address" placeholder="Адрес" value={profile.address} onChange={handleChange} />
          <Input name="username" placeholder="Логин" value={profile.username} onChange={handleChange} />
          <Input name="email" placeholder="Емэйл" value={profile.email} onChange={handleChange} />
          <div className="block-input-image">
            <div>
              <input type="file" onChange={handleFileChange} />
            </div>
            {profile.profilePicture && (
              <div onClick={clearProfilePicture}>
                <CloseIcon />
              </div>
            )}
          </div>
          <Button size="large" background="primary" color="basic">
            Сохранить изменения
          </Button>
        </form>
        <div className="profile-picture">
          <img src={`http://localhost:8080${authState.user?.profilePicture}`} alt="Profile" />
        </div>
      </div>
    </div>
  );
};
