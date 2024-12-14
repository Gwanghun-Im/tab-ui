/** @format */

"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"

interface TabWithDynamicContentProps {
  tabs: { id: string; label: string; path: string }[]
}

const TabWithDynamicContent: React.FC<TabWithDynamicContentProps> = ({
  tabs,
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id)

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
  }

  const getContentComponent = (path: string) =>
    dynamic(() => import(`../../app/${path}/page`), { ssr: false })

  return (
    <div>
      {/* 탭 헤더 */}
      <div style={{ display: "flex", borderBottom: "1px solid #ddd" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              borderBottom: activeTab === tab.id ? "2px solid blue" : "none",
              background: "none",
              outline: "none",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <div style={{ padding: "20px" }}>
        {tabs.map(
          (tab) =>
            tab.id === activeTab && (
              <div key={tab.id}>
                {React.createElement(getContentComponent(tab.path))}
              </div>
            )
        )}
      </div>
    </div>
  )
}

export default TabWithDynamicContent
