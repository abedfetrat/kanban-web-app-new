import { Column } from "../models/Column";

// Compares two lists of Column objects and returns array of added, updated and deleted Columns
export default function compareColumns(
  oldColumns: Column[],
  newColumns: Column[],
) {
  const added: Column[] = [];
  const updated: Column[] = [];
  const deleted: Column[] = [];

  // Create map for efficient lookup
  const newMap = new Map();
  newColumns.forEach((col) => newMap.set(col.id, col));

  // Check for updated and deleted items
  oldColumns.forEach((oldCol) => {
    const newCol = newMap.get(oldCol.id);
    if (newCol) {
      if (newCol.name !== oldCol.name) {
        updated.push(newCol);
      }
    } else {
      deleted.push(oldCol);
    }
  });

  // Check for added items
  newColumns.forEach((newCol) => {
    if (!oldColumns.some((oldCol) => oldCol.id === newCol.id)) {
      added.push(newCol);
    }
  });

  return { added, updated, deleted };
}
