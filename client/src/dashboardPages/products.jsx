/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { Table, Button, Form, Input, InputNumber, Modal, message, Upload, Space, Tag, Collapse } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import { BASE_URL } from "../utils/api"
const { Panel } = Collapse

const ProductsManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/get-all-cards`)
        const data = await response.json()
        const productsWithKeys = data.map((product, index) => ({
          ...product,
          key: product._id,
          id: index + 1
        }))
        setProducts(productsWithKeys)
      } catch (error) {
        message.error('Failed to fetch products')
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])

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
      _id: `temp-${Date.now()}`,
      key: `temp-${Date.now()}`,
      id: products.length + 1,
      inStock: true,
      isVerified: false,
      createdAt: new Date().toISOString(),
      __v: 0
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
      title: "Card Name",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 300,
      ellipsis: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
      width: 120,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Box Count",
      dataIndex: "boxCount",
      key: "boxCount",
      width: 120,
      sorter: (a, b) => a.boxCount - b.boxCount,
    },
    {
      title: "Cards Available",
      dataIndex: "cardsAvailable",
      key: "cardsAvailable",
      width: 150,
      sorter: (a, b) => a.cardsAvailable - b.cardsAvailable,
    },
    {
      title: "Status",
      key: "inStock",
      dataIndex: "inStock",
      width: 120,
      render: (inStock) => {
        const status = inStock ? "In Stock" : "Out of Stock"
        const color = inStock ? "green" : "red"
        return <Tag color={color}>{status}</Tag>
      },
      filters: [
        { text: 'In Stock', value: true },
        { text: 'Out of Stock', value: false },
      ],
      onFilter: (value, record) => record.inStock === value,
    },
    {
      title: "Verified",
      key: "isVerified",
      dataIndex: "isVerified",
      width: 120,
      render: (isVerified) => {
        const status = isVerified ? "Verified" : "Not Verified"
        const color = isVerified ? "green" : "orange"
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
        <Form.Item name="name" label="Card Name" rules={[{ required: true, message: "Please input card name" }]}>
          <Input placeholder="Enter card name" />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input description" }]}>
          <Input.TextArea placeholder="Enter card description" rows={4} />
        </Form.Item>

        <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please input card price" }]}>
          <InputNumber min={0} step={0.01} precision={2} placeholder="Enter price" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="boxCount"
          label="Box Count"
          rules={[{ required: true, message: "Please input box count" }]}
        >
          <InputNumber min={0} placeholder="Enter box count" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="cardsAvailable"
          label="Cards Available"
          rules={[{ required: true, message: "Please input cards available" }]}
        >
          <InputNumber min={0} placeholder="Enter cards available" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="imageUrl" label="Card Image">
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
        <h1 className="text-2xl font-bold text-gray-800">Cards Management</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalVisible(true)}>
          Add Card
        </Button>
      </div>

      <Collapse accordion className="mb-6">
        <Panel header="Add New Card" key="add">
          <ProductForm form={addForm} onFinish={handleAddProduct} />
          <div className="text-right mt-4">
            <Button type="primary" onClick={() => addForm.submit()}>
              Add Card
            </Button>
          </div>
        </Panel>
      </Collapse>

      <div className="bg-white rounded-xl mt-5 shadow-md p-6">
        <Table
          columns={columns}
          dataSource={products}
          loading={loading}
          responsive
          scroll={{ x: 1500 }}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </div>

      {/* Add Product Modal */}
      <Modal
        title="Add New Card"
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
            Add Card
          </Button>,
        ]}
      >
        <ProductForm form={addForm} onFinish={handleAddProduct} />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        title="Edit Card"
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
            Update Card
          </Button>,
        ]}
      >
        <ProductForm form={editForm} onFinish={handleEditProduct} initialValues={currentProduct} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Card"
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
            <p>Are you sure you want to delete this card?</p>
            {currentProduct && (
              <p className="font-medium mt-2">
                Card: <span className="text-blue-600">{currentProduct.name}</span>
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