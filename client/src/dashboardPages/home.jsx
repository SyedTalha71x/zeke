/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Table, Tag, Space, Button, Tabs, message } from "antd";
import ReactApexChart from "react-apexcharts";
import {
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { BASE_URL } from "../utils/api";

const DashboardOverview = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalCardPacks: 0
  });
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("line");

  const [cardData, setCardData] = useState([
    {
      title: "Total Users",
      value: "0",
      icon: <UserOutlined />,
      color: "bg-blue-500",
      increase: "+0%",
    },
    {
      title: "Total Card Packs",
      value: "0",
      icon: <ShoppingOutlined />,
      color: "bg-green-500",
      increase: "+0%",
    },
    {
      title: "Total Sales",
      value: "0",
      icon: <ShoppingCartOutlined />,
      color: "bg-purple-500",
      increase: "+0%",
    },
    {
      title: "Total Revenue",
      value: "$0",
      icon: <DollarOutlined />,
      color: "bg-orange-500",
      increase: "+0%",
    },
  ]);

  const salesData = [
    { month: "Jan", sales: 4000, orders: 150 },
    { month: "Feb", sales: 3000, orders: 120 },
    { month: "Mar", sales: 5000, orders: 180 },
    { month: "Apr", sales: 2780, orders: 110 },
    { month: "May", sales: 1890, orders: 90 },
    { month: "Jun", sales: 2390, orders: 100 },
    { month: "Jul", sales: 3490, orders: 130 },
  ];

  const lineChartOptions = {
    chart: {
      height: 350,
      type: "line",
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#4F46E5", "#10B981"],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "10px",
        colors: ["#4F46E5", "#10B981"],
      },
      background: {
        enabled: true,
        foreColor: "#fff",
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: "#4F46E5",
        opacity: 0.9,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    title: {
      text: "Monthly Sales & Orders",
      align: "left",
      style: {
        fontSize: "18px",
        fontWeight: 700,
        fontFamily: "Inter, sans-serif",
        color: "#1F2937",
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 3,
      row: {
        colors: ["transparent", "transparent"],
        opacity: 0.5,
      },
      column: {
        colors: ["#F9FAFB", "transparent"],
        opacity: 0.5,
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    markers: {
      size: 8,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 10,
      },
    },
    xaxis: {
      categories: salesData.map((item) => item.month),
      title: {
        text: "Month",
        style: {
          color: "#6B7280",
          fontWeight: 600,
        },
      },
      labels: {
        style: {
          colors: "#6B7280",
        },
      },
      axisBorder: {
        show: true,
        color: "#E5E7EB",
        strokeWidth: 1,
      },
      axisTicks: {
        show: true,
        borderType: "solid",
        color: "#E5E7EB",
        height: 6,
      },
    },
    yaxis: {
      title: {
        text: "Amount",
        style: {
          color: "#6B7280",
          fontWeight: 600,
        },
      },
      labels: {
        style: {
          colors: "#6B7280",
        },
        formatter: (val) => {
          return val.toLocaleString();
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -30,
      offsetX: -5,
      fontFamily: "Inter, sans-serif",
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
    tooltip: {
      theme: "light",
      marker: {
        show: true,
      },
      x: {
        show: true,
        formatter: (val) => `Month: ${val}`,
      },
      y: {
        formatter: function (val, { seriesIndex }) {
          return seriesIndex === 0
            ? `Sales: $${val.toLocaleString()}`
            : `Orders: ${val.toLocaleString()}`;
        },
      },
    },
  };

  // ApexCharts options for bar chart
  const barChartOptions = {
    ...lineChartOptions,
    chart: {
      ...lineChartOptions.chart,
      type: "bar",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
        dataLabels: {
          position: "top",
        },
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    fill: {
      opacity: 1,
      colors: ["#4F46E5", "#10B981"],
    },
  };

  // Chart series data
  const chartSeries = [
    {
      name: "Sales",
      data: salesData.map((item) => item.sales),
    },
    {
      name: "Orders",
      data: salesData.map((item) => item.orders),
    },
  ];

  // Chart type tabs
  const chartTabs = [
    {
      key: "line",
      label: "Line Chart",
    },
    {
      key: "bar",
      label: "Bar Chart",
    },
  ];

  // Table columns configuration for cards
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      render: (_, record, index) => index + 1,
    },
    {
      title: "Card Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-medium">{text}</span>,
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 250,
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
      title: "Verified",
      key: "isVerified",
      dataIndex: "isVerified",
      width: 120,
      render: (isVerified) => {
        const status = isVerified ? "Verified" : "Not Verified";
        const color = isVerified ? "green" : "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${BASE_URL}/get-analytics`);
        const data = await response.json();
        if (data.success) {
          setAnalytics(data.data);
          setCardData([
            {
              title: "Total Users",
              value: data.data.totalUsers.toString(),
              icon: <UserOutlined />,
              color: "bg-blue-500",
              increase: "+0%",
            },
            {
              title: "Total Card Packs",
              value: data.data.totalCardPacks.toString(),
              icon: <ShoppingOutlined />,
              color: "bg-green-500",
              increase: "+0%",
            },
            {
              title: "Total Sales",
              value: data.data.totalSales.toString(),
              icon: <ShoppingCartOutlined />,
              color: "bg-purple-500",
              increase: "+0%",
            },
            {
              title: "Total Revenue",
              value: data.data.totalRevenue.toString(),
              icon: <DollarOutlined />,
              color: "bg-orange-500",
              increase: "+0%",
            },
          ]);
        }
      } catch (error) {
        message.error('Failed to fetch analytics data');
        console.error('Error fetching analytics:', error);
      }
    };

    const fetchCards = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/get-all-cards`);
        const data = await response.json();
        
        const cardsWithKeys = data.map((card, index) => ({
          ...card,
          key: card._id,
          id: index + 1
        }));
        
        setCards(cardsWithKeys);
        
        // Update stats cards with boxes and price data
        const totalBoxes = data.reduce((sum, card) => sum + card.boxCount, 0);
        const avgPrice = data.length > 0 ? 
          data.reduce((sum, card) => sum + card.price, 0) / data.length : 0;
        
        setCardData(prev => [
          prev[0], // Keep users data
          prev[1], // Keep card packs data
          {
            title: "Total Boxes",
            value: totalBoxes.toLocaleString(),
            icon: <ShoppingCartOutlined />,
            color: "bg-purple-500",
            increase: "+0%",
          },
          {
            title: "Avg. Price",
            value: `$${avgPrice.toFixed(2)}`,
            icon: <DollarOutlined />,
            color: "bg-orange-500",
            increase: "+0%",
          },
        ]);
        
      } catch (error) {
        message.error('Failed to fetch cards data');
        console.error('Error fetching cards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    fetchCards();
  }, []);

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex items-center transition-all duration-500 hover:shadow-lg hover:scale-105"
          >
            <div
              className={`${card.color} text-white p-4 rounded-lg mr-4 flex items-center justify-center shadow-md`}
            >
              <span className="text-xl">{card.icon}</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">{card.title}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              <p className="text-xs text-green-500 font-medium">
                {card.increase} from last month
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="bg-[#FFFFFF] rounded-xl shadow-md p-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Sales Overview
          </h2>
          <Tabs
            items={chartTabs}
            activeKey={chartType}
            onChange={setChartType}
            size="small"
            className="mb-0"
          />
        </div>
        <div className="h-96 overflow-x-auto">
          <div className="min-w-[600px]">
            <ReactApexChart
              options={
                chartType === "line" ? lineChartOptions : barChartOptions
              }
              series={chartSeries}
              type={chartType}
            />
          </div>
        </div>
      </div>

      {/* Cards Table */}
      <div className="bg-[#FFFFFF] rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Trading Cards Inventory</h2>
        </div>
        <Table
          columns={columns}
          dataSource={cards}
          loading={loading}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: 1300 }}
          className="cards-table"
          rowClassName="transition-all hover:bg-gray-50"
        />
      </div>
    </div>
  );
};

export default DashboardOverview;