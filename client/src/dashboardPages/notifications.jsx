/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react"
import { List, Card, Typography, Avatar, Tag, Space, Badge, Input, Select, Button, Row, Col, message as antMessage } from "antd"
import { MailOutlined, MessageOutlined, ClockCircleOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { BASE_URL } from "../utils/api"

dayjs.extend(relativeTime)

const { Title, Text, Paragraph } = Typography
const { Search } = Input
const { Option } = Select

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchText, setSearchText] = useState("")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BASE_URL}/get-notifications`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setNotifications(data)
    } catch (err) {
      setError(err.message)
      antMessage.error('Failed to fetch notifications: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/mark-notification-as-read/${id}`, {
        method: 'post'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
       await response.json()
      
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === id ? { ...notification, isRead: 1 } : notification
        )
      )
      
      antMessage.success('Notification marked as read')
    } catch (err) {
      antMessage.error('Failed to mark notification as read: ' + err.message)
    }
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const filteredNotifications = notifications
    .filter((notification) => {
      if (searchText === "") return true

      return (
        notification.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
        notification.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
        notification.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        notification.message?.toLowerCase().includes(searchText.toLowerCase())
      )
    })
    .filter((notification) => {
      if (filterType === "all") return true
      if (filterType === "recent") {
        return dayjs(notification.createdAt).isAfter(dayjs().subtract(1, 'day'))
      }
      if (filterType === "older") {
        return dayjs(notification.createdAt).isBefore(dayjs().subtract(1, 'day'))
      }
      return true
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <Text>Loading notifications...</Text>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <Text type="danger">{error}</Text>
      </div>
    )
  }

  return (
    <div>
      <Card>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Title level={3} style={{ margin: 0 }}>
              <Badge 
                count={notifications.filter(n => !n.isRead).length} 
                style={{ backgroundColor: "#faad14" }}
              >
                <span style={{ marginRight: 10 }}>User Feedback</span>
              </Badge>
            </Title>
          </Col>
          <Col xs={24} md={12}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={16}>
                <Search
                  placeholder="Search by name, email or message"
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="large"
                  onSearch={(value) => setSearchText(value)}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Col>
              <Col xs={24} md={8}>
                <Select
                  style={{ width: "100%" }}
                  size="large"
                  defaultValue="all"
                  onChange={(value) => setFilterType(value)}
                  suffixIcon={<FilterOutlined />}
                >
                  <Option value="all">All Messages</Option>
                  <Option value="recent">Recent (24h)</Option>
                  <Option value="older">Older</Option>
                  <Option value="unread">Unread</Option>
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>

        <List
          itemLayout="vertical"
          dataSource={filteredNotifications}
          loading={loading}
          renderItem={(item) => (
            <List.Item
              key={item._id}
              style={{
                background: item.isRead ? "#fafafa" : "#fff",
                marginBottom: 16,
                padding: 16,
                borderRadius: 8,
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                borderLeft: item.isRead ? "none" : "3px solid #1890ff",
              }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    size={48}
                    style={{
                      backgroundColor: item.isRead ? "#d9d9d9" : "#1890ff",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {getInitials(item.firstName, item.lastName)}
                  </Avatar>
                }
                title={
                  <Space size={16} style={{ display: "flex", alignItems: "center" }}>
                    <Text strong style={{ fontSize: 16 }}>{`${item.firstName} ${item.lastName}`}</Text>
                    <Tag color={item.isRead ? "default" : "blue"}>{dayjs(item.createdAt).fromNow()}</Tag>
                    {item.isRead ? null : <Tag color="orange">Unread</Tag>}
                  </Space>
                }
                description={
                  <Space direction="vertical" size={4}>
                    <Text type="secondary">
                      <MailOutlined style={{ marginRight: 8 }} />
                      {item.email}
                    </Text>
                    <Text type="secondary">
                      <ClockCircleOutlined style={{ marginRight: 8 }} />
                      {dayjs(item.createdAt).format("MMMM D, YYYY [at] h:mm A")}
                    </Text>
                  </Space>
                }
              />
              <div style={{ marginTop: 16 }}>
                <Paragraph style={{ margin: 0, fontSize: 15 }}>
                  <MessageOutlined style={{ marginRight: 8 }} />
                  {item.message}
                </Paragraph>
              </div>
              <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
                <Space>
                  {!item.isRead && (
                    <Button 
                      size="small" 
                      onClick={() => markAsRead(item._id)}
                      loading={loading}
                    >
                      Mark as Read
                    </Button>
                  )}
                </Space>
              </div>
            </List.Item>
          )}
          locale={{ emptyText: "No notifications found" }}
        />
      </Card>
    </div>
  )
}