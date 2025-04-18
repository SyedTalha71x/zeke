/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { Table, Button, Form, Input, InputNumber, Modal, message, Upload, Space, Tag, Collapse, Select, Tabs } from "antd"
import { EditOutlined, DeleteOutlined, UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import { BASE_URL } from "../utils/api"
import toast, { Toaster } from "react-hot-toast";

const { Panel } = Collapse;
const { TabPane } = Tabs;

const ProductsManagement = () => {
  // State for both cards and card packs
  const [cards, setCards] = useState([]);
  const [cardPacks, setCardPacks] = useState([]);
  const [loading, setLoading] = useState({
    cards: true,
    cardPacks: true
  });
  const [activeTab, setActiveTab] = useState("cards");
  
  // Form and modal states
  const [cardForm] = Form.useForm();
  const [cardPackForm] = Form.useForm();
  const [editCardForm] = Form.useForm();
  const [editCardPackForm] = Form.useForm();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [modalType, setModalType] = useState(""); // 'card' or 'cardPack'

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === "cards") {
      fetchCards();
    } else {
      fetchCardPacks();
    }
  }, [activeTab]);

  const fetchCards = async () => {
    try {
      setLoading(prev => ({ ...prev, cards: true }));
      const response = await fetch(`${BASE_URL}/get-all-cards`);
      const data = await response.json();
      const cardsWithKeys = data.map((card, index) => ({
        ...card,
        key: card._id,
        id: index + 1
      }));
      setCards(cardsWithKeys);
    } catch (error) {
      message.error('Failed to fetch cards');
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(prev => ({ ...prev, cards: false }));
    }
  };

  const fetchCardPacks = async () => {
    try {
      setLoading(prev => ({ ...prev, cardPacks: true }));
      const response = await fetch(`${BASE_URL}/get-all-card-pack`);
      const data = await response.json();
      const packsWithKeys = data.map((pack, index) => ({
        ...pack,
        key: pack._id,
        id: index + 1
      }));
      setCardPacks(packsWithKeys);
    } catch (error) {
      message.error('Failed to fetch card packs');
      console.error('Error fetching card packs:', error);
    } finally {
      setLoading(prev => ({ ...prev, cardPacks: false }));
    }
  };

  // Common form item props
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // Card Operations
  const handleAddCard = async (values) => {
    try {
      setAddLoading(true);
      
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('tier', values.tier);
      formData.append('rarity', values.rarity);
      formData.append('cardPackId', values.cardPackId);
      
      if (values.image && values.image[0]?.originFileObj) {
        formData.append('image', values.image[0].originFileObj);
      } else {
        message.error("Please upload an image for the card");
        setAddLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/create-card`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to add card');
      }

      const newCard = {
        ...result.card,
        key: result.card._id,
        id: cards.length + 1
      };

      setCards([...cards, newCard]);
      cardForm.resetFields();
      toast.success("Card added successfully");
    } catch (error) {
      toast.error(error.message || "Failed to add card");
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditCard = async (values) => {
    try {
      setAddLoading(true);
      
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('tier', values.tier);
      formData.append('rarity', values.rarity);
      formData.append('cardPackId', values.cardPackId);
      
      if (values.image && values.image[0]?.originFileObj) {
        formData.append('image', values.image[0].originFileObj);
      }

      const response = await fetch(`${BASE_URL}/update-card/${currentItem._id}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update card');
      }

      const updatedCards = cards.map((card) =>
        card.key === currentItem.key
          ? {
              ...card,
              ...result.card,
              imageUrl: result.card.imageUrl || card.imageUrl 
            }
          : card
      );

      setCards(updatedCards);
      setIsEditModalVisible(false);
      toast.success("Card updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update card");
      console.error('Error updating card:', error);
    } finally {
      setAddLoading(false);
    }
  };

  // Card Pack Operations
  const handleAddCardPack = async (values) => {
    try {
      setAddLoading(true);
      
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('boxCount', values.boxCount);
      formData.append('cardsAvailable', values.cardsAvailable);
      formData.append('price', values.price);
      formData.append('category', values.category || 'default');
      formData.append('inStock', values.inStock !== undefined ? values.inStock : true);
      formData.append('tier1CardsCount', values.tier1CardsCount || 0);
      formData.append('tier2CardsCount', values.tier2CardsCount || 0);
      
      if (values.image && values.image[0]?.originFileObj) {
        formData.append('image', values.image[0].originFileObj);
      } else {
        message.error("Please upload an image for the card pack");
        setAddLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/create-card-pack`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to add card pack');
      }

      const newCardPack = {
        ...result.cardPack,
        key: result.cardPack._id,
        id: cardPacks.length + 1
      };

      setCardPacks([...cardPacks, newCardPack]);
      cardPackForm.resetFields();
      toast.success("Card pack added successfully");
    } catch (error) {
      toast.error(error.message || "Failed to add card pack");
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditCardPack = async (values) => {
    try {
      setAddLoading(true);
      
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('boxCount', values.boxCount);
      formData.append('cardsAvailable', values.cardsAvailable);
      formData.append('price', values.price);
      formData.append('category', values.category || 'default');
      formData.append('inStock', values.inStock !== undefined ? values.inStock : true);
      formData.append('tier1CardsCount', values.tier1CardsCount || 0);
      formData.append('tier2CardsCount', values.tier2CardsCount || 0);
      
      if (values.image && values.image[0]?.originFileObj) {
        formData.append('image', values.image[0].originFileObj);
      }

      const response = await fetch(`${BASE_URL}/update-card-pack/${currentItem._id}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update card pack');
      }

      const updatedCardPacks = cardPacks.map((pack) =>
        pack.key === currentItem.key
          ? {
              ...pack,
              ...result.cardPack,
              imageUrl: result.cardPack.imageUrl || pack.imageUrl 
            }
          : pack
      );

      setCardPacks(updatedCardPacks);
      setIsEditModalVisible(false);
      toast.success("Card pack updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update card pack");
      console.error('Error updating card pack:', error);
    } finally {
      setAddLoading(false);
    }
  };

  // Common Delete Operation
  const showDeleteModal = (record, type) => {
    setCurrentItem(record);
    setModalType(type);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteItem = async () => {
    try {
      const endpoint = modalType === 'card' 
        ? `${BASE_URL}/delete-card/${currentItem._id}`
        : `${BASE_URL}/delete-card-pack/${currentItem._id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete ${modalType}`);
      }
      
      if (modalType === 'card') {
        setCards(cards.filter((card) => card.key !== currentItem.key));
      } else {
        setCardPacks(cardPacks.filter((pack) => pack.key !== currentItem.key));
      }
      
      setIsDeleteModalVisible(false);
      toast.success(`${modalType === 'card' ? 'Card' : 'Card pack'} deleted successfully`);
    } catch (error) {
      toast.error(error.message || `Failed to delete ${modalType}`);
      console.error(`Error deleting ${modalType}:`, error);
    }
  };

  // Edit functions
  const editCard = (record) => {
    setCurrentItem(record);
    setModalType('card');
    editCardForm.setFieldsValue({
      name: record.name,
      description: record.description,
      tier: record.tier,
      rarity: record.rarity,
      cardPackId: record.cardPack?._id || record.cardPack,
      image: record.imageUrl ? [{
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: `${BASE_URL}${record.imageUrl}`
      }] : undefined
    });
    setIsEditModalVisible(true);
  };

  const editCardPack = (record) => {
    setCurrentItem(record);
    setModalType('cardPack');
    editCardPackForm.setFieldsValue({
      name: record.name,
      description: record.description,
      boxCount: record.boxCount,
      cardsAvailable: record.cardsAvailable,
      price: record.price,
      category: record.category,
      inStock: record.inStock,
      tier1CardsCount: record.tier1CardsCount,
      tier2CardsCount: record.tier2CardsCount,
      image: record.imageUrl ? [{
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: `${BASE_URL}${record.imageUrl}`
      }] : undefined
    });
    setIsEditModalVisible(true);
  };

  // Columns for tables
  const cardColumns = [
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
      title: "Tier",
      dataIndex: "tier",
      key: "tier",
      width: 100,
      render: (tier) => <Tag color={tier === 1 ? 'gold' : 'blue'}>Tier {tier}</Tag>,
    },
    {
      title: "Rarity",
      dataIndex: "rarity",
      key: "rarity",
      width: 120,
      render: (rarity) => {
        const colors = {
          common: 'gray',
          uncommon: 'green',
          rare: 'blue',
          epic: 'purple',
          legendary: 'gold'
        };
        return <Tag color={colors[rarity] || 'gray'}>{rarity}</Tag>;
      },
    },
    {
      title: "Pack",
      dataIndex: ["cardPack", "name"],
      key: "cardPack",
      width: 200,
      render: (name, record) => name || record.cardPack || 'N/A',
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => editCard(record)} type="primary" ghost size="small">
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => showDeleteModal(record, 'card')}
            type="primary"
            danger
            size="small"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const cardPackColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Pack Name",
      dataIndex: "name",
      key: "name",
      width: 200,
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
      title: "Tier 1 Cards",
      dataIndex: "tier1CardsCount",
      key: "tier1CardsCount",
      width: 120,
    },
    {
      title: "Tier 2 Cards",
      dataIndex: "tier2CardsCount",
      key: "tier2CardsCount",
      width: 120,
    },
    {
      title: "Status",
      key: "inStock",
      dataIndex: "inStock",
      width: 120,
      render: (inStock) => {
        const status = inStock ? "In Stock" : "Out of Stock";
        const color = inStock ? "green" : "red";
        return <Tag color={color}>{status}</Tag>;
      },
      filters: [
        { text: 'In Stock', value: true },
        { text: 'Out of Stock', value: false },
      ],
      onFilter: (value, record) => record.inStock === value,
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => editCardPack(record)} type="primary" ghost size="small">
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => showDeleteModal(record, 'cardPack')}
            type="primary"
            danger
            size="small"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Form components
  const CardForm = ({ form, onFinish, initialValues = {}, loading = false }) => {
    const [packs, setPacks] = useState([]);
    const [packsLoading, setPacksLoading] = useState(false);

    useEffect(() => {
      const fetchPacks = async () => {
        try {
          setPacksLoading(true);
          const response = await fetch(`${BASE_URL}/get-all-card-pack`);
          const data = await response.json();
          setPacks(data);
        } catch (error) {
          console.error('Error fetching packs:', error);
        } finally {
          setPacksLoading(false);
        }
      };
      fetchPacks();
    }, []);

    return (
      <Form form={form} layout="vertical" initialValues={initialValues} onFinish={onFinish}>
        <Form.Item name="name" label="Card Name" rules={[{ required: true, message: "Please input card name" }]}>
          <Input placeholder="Enter card name" />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input description" }]}>
          <Input.TextArea placeholder="Enter card description" rows={4} />
        </Form.Item>

        <Form.Item name="tier" label="Tier" rules={[{ required: true, message: "Please select tier" }]}>
          <Select placeholder="Select tier">
            <Select.Option value={1}>Tier 1 (Premium)</Select.Option>
            <Select.Option value={2}>Tier 2 (Standard)</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="rarity" label="Rarity" rules={[{ required: true, message: "Please select rarity" }]}>
          <Select placeholder="Select rarity">
            <Select.Option value="common">Common</Select.Option>
            <Select.Option value="uncommon">Uncommon</Select.Option>
            <Select.Option value="rare">Rare</Select.Option>
            <Select.Option value="epic">Epic</Select.Option>
            <Select.Option value="legendary">Legendary</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="cardPackId" label="Card Pack" rules={[{ required: true, message: "Please select card pack" }]}>
          <Select 
            placeholder="Select card pack"
            loading={packsLoading}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {packs.map(pack => (
              <Select.Option key={pack._id} value={pack._id}>
                {pack.name}
              </Select.Option>
            ))}
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
    );
  };

  const CardPackForm = ({ form, onFinish, initialValues = {}, loading = false }) => {
    return (
      <Form form={form} layout="vertical" initialValues={initialValues} onFinish={onFinish}>
        <Form.Item name="name" label="Pack Name" rules={[{ required: true, message: "Please input pack name" }]}>
          <Input placeholder="Enter pack name" />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input description" }]}>
          <Input.TextArea placeholder="Enter pack description" rows={4} />
        </Form.Item>

        <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please input pack price" }]}>
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
          label="Total Cards Available"
          rules={[{ required: true, message: "Please input cards available" }]}
        >
          <InputNumber min={0} placeholder="Enter total cards" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="tier1CardsCount"
          label="Tier 1 Cards Count"
          rules={[{ required: true, message: "Please input tier 1 cards count" }]}
        >
          <InputNumber min={0} placeholder="Enter tier 1 cards" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="tier2CardsCount"
          label="Tier 2 Cards Count"
          rules={[{ required: true, message: "Please input tier 2 cards count" }]}
        >
          <InputNumber min={0} placeholder="Enter tier 2 cards" style={{ width: "100%" }} />
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
          label="Pack Image" 
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
    );
  };

  return (
    <> 
      <Toaster position="top-right" />
      <div className="md:p-6 p-3 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mt-5">Trading Cards Management</h1>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Cards" key="cards">
            <Collapse accordion className="mb-6">
              <Panel header="Add New Card" key="add-card">
                <CardForm form={cardForm} onFinish={handleAddCard} loading={addLoading} />
                <div className="text-right mt-4">
                  <Button type="primary" onClick={() => cardForm.submit()} loading={addLoading}>
                    Add Card
                  </Button>
                </div>
              </Panel>
            </Collapse>

            <div className="bg-white rounded-xl mt-5 shadow-md p-6">
              <Table
                columns={cardColumns}
                dataSource={cards}
                loading={loading.cards}
                responsive
                scroll={{ x: 1500 }}
                pagination={{
                  pageSize: 5,
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
              />
            </div>
          </TabPane>

          <TabPane tab="Card Packs" key="cardPacks">
            <Collapse accordion className="mb-6">
              <Panel header="Add New Card Pack" key="add-card-pack">
                <CardPackForm form={cardPackForm} onFinish={handleAddCardPack} loading={addLoading} />
                <div className="text-right mt-4">
                  <Button type="primary" onClick={() => cardPackForm.submit()} loading={addLoading}>
                    Add Card Pack
                  </Button>
                </div>
              </Panel>
            </Collapse>

            <div className="bg-white rounded-xl mt-5 shadow-md p-6">
              <Table
                columns={cardPackColumns}
                dataSource={cardPacks}
                loading={loading.cardPacks}
                responsive
                scroll={{ x: 1500 }}
                pagination={{
                  pageSize: 5,
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
              />
            </div>
          </TabPane>
        </Tabs>

        {/* Edit Modal */}
        <Modal
          title={`Edit ${modalType === 'card' ? 'Card' : 'Card Pack'}`}
          open={isEditModalVisible}
          onCancel={() => {
            setIsEditModalVisible(false);
            modalType === 'card' ? editCardForm.resetFields() : editCardPackForm.resetFields();
          }}
          footer={[
            <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>
              Cancel
            </Button>,
            <Button 
              key="submit" 
              type="primary" 
              onClick={() => modalType === 'card' ? editCardForm.submit() : editCardPackForm.submit()} 
              loading={addLoading}
            >
              Update {modalType === 'card' ? 'Card' : 'Card Pack'}
            </Button>,
          ]}
          width={800}
        >
          {modalType === 'card' ? (
            <CardForm form={editCardForm} onFinish={handleEditCard} initialValues={currentItem} />
          ) : (
            <CardPackForm form={editCardPackForm} onFinish={handleEditCardPack} initialValues={currentItem} />
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          title={`Delete ${modalType === 'card' ? 'Card' : 'Card Pack'}`}
          open={isDeleteModalVisible}
          onCancel={() => setIsDeleteModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsDeleteModalVisible(false)}>
              Cancel
            </Button>,
            <Button key="delete" type="primary" danger onClick={handleDeleteItem}>
              Delete
            </Button>,
          ]}
        >
          <div className="flex items-center">
            <ExclamationCircleOutlined style={{ color: "#ff4d4f", fontSize: "22px", marginRight: "16px" }} />
            <div>
              <p>Are you sure you want to delete this {modalType}?</p>
              {currentItem && (
                <p className="font-medium mt-2">
                  {modalType === 'card' ? 'Card' : 'Pack'}: <span className="text-blue-600">{currentItem.name}</span>
                </p>
              )}
              <p className="text-gray-500 mt-2">This action cannot be undone.</p>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ProductsManagement;