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

// Pokemon Type interface
export interface PokemonType {
  name: string;
  url: string;
}

export interface PokemonTypeResponse {
  count: number;
  results: PokemonType[];
}

export interface PokemonTypeDetail {
  name: string;
  pokemon: Array<{
    pokemon: {
      name: string;
      url: string;
    };
  }>;
}

// Fetch all Pokemon types
export const fetchPokemonTypes = async (): Promise<PokemonType[]> => {
  const response = await fetch(`${BASE_URL}/type`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon types');
  }
  
  const data: PokemonTypeResponse = await response.json();
  return data.results;
};

// Fetch Pokemon by type
export const fetchPokemonByType = async (typeName: string): Promise<string[]> => {
  const response = await fetch(`${BASE_URL}/type/${typeName}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon of type: ${typeName}`);
  }
  
  const data: PokemonTypeDetail = await response.json();
  return data.pokemon.map(p => p.pokemon.name);
};

// Search Pokemon with client-side filtering by name and types
export const searchPokemonByNameAndTypes = async (
  query: string = "",
  selectedTypes: string[] = [],
  offset: number = 0,
  limit: number = 20
): Promise<{results: Pokemon[], total: number}> => {
  // If no query and no types selected, return regular paginated list
  if (!query.trim() && selectedTypes.length === 0) {
    const data = await fetchPokemonListWithDetails(offset, limit);
    return data;
  }
  
  let filteredPokemonNames: string[] = [];
  
  if (selectedTypes.length > 0) {
    // Fetch Pokemon for each selected type
    const typePromises = selectedTypes.map(type => fetchPokemonByType(type));
    const typePokemonArrays = await Promise.all(typePromises);
    
    // Find intersection of Pokemon that have ALL selected types
    if (typePokemonArrays.length === 1) {
      filteredPokemonNames = typePokemonArrays[0];
    } else {
      // Find Pokemon that appear in all type arrays (intersection)
      filteredPokemonNames = typePokemonArrays.reduce((acc, curr) => 
        acc.filter(pokemon => curr.includes(pokemon))
      );
    }
  } else {
    // If no types selected, get all Pokemon names
    const allPokemon = await fetchAllPokemonNames();
    filteredPokemonNames = allPokemon.map(p => p.name);
  }
  
  // Filter by name if query provided
  if (query.trim()) {
    filteredPokemonNames = filteredPokemonNames.filter(name => 
      name.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  // Paginate filtered results
  const paginatedNames = filteredPokemonNames.slice(offset, offset + limit);

  // Fetch detailed info for paginated results
  const pokemonPromises = paginatedNames.map(async (name) => {
    const detail = await fetchPokemonDetail(name);
    return {
      id: detail.id,
      name: detail.name,
      url: `${BASE_URL}/pokemon/${detail.id}/`,
      sprites: detail.sprites,
      types: detail.types,
      height: detail.height,
      weight: detail.weight,
    };
  });
  
  const results = await Promise.all(pokemonPromises);
  
  return {
    results,
    total: filteredPokemonNames.length
  };
};

// Keep the old function for backward compatibility
export const searchPokemonByName = async (
  query: string,
  offset: number = 0,
  limit: number = 20
): Promise<{results: Pokemon[], total: number}> => {
  return searchPokemonByNameAndTypes(query, [], offset, limit);
};
