/* eslint-disable no-unused-vars */
import React from "react";
import { useState, useEffect } from "react";
import { Table, Input, Button, Space, Tag, Typography, Spin, Modal, Form, Select } from "antd";
import { SearchOutlined, UserOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const sampleUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "active",
    lastLogin: "2023-05-15 09:23:11",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "User",
    status: "active",
    lastLogin: "2023-05-14 14:45:30",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.j@example.com",
    role: "Editor",
    status: "inactive",
    lastLogin: "2023-04-28 11:20:45",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "User",
    status: "pending",
    lastLogin: "2023-05-10 16:37:22",
  },
  {
    id: 5,
    name: "Michael Wilson",
    email: "michael.w@example.com",
    role: "User",
    status: "active",
    lastLogin: "2023-05-15 08:12:55",
  },
  {
    id: 6,
    name: "Sarah Brown",
    email: "sarah.b@example.com",
    role: "Editor",
    status: "active",
    lastLogin: "2023-05-14 19:30:10",
  },
  {
    id: 7,
    name: "David Miller",
    email: "david.m@example.com",
    role: "User",
    status: "inactive",
    lastLogin: "2023-05-01 10:15:33",
  },
];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();

  // Simulate fetching data
  useEffect(() => {
    const fetchUsers = async () => {
      // In a real app, you would fetch from an API
      setTimeout(() => {
        setUsers(sampleUsers);
        setLoading(false);
      }, 1000);
    };

    fetchUsers();
  }, []);

  // Filter users based on search text
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.role.toLowerCase().includes(searchText.toLowerCase())
  );

  // Define status colors
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

  // Handle edit button click
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

  // Handle delete button click
  const handleDelete = (record) => {
    setCurrentUser(record);
    setDeleteModalVisible(true);
  };

  // Handle edit form submission
  const handleEditSubmit = () => {
    form.validateFields().then((values) => {
      const updatedUsers = users.map((user) => {
        if (user.id === currentUser.id) {
          return { ...user, ...values };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      setEditModalVisible(false);
      // In a real app, you would make API call here
      console.log("User updated:", { id: currentUser.id, ...values });
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    const updatedUsers = users.filter((user) => user.id !== currentUser.id);
    setUsers(updatedUsers);
    setDeleteModalVisible(false);
    // In a real app, you would make API call here
    console.log("User deleted:", currentUser.id);
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
      filters: [
        { text: "Admin", value: "Admin" },
        { text: "User", value: "User" },
        { text: "Editor", value: "Editor" },
      ],
      onFilter: (value, record) => record.role === value,
      responsive: ["md", "lg", "xl"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>,
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      responsive: ["lg", "xl"],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </Space>
      ),
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
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
            rowKey="id"
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
              <Option value="Admin">Admin</Option>
              <Option value="User">User</Option>
              <Option value="Editor">Editor</Option>
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