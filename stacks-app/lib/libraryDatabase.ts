/**
 * Library database with catalog URL patterns
 * Supports BiblioCommons, OverDrive, and other ILS systems
 */

export interface Library {
  id: string;
  name: string;
  city: string;
  state: string;
  type: 'bibliocommons' | 'overdrive' | 'sirsi' | 'innovative' | 'other';
  catalogUrlPattern: string;
  // URL pattern uses {ISBN} or {TITLE} placeholder
}

export const libraryDatabase: Library[] = [
  {
    id: "sfpl",
    name: "San Francisco Public Library",
    city: "San Francisco",
    state: "CA",
    type: "bibliocommons",
    catalogUrlPattern: "https://sfpl.bibliocommons.com/v2/search?query={ISBN}",
  },
  {
    id: "nypl",
    name: "New York Public Library",
    city: "New York",
    state: "NY",
    type: "bibliocommons",
    catalogUrlPattern: "https://nypl.bibliocommons.com/v2/search?query={ISBN}",
  },
  {
    id: "lapl",
    name: "Los Angeles Public Library",
    city: "Los Angeles",
    state: "CA",
    type: "overdrive",
    catalogUrlPattern: "https://lapl.overdrive.com/search?query={ISBN}",
  },
  {
    id: "cpl",
    name: "Chicago Public Library",
    city: "Chicago",
    state: "IL",
    type: "bibliocommons",
    catalogUrlPattern: "https://chipublib.bibliocommons.com/v2/search?query={ISBN}",
  },
  {
    id: "spl",
    name: "Seattle Public Library",
    city: "Seattle",
    state: "WA",
    type: "bibliocommons",
    catalogUrlPattern: "https://seattle.bibliocommons.com/v2/search?query={ISBN}",
  },
  // TODO: Add more libraries from ABA member directory
  // Expand to 100+ major US libraries
];

export function getLibraryById(id: string): Library | undefined {
  return libraryDatabase.find(lib => lib.id === id);
}

export function getLibraryCatalogUrl(library: Library, isbn?: string, title?: string): string {
  const searchTerm = isbn || title || '';
  return library.catalogUrlPattern.replace('{ISBN}', searchTerm).replace('{TITLE}', searchTerm);
}

export function searchLibraries(query: string): Library[] {
  const lowerQuery = query.toLowerCase();
  return libraryDatabase.filter(lib =>
    lib.name.toLowerCase().includes(lowerQuery) ||
    lib.city.toLowerCase().includes(lowerQuery) ||
    lib.state.toLowerCase().includes(lowerQuery)
  );
}
