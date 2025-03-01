// src/app/page.tsx
import StorageInteraction from '../app/components/StorageInteraction';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <StorageInteraction />
    </main>
  )
}