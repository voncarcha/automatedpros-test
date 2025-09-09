# Pokemon Directory

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

A comprehensive Pokemon directory application featuring search, filtering, favorites, and detailed Pokemon information using the [PokéAPI](https://pokeapi.co/).

## Prerequisites

- **Node.js**: Version 18.18.0 or higher (specified in `.nvmrc`)
- **npm**, **yarn**, **pnpm**, or **bun**

### Using Node Version Manager (nvm)

If you have [nvm](https://github.com/nvm-sh/nvm) installed, you can use the correct Node.js version:

```bash
nvm use
```

This will automatically use the Node.js version specified in the `.nvmrc` file.

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Search**: Real-time Pokemon search with debounced input
- **Type Filtering**: Filter Pokemon by one or multiple types
- **Favorites**: Mark Pokemon as favorites with localStorage persistence
- **Sorting**: Sort Pokemon by name or ID
- **Pagination**: Efficient pagination for browsing large datasets
- **Responsive Design**: Works on desktop and mobile devices
- **Pokemon Details**: Detailed view with stats, abilities, and images

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **TanStack Query** - Data fetching and caching
- **TanStack Table** - Table functionality with sorting
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **PokéAPI** - Pokemon data source

## Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── pokemon-list/      # Pokemon list components
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
└── lib/                   # Utilities and API functions
```
