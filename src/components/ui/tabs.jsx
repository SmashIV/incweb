import React, { useState, createContext, useContext } from "react";

const TabsContext = createContext();

export function Tabs({ children, defaultValue }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="space-y-4">{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = "" }) {
  return <div className={`flex space-x-4 ${className}`}>{children}</div>;
}

export function TabsTrigger({ value, children, className = "" }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = value === activeTab;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`py-2 px-4 text-sm font-medium rounded-md ${
        isActive ? "bg-black text-white" : "bg-gray-100 text-gray-700"
      } ${className}`}
      data-active={isActive ? "true" : "false"}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }) {
  const { activeTab } = useContext(TabsContext);
  return value === activeTab ? <div>{children}</div> : null;
}