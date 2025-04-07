/* eslint-disable no-unused-vars */
import { Sidebar, Menu, MenuItem, SubMenu, ProSidebarProvider, useProSidebar } from "react-pro-sidebar"
import { Link } from "react-router-dom"
import { LayoutDashboard, ShoppingBag, Users, Settings, MenuIcon, X } from "lucide-react"

// Custom styles to override default hover behavior
const menuStyles = {
  backgroundColor: "#1f2937",
  color: "white",
}

const menuItemStyles = {
  button: {
    "&:hover": {
      backgroundColor: "#374151", // Dark gray hover instead of white
      color: "white",
    },
    "&.ps-active": {
      backgroundColor: "#374151",
    },
  },
  root: {
    fontSize: "0.875rem",
  },
  icon: {
    color: "white",
  },
  SubMenuContent: {
    backgroundColor: "#1f2937",
  },
  subMenuContent: {
    backgroundColor: "#1f2937",
  },
}

const SidebarContent = () => {
  const { collapseSidebar, collapsed, toggleSidebar, broken } = useProSidebar()

  const menuItems = [
    {
      icon: <LayoutDashboard />,
      label: "Overview",
      path: "/dashboard/overview",
    },
    {
      icon: <ShoppingBag />,
      label: "Products",
      children: [
        {
          label: "Product Configuration",
          path: "/dashboard/product-configuration",
          icon: <Settings className="w-4 h-4" />,
        },
      ],
    },
    {
      icon: <Users />,
      label: "Users",
      children: [
        {
          label: "User Configuration",
          path: "/dashboard/user-configuration",
          icon: <Settings className="w-4 h-4" />,
        },
        // {
        //   label: "All Users",
        //   path: "/dashboard/all-users",
        //   icon: <Users className="w-4 h-4" />,
        // },
      ],
    },
  ]

  const renderMenuItem = (item) => {
    if (item.children) {
      return (
        <SubMenu
          key={item.label}
          label={item.label}
          icon={item.icon}
          rootStyles={{
            backgroundColor: "#1f2937",
            color: "white",
          }}
          className="text-white"
        >
          {item.children.map((child) => (
            <MenuItem
              key={child.label}
              icon={child.icon}
              component={<Link to={child.path} />}
              rootStyles={{
                backgroundColor: "#1f2937",
                color: "white",
              }}
              className="text-white"
            >
              {child.label}
            </MenuItem>
          ))}
        </SubMenu>
      )
    }
    return (
      <MenuItem
        key={item.label}
        icon={item.icon}
        component={<Link to={item.path} />}
        rootStyles={{
          backgroundColor: "#1f2937",
          color: "white",
        }}
        className="text-white"
      >
        {item.label}
      </MenuItem>
    )
  }

  const SmallScreenHamburger = () => (
    <button
      className="fixed top-2 left-2 z-50 text-gray-700 bg-white p-2 rounded-full shadow-lg md:hidden"
      onClick={() => toggleSidebar()}
    >
      <MenuIcon size={24} />
    </button>
  )

  return (
    <>
      {/* Small Screen Hamburger */}
      <SmallScreenHamburger />

      <Sidebar
        breakPoint="md"
        backgroundColor="#1f2937"
        className="h-full fixed top-0 left-0 z-40"
        rootStyles={{
          border: "none",
        }}
      >
        {broken && (
          <div className="flex justify-end p-4">
            <button className="text-white hover:bg-gray-700 p-2 rounded-full" onClick={() => toggleSidebar()}>
              <X size={24} />
            </button>
          </div>
        )}

        <Menu className="mt-20 text-white text-sm" menuItemStyles={menuItemStyles} rootStyles={menuStyles}>
          {menuItems.map(renderMenuItem)}
        </Menu>
      </Sidebar>

      {/* {broken && <div className="fixed inset-0 bg-black/50 z-30" onClick={() => toggleSidebar()} />} */}
    </>
  )
}

const AppSidebar = () => {
  return (
    <ProSidebarProvider>
      <SidebarContent />
    </ProSidebarProvider>
  )
}

export default AppSidebar

