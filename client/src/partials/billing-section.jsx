/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { BASE_URL } from '../utils/api';

export default function BillingSection({ fetchUserDetails }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // Default empty values for billing info display
  const [billingInfo, setBillingInfo] = useState({
    email: 'Not provided',
    country: 'Not provided',
    postalcode: 'Not provided',
    address: 'Not provided'
  });

  const showModal = () => {
    // Use existing billing info as default values in the form
    form.setFieldsValue({
      email: billingInfo.email !== 'Not provided' ? billingInfo.email : '',
      country: billingInfo.country !== 'Not provided' ? billingInfo.country : '',
      postalcode: billingInfo.postalcode !== 'Not provided' ? billingInfo.postalcode : '',
      address: billingInfo.address !== 'Not provided' ? billingInfo.address : ''
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/update-user`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.status === 201) {
        message.success('Details updated successfully');
        setBillingInfo({
          email: values.email || 'Not provided',
          country: values.country || 'Not provided',
          postalcode: values.postalcode || 'Not provided',
          address: values.address || 'Not provided'
        });
        
        if (fetchUserDetails) {
          fetchUserDetails(); 
        }
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error('Update error:', error);
      message.error(error.response?.data?.message || 'Failed to update details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-4 lg:w-[50%] shadow-lg w-full rounded-md mr-auto bg-[#FFFFFF]">
      <div className="">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold hero_h1">Billing address</h2>
          <button 
            className="text-[#987C5D] text-sm cursor-pointer underline" 
            onClick={showModal}
          >
            Edit
          </button>
        </div>

        <div className="space-y-3">
          <div className="text-gray-700 text-sm">{billingInfo.email}</div>
          <div className="text-gray-700 text-sm">{billingInfo.country}</div>
          <div className="text-gray-700 text-sm">{billingInfo.postalcode}</div>
          <div className="text-gray-700 text-sm">{billingInfo.address}</div>
        </div>
      </div>

      <Modal
        title="Edit Billing Details"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: 'Please input your country!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Postal Code"
            name="postalcode"
            rules={[{ required: true, message: 'Please input your postal code!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end space-x-4">
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}