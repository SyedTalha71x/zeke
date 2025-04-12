/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../utils/api';

const DashboardHome = () => {
  const [username, setUsername] = useState("")
  // const username = "Username here"; 

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${BASE_URL}/show-profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        const data = await response.json();
        // console.log(data.data.user.name);
        setUsername(data.data.user.name);

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile');
        }

      } catch (error) {
        console.log(error);
        
      } 
    };

    fetchUserProfile();
  }, []);
  return (
    <>
    <div className='bg-[#FFFFFF] rounded-md shadow-lg p-4'>

   
      <div className="mb-6  rounded-md">
        <p className="text-gray-800">
          Hello <span className="text-[#C75000] underline cursor-pointer font-bold">{username}</span>{' '}
          (not {username}?{' '}
          <Link to="/login-signup" className="text-[#C75000] font-bold cursor-pointer underline">
            Logout
          </Link>
          )
        </p>
      </div>

      <p className="text-gray-700 mb-4">
        From your account dashboard you can view your{' '}
        <Link to="/user-profile/my-orders" className="text-[#C75000] font-bold cursor-pointer underline">
          recent orders
        </Link>
        , manage your{' '}
        <Link to="/user-profile/billing" className="text-[#C75000] font-bold cursor-pointer underline">
          shipping and billing
        </Link>
        ,{' '}
        <Link to="/user-profile/account-details" className="text-[#C75000] font-bold cursor-pointer underline">
          addresses
        </Link>{' '}
        and{' '}
        <Link to="/user-profile/account-details" className="text-[#C75000] font-bold cursor-pointer underline">
          edit your password
        </Link>{' '}
        and{' '}
        <Link to="/user-profile/account-details" className="text-[#C75000] font-bold cursor-pointer underline">
          account details
        </Link>
        .
      </p>
      </div>
    </>
  );
};

export default DashboardHome;