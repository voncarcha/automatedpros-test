import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <nav className="flex justify-between items-center p-4 border-b border-gray-200">
      <div className="w-full flex gap-4">
        <h1 className="text-2xl font-bold text-gray-800">PokeApi Explorer</h1>
        <Input placeholder="Search" className="w-full max-w-[300px]"/>
      </div>
      <div className="flex items-center gap-4">
        <Button>Filter</Button>
        <Button>Favorites</Button>
      </div>
    </nav>
  );
};

export default Header;
