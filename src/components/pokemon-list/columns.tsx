"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Pokemon } from "@/lib/pokemon-api";
import { Badge } from "../ui/badge";
import { FavoriteButton } from "../ui/FavoriteButton";
import { useFavorites } from "@/contexts/FavoritesContext";

// Component to handle favorites in the table row
const FavoriteCell: React.FC<{ pokemon: Pokemon }> = ({ pokemon }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div className="flex justify-center">
      <FavoriteButton
        pokemonId={pokemon.id}
        isFavorite={isFavorite(pokemon.id)}
        onToggle={toggleFavorite}
        size="sm"
      />
    </div>
  );
};

export const pokemonColumns: ColumnDef<Pokemon>[] = [
  {
    accessorKey: "favorite",
    header: "",
    enableSorting: false,
    cell: ({ row }) => <FavoriteCell pokemon={row.original} />,
    size: 50,
  },
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: true,
    cell: ({ row }) => (
      <div className="font-mono text-sm">#{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "sprites",
    header: "Image",
    enableSorting: false,
    cell: ({ row }) => {
      const sprites = row.getValue("sprites") as Pokemon["sprites"];
      const imageUrl =
        sprites?.other?.["official-artwork"]?.front_default ||
        sprites?.front_default;

      return (
        <div className="flex justify-center w-[60px]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={row.getValue("name")}
              width={60}
              height={60}
              className="rounded-lg"
            />
          ) : (
            <div className="w-[60px] h-[60px] bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      const nameA = rowA.getValue(columnId) as string;
      const nameB = rowB.getValue(columnId) as string;
      return nameA.localeCompare(nameB);
    },
    cell: ({ row }) => (
      <div className="font-medium capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "types",
    header: "Types",
    enableSorting: true,
    cell: ({ row }) => {
      const types = row.getValue("types") as Pokemon["types"];

      return (
        <div className="flex gap-1 flex-wrap">
          {types?.map((type, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {type.type.name}
            </Badge>
          )) || <span className="text-gray-400">-</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "height",
    header: "Height",
    enableSorting: true,
    cell: ({ row }) => {
      const height = row.getValue("height") as number;
      return height ? `${height / 10} m` : "-";
    },
  },
  {
    accessorKey: "weight",
    header: "Weight",
    enableSorting: true,
    cell: ({ row }) => {
      const weight = row.getValue("weight") as number;
      return weight ? `${weight / 10} kg` : "-";
    },
  },
];
