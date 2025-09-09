// import { Suspense } from "react";
import PokemonList from "@/components/pokemon-list";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <PokemonList />
      {/* </Suspense> */}
    </main>
  );
}
