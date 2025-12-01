import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { useState } from 'react'

import ViewToggle from '@/shared/components/Searchbar/ViewToggle'

const DEFAULT_FILTER_OPTIONS = [
  { value: 'nearby', label: 'Mais próximos' },
  { value: 'recent', label: 'Mais recentes' },
  { value: 'popular', label: 'Populares' }
]

function noOp() {}

function useSearchbarFilter(filter, onFilterChange, filterOptions) {
  const [internalFilter, setInternalFilter] = useState(filterOptions[0]?.value || '')
  const currentFilter = filter || internalFilter

  const handleFilterChange = (e) => {
    const newValue = e.target.value
    setInternalFilter(newValue)
    onFilterChange(newValue)
  }

  return { currentFilter, handleFilterChange }
}

function SearchInput({ placeholderText, searchTerm, onSearchChange }) {
  return (
    <TextField
      placeholder={placeholderText}
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      variant="outlined"
      fullWidth
      sx={{
        '&': {
          height: 44,
          Width: '100%',
          borderRadius: 2,
          backgroundColor: 'white',
          boxShadow: '0 0 0 1px #e0e0e0'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none'
        },
        '& .MuiInputBase-root': {
          height: '44px'
        }
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          )
        }
      }} />
  )
}

function FilterSelect({ currentFilter, handleFilterChange, filterOptions }) {
  return (
    <Select
      value={currentFilter}
      onChange={handleFilterChange}
      sx={{
        '&': {
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0 0 0 1px #e0e0e0',
          height: 44,
          minWidth: 190
        },
        '& fieldset': {
          border: 'none'
        }
      }}>
      {filterOptions.map((opt) => (
        <MenuItem
          key={opt.value}
          value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  )
}

export default function Searchbar({
  view,
  setView,
  showToggle = true,
  showFilter = true,
  placeholderText,
  filterOptions = DEFAULT_FILTER_OPTIONS,
  searchTerm = '',
  onSearchChange = noOp,
  filter = '',
  onFilterChange = noOp
}) {
  const { currentFilter, handleFilterChange } = useSearchbarFilter(filter, onFilterChange, filterOptions)

  return (
    <Box
      sx={{
        display: 'flex',
        mb: '2rem',
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          width: '100%',
          gap: 2
        }}>
        <SearchInput
          placeholderText={placeholderText}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange} />

        {showFilter && (
          <FilterSelect
            currentFilter={currentFilter}
            handleFilterChange={handleFilterChange}
            filterOptions={filterOptions} />
        )}

        {showToggle && (
          <ViewToggle
            view={view}
            setView={setView} />
        )}
      </Box>
    </Box>
  )
}
