/* eslint-disable no-unused-vars */
import React from "react";
import { useState, useEffect } from "react";
import { Table, Input, Button, Space, Tag, Typography, Spin, Modal, Form, Select, message } from "antd";
import { SearchOutlined, UserOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { BASE_URL } from "../utils/api";
const { Title } = Typography;
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/get-all-users`); 
        const data = await response.json();
        
        const transformedUsers = data.map(user => ({
          ...user,
          key: user._id,
          status: "active",
          lastLogin: new Date().toLocaleString(), 
        }));
        
        setUsers(transformedUsers);
      } catch (error) {
        message.error('Failed to fetch users');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

 const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.role.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "red";
      case "pending":
        return "orange";
      default:
        return "default";
    }
  };

  const handleEdit = (record) => {
    setCurrentUser(record);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      role: record.role,
      status: record.status,
    });
    setEditModalVisible(true);
  };

  const handleDelete = (record) => {
    setCurrentUser(record);
    setDeleteModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const updatedUsers = users.map((user) => {
        if (user._id === currentUser._id) {
          return { ...user, ...values };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      setEditModalVisible(false);
      message.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {

      const updatedUsers = users.filter((user) => user._id !== currentUser._id);
      setUsers(updatedUsers);
      setDeleteModalVisible(false);
      message.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span>
          <UserOutlined /> {text}
        </span>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: "Admin", value: "admin" },
        { text: "User", value: "user" },
      ],
      onFilter: (value, record) => record.role === value,
      responsive: ["md", "lg", "xl"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>,
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
        { text: "Pending", value: "pending" },
      ],
      onFilter: (value, record) => record.status === value,
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      responsive: ["lg", "xl"],
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <Button 
    //         type="text" 
    //         icon={<EditOutlined />} 
    //         onClick={() => handleEdit(record)} 
    //         disabled={record.role === 'admin'} // Disable edit for admins (example)
    //       />
    //       <Button 
    //         type="text" 
    //         danger 
    //         icon={<DeleteOutlined />} 
    //         onClick={() => handleDelete(record)}
    //         disabled={record.role === 'admin'} // Disable delete for admins (example)
    //       />
    //     </Space>
    //   ),
    //   responsive: ["xs", "sm", "md", "lg", "xl"],
    // },
  ];

  const tableProps = {
    scroll: { x: "max-content" },
    size: window.innerWidth < 768 ? "small" : "middle",
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <Title level={3} className="mb-4 md:mb-0">
          User Management
        </Title>
        <div className="w-full md:w-auto">
          <Input
            placeholder="Search users..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full md:w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="_id"
            scroll={{ x: 1000 }}
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20"],
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              responsive: true,
            }}
            {...tableProps}
          />
        </div>
      )}

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleEditSubmit}
        okText="Save Changes"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input user name!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input email address!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select user role!" }]}
          >
            <Select placeholder="Select a role">
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select user status!" }]}
          >
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="pending">Pending</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        title="Delete User"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onOk={handleDeleteConfirm}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete user {currentUser?.name}?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default Users;