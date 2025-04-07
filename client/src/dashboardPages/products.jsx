"use client"

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react"
import { Table, Button, Form, Input, Select, InputNumber, Modal, message, Upload, Space, Tag, Collapse } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons"

const { Option } = Select
const { Panel } = Collapse

const ProductsManagement = () => {
  const [products, setProducts] = useState([
    {
      key: "1",
      id: 1,
      name: "Wireless Headphones",
      category: "Electronics",
      price: 129.99,
      stock: 45,
      status: "In Stock",
      sales: 120,
      rating: 4.5,
    },
    // Add more mock products...
  ])

  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)

  // Handle Add Product
  const handleAddProduct = (values) => {
    const newProduct = {
      ...values,
      key: String(products.length + 1),
      id: products.length + 1,
      status: values.stock > 0 ? "In Stock" : "Out of Stock",
    }

    setProducts([...products, newProduct])
    addForm.resetFields()
    setIsAddModalVisible(false)
    message.success("Product added successfully")
  }

  // Handle Edit Product
  const handleEditProduct = (values) => {
    const updatedProducts = products.map((product) =>
      product.key === currentProduct.key
        ? {
            ...product,
            ...values,
            status: values.stock > 0 ? "In Stock" : "Out of Stock",
          }
        : product,
    )

    setProducts(updatedProducts)
    editForm.resetFields()
    setIsEditModalVisible(false)
    message.success("Product updated successfully")
  }

  // Open delete modal
  const showDeleteModal = (record) => {
    setCurrentProduct(record)
    setIsDeleteModalVisible(true)
  }

  // Handle Delete Product
  const handleDeleteProduct = () => {
    setProducts(products.filter((product) => product.key !== currentProduct.key))
    setIsDeleteModalVisible(false)
    message.success("Product deleted successfully")
  }

  // Edit Product
  const editProduct = (record) => {
    setCurrentProduct(record)
    editForm.setFieldsValue(record)
    setIsEditModalVisible(true)
  }

  // Product Columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 150,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
      width: 120,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      width: 100,
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      width: 150,
      render: (status) => {
        const color = status === "In Stock" ? "green" : status === "Low Stock" ? "orange" : "red"
        return <Tag color={color}>{status}</Tag>
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => editProduct(record)} type="primary" ghost size="small">
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => showDeleteModal(record)}
            type="primary"
            danger
            size="small"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  const ProductForm = ({ form, onFinish, initialValues = {} }) => {
    const [fileList, setFileList] = useState([])

    const handleUpload = (info) => {
      const newFileList = [...info.fileList]
      setFileList(newFileList)
    }

    return (
      <Form form={form} layout="vertical" initialValues={initialValues} onFinish={onFinish}>
        <Form.Item name="name" label="Product Name" rules={[{ required: true, message: "Please input product name" }]}>
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select a category" }]}>
          <Select placeholder="Select product category">
            <Option value="Electronics">Electronics</Option>
            <Option value="Clothing">Clothing</Option>
            <Option value="Accessories">Accessories</Option>
            <Option value="Home">Home</Option>
          </Select>
        </Form.Item>

        <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please input product price" }]}>
          <InputNumber min={0} step={0.01} precision={2} placeholder="Enter price" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="stock"
          label="Stock Quantity"
          rules={[{ required: true, message: "Please input stock quantity" }]}
        >
          <InputNumber min={0} placeholder="Enter stock quantity" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="image" label="Product Image">
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={handleUpload}
            beforeUpload={() => false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>
      </Form>
    )
  }

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalVisible(true)}>
          Add Product
        </Button>
      </div>

      <Collapse accordion className="mb-6">
        <Panel header="Add New Product" key="add">
          <ProductForm form={addForm} onFinish={handleAddProduct} />
          <div className="text-right mt-4">
            <Button type="primary" onClick={() => addForm.submit()}>
              Add Product
            </Button>
          </div>
        </Panel>
      </Collapse>

      <div className="bg-white rounded-xl mt-5 shadow-md p-6">
        <Table
          columns={columns}
          dataSource={products}
          responsive
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </div>

      {/* Add Product Modal */}
      <Modal
        title="Add New Product"
        open={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false)
          addForm.resetFields()
        }}
        footer={[
          <Button key="cancel" onClick={() => setIsAddModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => addForm.submit()}>
            Add Product
          </Button>,
        ]}
      >
        <ProductForm form={addForm} onFinish={handleAddProduct} />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        title="Edit Product"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false)
          editForm.resetFields()
        }}
        footer={[
          <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => editForm.submit()}>
            Update Product
          </Button>,
        ]}
      >
        <ProductForm form={editForm} onFinish={handleEditProduct} initialValues={currentProduct} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Product"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDeleteModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleDeleteProduct}>
            Delete
          </Button>,
        ]}
      >
        <div className="flex items-center">
          <ExclamationCircleOutlined style={{ color: "#ff4d4f", fontSize: "22px", marginRight: "16px" }} />
          <div>
            <p>Are you sure you want to delete this product?</p>
            {currentProduct && (
              <p className="font-medium mt-2">
                Product: <span className="text-blue-600">{currentProduct.name}</span>
              </p>
            )}
            <p className="text-gray-500 mt-2">This action cannot be undone.</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProductsManagement