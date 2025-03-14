import { Box } from "@mui/material";

export default function TaskFilters({
  onCategoryChange,
  onStatusChange,
  onSearch
}) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <CategoryFilter onCategoryChange={onCategoryChange} />
      <StatusFilter onStatusChange={onStatusChange} />
      <SearchBar onSearch={onSearch} />
    </Box>
  );
}