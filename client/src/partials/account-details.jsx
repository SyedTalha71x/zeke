/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

const AccountDetails = () => {
  const [formData, setFormData] = useState({
    firstName: 'Kevin',
    lastName: 'backer',
    displayName: 'Kevin Backer',
    email: 'kevinbacker324@gmail.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleReset = () => {
    setFormData({
      firstName: 'Kevin',
      lastName: 'backer',
      displayName: 'Kevin Backer',
      email: 'kevinbacker324@gmail.com',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <>
   
    <div className="max-w-3xl bg-[#FFFFFF] p-2 rounded-md shadow-md space-y-6 ">
      {/* Personal Details Box */}
      <div className=" p-3 rounded-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name*
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300/30 rounded-3xl text-sm bg-[#E3E3E3] outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name*
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300/30 rounded-3xl text-sm bg-[#E3E3E3] outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
              Display name*
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-gray-300/30 rounded-3xl text-sm bg-[#E3E3E3] outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-gray-300/30 rounded-3xl text-sm bg-[#E3E3E3] outline-none"
              required
            />
          </div>
        </form>
      </div>
      </div>
      {/* Password Change Box */}

      <div className="max-w-3xl bg-[#FFFFFF] p-2 mt-4 rounded-md shadow-md  space-y-6 ">
      <div className="bg-[#FFFFFF] p-3 rounded-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Current password <span className="text-gray-500 text-sm">(leave blank to leave unchanged)</span>
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-gray-300/30 rounded-3xl text-sm bg-[#E3E3E3] outline-none"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New password <span className="text-gray-500 text-sm">(leave blank to leave unchanged)</span>
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-gray-300/30 rounded-3xl text-sm bg-[#E3E3E3] outline-none"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm new password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-gray-300/30 rounded-3xl text-sm bg-[#E3E3E3] outline-none"
            />
          </div>
        </form>
        <div className="flex items-center gap-4 mt-4">
        <button
          type="submit"
          className="px-6 py-3 bg-[#2F456C]  cursor-pointer text-sm rounded-3xl text-white hover:bg-[#1a2a44] transition-all ease-in-out duration-500 "
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-3 rounded-3xl text-sm cursor-pointer text-gray-600 bg-[#E3E3E3] hover:text-gray-800 transition-all ease-in-out duration-500"
        >
          Reset
        </button>
      </div>
      </div>
      </div>
      </>
  
  );
};

export default AccountDetails;