/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { Table, Button, Form, Input, InputNumber, Modal, message, Upload, Space, Tag, Collapse, Select } from "antd"
import { EditOutlined, DeleteOutlined, UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import { BASE_URL } from "../utils/api"
import toast, { Toaster } from "react-hot-toast";

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
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [addLoading, setAddLoading] = useState(false)

  const handleAddProduct = async (values) => {
    try {
      setAddLoading(true)
      
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('description', values.description)
      formData.append('boxCount', values.boxCount)
      formData.append('cardsAvailable', values.cardsAvailable)
      formData.append('price', values.price)
      formData.append('category', values.category || 'default')
      formData.append('inStock', values.inStock !== undefined ? values.inStock : true)
      
      // Append the image file
      if (values.image && values.image[0]?.originFileObj) {
        formData.append('image', values.image[0].originFileObj)
      } else {
        message.error("Please upload an image for the card")
        setAddLoading(false)
        return 
      }

      const response = await fetch(`${BASE_URL}/create-card`, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to add card')
      }

      const newProduct = {
        ...result.cardPack,
        key: result.cardPack._id,
        id: products.length + 1
      }

      setProducts([...products, newProduct])
      addForm.resetFields()
      toast.success("Card added successfully")
    } catch (error) {
      toast.error(error.message || "Failed to add card")
    } finally {
      setAddLoading(false)
    }
  }

  const handleEditProduct = async (values) => {
    try {
      setAddLoading(true)
      
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('description', values.description)
      formData.append('boxCount', values.boxCount)
      formData.append('cardsAvailable', values.cardsAvailable)
      formData.append('price', values.price)
      formData.append('category', values.category || 'default')
      formData.append('inStock', values.inStock !== undefined ? values.inStock : true)
      
      if (values.image && values.image[0]?.originFileObj) {
        formData.append('image', values.image[0].originFileObj)
      }

      const response = await fetch(`${BASE_URL}/update-card/${currentProduct._id}`, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update card')
      }

      const updatedProducts = products.map((product) =>
        product.key === currentProduct.key
          ? {
              ...product,
              ...result.cardPack,
              imageUrl: result.cardPack.imageUrl || product.imageUrl 
            }
          : product
      )

      setProducts(updatedProducts)
      setIsEditModalVisible(false)
      toast.success("Card updated successfully")
    } catch (error) {
      toast.error(error.message || "Failed to update card")
      console.error('Error updating card:', error)
    } finally {
      setAddLoading(false)
    }
  }

  const showDeleteModal = (record) => {
    setCurrentProduct(record)
    setIsDeleteModalVisible(true)
  }

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(`${BASE_URL}/delete-card/${currentProduct._id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete card')
      }
      
      setProducts(products.filter((product) => product.key !== currentProduct.key))
      setIsDeleteModalVisible(false)
      toast.success("Card deleted successfully")
    } catch (error) {
      toast.error(error.message || "Failed to delete card")
      console.error('Error deleting card:', error)
    }
  }

  const editProduct = (record) => {
    setCurrentProduct(record)
    editForm.setFieldsValue({
      name: record.name,
      description: record.description,
      boxCount: record.boxCount,
      cardsAvailable: record.cardsAvailable,
      price: record.price,
      category: record.category,
      inStock: record.inStock,
      image: record.imageUrl ? [{
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: `${BASE_URL}${record.imageUrl}`
      }] : undefined
    })
    setIsEditModalVisible(true)
  }

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

  const ProductForm = ({ form, onFinish, initialValues = {}, loading = false }) => {
    const normFile = (e) => {
      if (Array.isArray(e)) {
        return e
      }
      return e?.fileList
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

        <Form.Item name="category" label="Category">
          <Select placeholder="Select category">
            <Select.Option value="sports">Sports</Select.Option>
            <Select.Option value="fantasy">Fantasy</Select.Option>
            <Select.Option value="collectible">Collectible</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="inStock" label="In Stock" initialValue={true}>
          <Select>
            <Select.Option value={true}>In Stock</Select.Option>
            <Select.Option value={false}>Out of Stock</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item 
          name="image" 
          label="Card Image" 
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: !initialValues._id, message: "Please upload an image" }]}
        >
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            maxCount={1}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>
      </Form>
    )
  }

  return (
    <> 
    <Toaster position="top-right" />
    <div className="md:p-6 p-3 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800  mt-5">Cards Management</h1>
      </div>

      <Collapse accordion className="mb-6">
        <Panel header="Add New Card" key="add">
          <ProductForm form={addForm} onFinish={handleAddProduct} loading={addLoading} />
          <div className="text-right mt-4">
            <Button type="primary" onClick={() => addForm.submit()} loading={addLoading}>
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
          <Button key="submit" type="primary" onClick={() => editForm.submit()} loading={addLoading}>
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
    </>
  )
}

export default ProductsManagement