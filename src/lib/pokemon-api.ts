// Pokemon API types
export interface Pokemon {
  id: number;
  name: string;
  url: string;
  sprites?: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
  types?: Array<{
    type: {
      name: string;
    };
  }>;
  height?: number;
  weight?: number;
  abilities?: Array<{
    ability: {
      name: string;
    };
  }>;
  stats?: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export interface PokemonDetailResponse extends Pokemon {
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
}

const BASE_URL = 'https://pokeapi.co/api/v2';

// Fetch Pokemon list with pagination
export const fetchPokemonList = async (
  offset: number = 0,
  limit: number = 20
): Promise<PokemonListResponse> => {
  const response = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon list');
  }
  
  return response.json();
};

// Fetch detailed Pokemon information
export const fetchPokemonDetail = async (nameOrId: string | number): Promise<PokemonDetailResponse> => {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon: ${nameOrId}`);
  }
  
  return response.json();
};

// Fetch multiple Pokemon details (for list with images)
export const fetchPokemonListWithDetails = async (
  offset: number = 0,
  limit: number = 20
): Promise<{results: Pokemon[], total: number}> => {
  const listResponse = await fetchPokemonList(offset, limit);
  
  // Fetch detailed info for each Pokemon to get images and types
  const pokemonPromises = listResponse.results.map(async (pokemon) => {
    const detail = await fetchPokemonDetail(pokemon.name);
    return {
      id: detail.id,
      name: detail.name,
      url: pokemon.url,
      sprites: detail.sprites,
      types: detail.types,
      height: detail.height,
      weight: detail.weight,
    };
  });
  
  const results = await Promise.all(pokemonPromises);
  
  return {
    results,
    total: listResponse.count
  };
};

// Fetch all Pokemon names for client-side filtering (first 1000)
export const fetchAllPokemonNames = async (): Promise<Array<{name: string, url: string}>> => {
  const response = await fetch(`${BASE_URL}/pokemon?limit=1000`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon names');
  }
  
  const data: PokemonListResponse = await response.json();
  return data.results;
};

// Search Pokemon with client-side filtering
export const searchPokemonByName = async (
  query: string,
  offset: number = 0,
  limit: number = 20
): Promise<{results: Pokemon[], total: number}> => {
  if (!query.trim()) {
    // If no query, return regular paginated list
    const data = await fetchPokemonListWithDetails(offset, limit);
    return data; // Return the same structure with actual total
  }
  
  // Fetch all Pokemon names for filtering
  const allPokemon = await fetchAllPokemonNames();
  
  // Filter by name (case-insensitive)
  const filteredPokemon = allPokemon.filter(pokemon => 
    pokemon.name.toLowerCase().includes(query.toLowerCase())
  );
  
  // Paginate filtered results
  const paginatedNames = filteredPokemon.slice(offset, offset + limit);

  // Fetch detailed info for paginated results
  const pokemonPromises = paginatedNames.map(async (pokemon) => {
    const detail = await fetchPokemonDetail(pokemon.name);
    return {
      id: detail.id,
      name: detail.name,
      url: pokemon.url,
      sprites: detail.sprites,
      types: detail.types,
      height: detail.height,
      weight: detail.weight,
    };
  });
  
  const results = await Promise.all(pokemonPromises);
  
  return {
    results,
    total: filteredPokemon.length
  };
};
