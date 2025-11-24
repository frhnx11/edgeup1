import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Upload, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CreateUserPageProps {
  onCancel?: () => void;
}

export function CreateUserPage({ onCancel }: CreateUserPageProps) {
  const navigate = useNavigate();
  
  // Form state
  const [username, setUsername] = useState('');
  const [authMethod, setAuthMethod] = useState('Manual accounts');
  const [suspendedAccount, setSuspendedAccount] = useState(false);
  const [generatePassword, setGeneratePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forcePasswordChange, setForcePasswordChange] = useState(false);
  
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [emailDisplay, setEmailDisplay] = useState('Allow only other course members to see my email address');
  
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [timezone, setTimezone] = useState('Server timezone (Asia/Kolkata)');
  const [language, setLanguage] = useState('English (en)');
  const [description, setDescription] = useState('');
  
  const [userPicture, setUserPicture] = useState<File | null>(null);
  const [pictureDescription, setPictureDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Expandable sections state
  const [additionalNamesOpen, setAdditionalNamesOpen] = useState(false);
  const [interestsOpen, setInterestsOpen] = useState(false);
  const [optionalOpen, setOptionalOpen] = useState(false);
  const [academicOpen, setAcademicOpen] = useState(false);
  const [parentDetailsOpen, setParentDetailsOpen] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const maxSize = 128 * 1024 * 1024; // 128MB
    const allowedTypes = ['image/gif', 'image/jpg', 'image/jpeg', 'image/png'];
    
    if (file.size > maxSize) {
      alert('File size exceeds 128MB limit');
      return;
    }
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (.gif, .jpg, .jpeg, .png)');
      return;
    }
    
    setUserPicture(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removePicture = () => {
    setUserPicture(null);
    setPictureDescription('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData = {
      username,
      authMethod,
      suspendedAccount,
      generatePassword,
      password: generatePassword ? '' : password,
      forcePasswordChange,
      firstName,
      surname,
      email,
      emailDisplay,
      city,
      country,
      timezone,
      language,
      description,
      userPicture,
      pictureDescription
    };
    
    console.log('Creating user:', userData);
    // Here you would make an API call to create the user
    alert('User created successfully!');
    
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasDigit = /\d/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    
    return minLength && hasDigit && hasLower && hasUpper && hasSpecial;
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center">
        <button 
          onClick={handleCancel} 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Create User</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
        {/* General Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">General</h2>
          
          {/* Username */}
          <div className="grid grid-cols-3 gap-4 items-start mb-6">
            <label htmlFor="username" className="text-sm font-medium text-gray-700 pt-2">
              Username <span className="text-red-500">*</span>
            </label>
            <div className="col-span-2">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Authentication method */}
          <div className="grid grid-cols-3 gap-4 items-start mb-6">
            <label htmlFor="authMethod" className="text-sm font-medium text-gray-700 pt-2">
              Choose an authentication method
            </label>
            <div className="col-span-2">
              <select
                id="authMethod"
                value={authMethod}
                onChange={(e) => setAuthMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Manual accounts">Manual accounts</option>
                <option value="Email-based self-registration">Email-based self-registration</option>
                <option value="LDAP server">LDAP server</option>
              </select>
            </div>
          </div>

          {/* Account options */}
          <div className="grid grid-cols-3 gap-4 items-start mb-6">
            <div></div>
            <div className="col-span-2 space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={suspendedAccount}
                  onChange={(e) => setSuspendedAccount(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                />
                <span className="text-sm text-gray-700">Suspended account</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={generatePassword}
                  onChange={(e) => setGeneratePassword(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                />
                <span className="text-sm text-gray-700">Generate password and notify user</span>
              </label>
            </div>
          </div>

          {/* Password field */}
          {!generatePassword && (
            <div className="grid grid-cols-3 gap-4 items-start mb-6">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 pt-2">
                New password <span className="text-red-500">*</span>
              </label>
              <div className="col-span-2">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!generatePassword}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Click to enter text ✎"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  The password must have at least 8 characters, at least 1 digit(s), at least 1 lower case letter(s), 
                  at least 1 upper case letter(s), at least 1 non-alphanumeric character(s) such as , -, or #
                </p>
                {password && !validatePassword(password) && (
                  <p className="text-xs text-red-500 mt-1">Password does not meet requirements</p>
                )}
              </div>
            </div>
          )}

          {/* Force password change */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <div></div>
            <div className="col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={forcePasswordChange}
                  onChange={(e) => setForcePasswordChange(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                />
                <span className="text-sm text-gray-700">Force password change</span>
              </label>
            </div>
          </div>
        </div>

        {/* Fields Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Fields</h2>
          
          {/* First name */}
          <div className="grid grid-cols-3 gap-4 items-start mb-6">
            <label htmlFor="firstName" className="text-sm font-medium text-gray-700 pt-2">
              First name <span className="text-red-500">*</span>
            </label>
            <div className="col-span-2">
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Surname */}
          <div className="grid grid-cols-3 gap-4 items-start mb-6">
            <label htmlFor="surname" className="text-sm font-medium text-gray-700 pt-2">
              Surname <span className="text-red-500">*</span>
            </label>
            <div className="col-span-2">
              <input
                type="text"
                id="surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Email address */}
          <div className="grid grid-cols-3 gap-4 items-start mb-6">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 pt-2">
              Email address <span className="text-red-500">*</span>
            </label>
            <div className="col-span-2">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Email display */}
          <div className="grid grid-cols-3 gap-4 items-start mb-6">
            <label htmlFor="emailDisplay" className="text-sm font-medium text-gray-700 pt-2">
              Email display
            </label>
            <div className="col-span-2">
              <select
                id="emailDisplay"
                value={emailDisplay}
                onChange={(e) => setEmailDisplay(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Allow only other course members to see my email address">Allow only other course members to see my email address</option>
                <option value="Hide my email address from everyone">Hide my email address from everyone</option>
                <option value="Allow everyone to see my email address">Allow everyone to see my email address</option>
              </select>
            </div>
          </div>
        </div>

        {/* MelliferaNet profile Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">MelliferaNet profile</h2>
          
          {/* City/town */}
          <div className="grid grid-cols-3 gap-4 items-start mb-6">
            <label htmlFor="city" className="text-sm font-medium text-gray-700 pt-2">
              City/town
            </label>
            <div className="col-span-2">
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Country */}
          <div className="grid grid-cols-3 gap-4 items-start mb-6">
            <label htmlFor="country" className="text-sm font-medium text-gray-700 pt-2">
              Select a country
            </label>
            <div className="col-span-2">
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a country...</option>
                <option value="IN">India</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="JP">Japan</option>
                <option value="CN">China</option>
                <option value="BR">Brazil</option>
              </select>
            </div>
          </div>

          {/* Timezone */}
          <div className="grid grid-cols-3 gap-4 items-start mb-6">
            <label htmlFor="timezone" className="text-sm font-medium text-gray-700 pt-2">
              Timezone
            </label>
            <div className="col-span-2">
              <select
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Server timezone (Asia/Kolkata)">Server timezone (Asia/Kolkata)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
                <option value="Australia/Sydney">Australia/Sydney</option>
              </select>
            </div>
          </div>

          {/* Preferred language */}
          <div className="grid grid-cols-3 gap-4 items-start mb-6">
            <label htmlFor="language" className="text-sm font-medium text-gray-700 pt-2">
              Preferred language
            </label>
            <div className="col-span-2">
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="English (en)">English (en)</option>
                <option value="Hindi (hi)">Hindi (hi)</option>
                <option value="Spanish (es)">Spanish (es)</option>
                <option value="French (fr)">French (fr)</option>
                <option value="German (de)">German (de)</option>
                <option value="Chinese (zh)">Chinese (zh)</option>
                <option value="Japanese (ja)">Japanese (ja)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-3 gap-4 items-start mb-6">
            <label htmlFor="description" className="text-sm font-medium text-gray-700 pt-2">
              Description
            </label>
            <div className="col-span-2">
              <div className="border border-gray-300 rounded-md">
                <div className="flex flex-wrap items-center p-2 border-b border-gray-300 bg-gray-50 gap-1">
                  <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                    <option>Paragraph</option>
                  </select>
                  <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Bold">
                    <span className="font-bold">B</span>
                  </button>
                  <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Italic">
                    <span className="italic">I</span>
                  </button>
                  <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Underline">
                    <span className="underline">U</span>
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Bullet List">
                    <span>• —</span>
                  </button>
                  <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Numbered List">
                    <span>1. —</span>
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Link">
                    <span>🔗</span>
                  </button>
                  <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Image">
                    <span>🖼️</span>
                  </button>
                </div>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 focus:outline-none resize-none"
                  placeholder="Enter user description..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* User picture Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">User picture</h2>
          
          {/* Current picture */}
          <div className="grid grid-cols-3 gap-4 items-start mb-6">
            <label className="text-sm font-medium text-gray-700 pt-2">
              Current picture
            </label>
            <div className="col-span-2">
              <span className="text-sm text-gray-500">None</span>
              <label className="flex items-center mt-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                />
                <span className="text-sm text-gray-700">Delete picture</span>
              </label>
            </div>
          </div>

          {/* New picture */}
          <div className="grid grid-cols-3 gap-4 items-start mb-6">
            <label className="text-sm font-medium text-gray-700 pt-2">
              New picture
            </label>
            <div className="col-span-2">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">
                  📁 Files
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  You can drag and drop files here to add them.
                </p>
                <label className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                  Browse files
                  <input
                    type="file"
                    accept=".gif,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </label>
                <div className="text-xs text-gray-500 mt-3">
                  <p>Accepted file types: Image files to be optimised, such as badges .gif .jpg .jpeg .png</p>
                  <p>Maximum file size: 128MB, maximum number of files: 1</p>
                </div>
              </div>

              {userPicture && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{userPicture.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({(userPicture.size / 1024 / 1024).toFixed(1)} MB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removePicture}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Picture description */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <label htmlFor="pictureDescription" className="text-sm font-medium text-gray-700 pt-2">
              Picture description
            </label>
            <div className="col-span-2">
              <input
                type="text"
                id="pictureDescription"
                value={pictureDescription}
                onChange={(e) => setPictureDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter picture description..."
              />
            </div>
          </div>
        </div>

        {/* Expandable Sections */}
        {[
          { title: 'Additional names', isOpen: additionalNamesOpen, setOpen: setAdditionalNamesOpen },
          { title: 'Interests', isOpen: interestsOpen, setOpen: setInterestsOpen },
          { title: 'Optional', isOpen: optionalOpen, setOpen: setOptionalOpen },
          { title: 'Academic', isOpen: academicOpen, setOpen: setAcademicOpen },
          { title: 'Parent Details', isOpen: parentDetailsOpen, setOpen: setParentDetailsOpen }
        ].map((section, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm mb-6">
            <button
              type="button"
              onClick={() => section.setOpen(!section.isOpen)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50"
            >
              <span className="text-lg font-medium text-gray-900">{section.title}</span>
              {section.isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>

            {section.isOpen && (
              <div className="px-6 pb-6">
                <p className="text-sm text-gray-500">
                  {section.title} settings will be configured here.
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-8">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create user
          </button>
        </div>
      </form>
    </div>
  );
}