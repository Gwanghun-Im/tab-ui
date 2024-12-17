import TabWithDynamicContent from "@/app/component/tab"

const HomePage = () => {
  const tabs = [
    { id: "tab1", label: "Page 1", path: "page1" }, // src/app/page1/page.tsx
    { id: "tab2", label: "Page 2", path: "page2" }, // src/app/page2/page.tsx
    { id: "tab3", label: "Page 3", path: "page3" }, // src/app/page3/page.tsx
  ]

  return (
    <div>
      <h1>Tab Layout with Dynamic Pages</h1>
      <TabWithDynamicContent tabs={tabs} />
    </div>
  )
}

export default HomePage
