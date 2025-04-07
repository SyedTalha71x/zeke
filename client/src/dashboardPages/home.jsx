/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Table, Tag, Space, Button, Tabs } from "antd";
import ReactApexChart from "react-apexcharts";
import {
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const DashboardOverview = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("line");

  // Mock data for the cards
  const cardData = [
    {
      title: "Total Sales",
      value: "$24,780",
      icon: <DollarOutlined />,
      color: "bg-blue-500",
      increase: "+12.5%",
    },
    {
      title: "Total Products",
      value: "124",
      icon: <ShoppingOutlined />,
      color: "bg-green-500",
      increase: "+3.2%",
    },
    {
      title: "Total Customers",
      value: "843",
      icon: <UserOutlined />,
      color: "bg-purple-500",
      increase: "+18.7%",
    },
    {
      title: "Total Orders",
      value: "432",
      icon: <ShoppingCartOutlined />,
      color: "bg-orange-500",
      increase: "+7.4%",
    },
  ];

  // Mock data for the chart
  const salesData = [
    { month: "Jan", sales: 4000, orders: 150 },
    { month: "Feb", sales: 3000, orders: 120 },
    { month: "Mar", sales: 5000, orders: 180 },
    { month: "Apr", sales: 2780, orders: 110 },
    { month: "May", sales: 1890, orders: 90 },
    { month: "Jun", sales: 2390, orders: 100 },
    { month: "Jul", sales: 3490, orders: 130 },
  ];

  // ApexCharts options for line chart
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

  // Mock data for the products table
  const mockProducts = [
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
    {
      key: "2",
      id: 2,
      name: "Smartphone Case",
      category: "Accessories",
      price: 24.99,
      stock: 120,
      status: "In Stock",
      sales: 350,
      rating: 4.2,
    },
    {
      key: "3",
      id: 3,
      name: "Laptop Backpack",
      category: "Bags",
      price: 59.99,
      stock: 18,
      status: "Low Stock",
      sales: 75,
      rating: 4.7,
    },
    {
      key: "4",
      id: 4,
      name: "Bluetooth Speaker",
      category: "Electronics",
      price: 79.99,
      stock: 0,
      status: "Out of Stock",
      sales: 200,
      rating: 4.3,
    },
    {
      key: "5",
      id: 5,
      name: "Fitness Tracker",
      category: "Wearables",
      price: 89.99,
      stock: 32,
      status: "In Stock",
      sales: 180,
      rating: 4.6,
    },
    {
      key: "6",
      id: 6,
      name: "Wireless Earbuds",
      category: "Electronics",
      price: 99.99,
      stock: 25,
      status: "In Stock",
      sales: 220,
      rating: 4.8,
    },
    {
      key: "7",
      id: 7,
      name: "Smart Watch",
      category: "Wearables",
      price: 199.99,
      stock: 15,
      status: "Low Stock",
      sales: 95,
      rating: 4.4,
    },
  ];

  // Table columns configuration
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
      render: (text) => <a>{text}</a>,
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
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      width: 100,
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Sales",
      dataIndex: "sales",
      key: "sales",
      width: 100,
      sorter: (a, b) => a.sales - b.sales,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 100,
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      width: 150,
      render: (status) => {
        let color = "green";
        if (status === "Out of Stock") {
          color = "red";
        } else if (status === "Low Stock") {
          color = "orange";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   fixed: "right",
    //   width: 150,
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <Button type="primary" size="small" ghost>
    //         Edit
    //       </Button>
    //       <Button type="primary" size="small" danger>
    //         Delete
    //       </Button>
    //     </Space>
    //   ),
    // },
  ];

  // Simulate fetching products
  useEffect(() => {
    const fetchProducts = () => {
      // Simulate API call
      setTimeout(() => {
        setProducts(mockProducts);
        setLoading(false);
      }, 1000);
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6  text-gray-800">
        Dashboard Overview
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
            {" "}
            {/* Adjust min-width as needed */}
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

      {/* Products Table */}
      <div className="bg-[#FFFFFF] rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Products List</h2>
        </div>
        <Table
          columns={columns}
          dataSource={products}
          loading={loading}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: 1300 }}
          className="product-table"
          rowClassName="transition-all hover:bg-gray-50"
        />
      </div>
    </div>
  );
};

export default DashboardOverview;
