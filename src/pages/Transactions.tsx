import Navbar from '../components/Navbar'

export default function Transactions() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 p-8">
        <h2 className="text-xl font-medium text-gray-900">Transacciones</h2>
      </main>
    </div>
  )
}