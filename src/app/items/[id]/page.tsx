"use client";

import { usePokemonDetail } from "@/hooks/usePokemon";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: pokemon, isLoading, error } = usePokemonDetail(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading Pokemon details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Pokemon Not Found
            </h2>
            <p className="text-gray-600">
              Could not find Pokemon with ID: {id}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = pokemon.sprites?.other?.["official-artwork"]?.front_default || 
                   pokemon.sprites?.front_default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button 
          onClick={() => router.back()} 
          variant="outline" 
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>

        {/* Main Pokemon Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold capitalize">{pokemon.name}</h1>
                <p className="text-blue-100 text-lg">#{pokemon.id.toString().padStart(3, '0')}</p>
              </div>
              <div className="text-right">
                <div className="flex gap-2 flex-wrap justify-end">
                  {pokemon.types?.map((type, index) => (
                    <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/30">
                      {type.type.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image Section */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 shadow-inner">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={pokemon.name}
                      width={300}
                      height={300}
                      className="drop-shadow-lg"
                    />
                  ) : (
                    <div className="w-[300px] h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">No Image Available</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats and Info Section */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-gray-800">Basic Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-sm text-gray-600">Height</span>
                      <p className="font-semibold">{pokemon.height ? `${pokemon.height / 10} m` : 'Unknown'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-sm text-gray-600">Weight</span>
                      <p className="font-semibold">{pokemon.weight ? `${pokemon.weight / 10} kg` : 'Unknown'}</p>
                    </div>
                  </div>
                </div>

                {/* Abilities */}
                {pokemon.abilities && pokemon.abilities.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3 text-gray-800">Abilities</h2>
                    <div className="flex flex-wrap gap-2">
                      {pokemon.abilities.map((ability, index) => (
                        <Badge key={index} variant="outline" className="capitalize">
                          {ability.ability.name.replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                {pokemon.stats && pokemon.stats.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3 text-gray-800">Base Stats</h2>
                    <div className="space-y-3">
                      {pokemon.stats.map((stat, index) => {
                        const percentage = Math.min((stat.base_stat / 150) * 100, 100);
                        return (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="capitalize font-medium">
                                {stat.stat.name.replace('-', ' ')}
                              </span>
                              <span className="font-semibold">{stat.base_stat}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
