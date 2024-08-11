import React from "react";

import { Search, Loader2 } from "lucide-react";

interface SearchBoxProps {
  isSearching: boolean;
  searchText: string;
  setSearchText: (text: string) => void;
  onSearch: (value: string) => void;
  placeholder?: string;
}

const SearchBox = ({
  searchText,
  setSearchText,
  isSearching,
  onSearch,
  placeholder = "Search...",
}: SearchBoxProps) => {
  const handleSearchTextChange = (value: string) => {
    setSearchText(value);
    //custom logic to search using the input text
    onSearch(value);
  };

  return (
    <div className="relative flex items-center justify-between">
      <input
        type="text"
        placeholder={placeholder}
        className="text-sm rounded-sm border-blue-300 border-[1px] pl-3 pr-9 py-2 w-[230px] h-[40px]"
        value={searchText}
        onChange={(e) => handleSearchTextChange(e.target.value)}
      />
      {isSearching ? (
        <div className="absolute right-2">
          <Loader2 size={20} className="mr-1 animate-spin text-[#3d3d3d]" />
        </div>
      ) : (
        <Search
          size={20}
          className="mr-1 absolute right-2 text-[#3d3d3d] cursor-pointer h-full"
        />
      )}
    </div>
  );
};

export default SearchBox;
