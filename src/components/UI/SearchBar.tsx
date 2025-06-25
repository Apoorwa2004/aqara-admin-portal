import React, { useState } from 'react'
import { Paper, InputBase, IconButton } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}
const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
}) => {
  const [query, setQuery] = useState('')
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }
  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: {
          xs: '100%',
          sm: 400,
        },
        mb: 2,
      }}
    >
      <InputBase
        sx={{
          ml: 1,
          flex: 1,
        }}
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <IconButton
        type="submit"
        sx={{
          p: '10px',
        }}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}
export default SearchBar
