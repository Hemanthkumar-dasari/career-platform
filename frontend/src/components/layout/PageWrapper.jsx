import Sidebar from './Sidebar'

export default function PageWrapper({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Fixed sidebar — 256px (w-64) wide */}
      <Sidebar />

      {/* Main content pushed right by sidebar width */}
      <main
        className="flex-1 min-h-screen overflow-y-auto p-6 sm:p-8"
        style={{ marginLeft: '256px' }}
      >
        {children}
      </main>
    </div>
  )
}
