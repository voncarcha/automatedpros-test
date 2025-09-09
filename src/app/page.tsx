import { Suspense } from "react";
import PokemonList from "@/components/pokemon-list";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      }>
        <PokemonList />
      </Suspense>
    </main>
  );
}
