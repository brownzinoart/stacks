/**
 * Book Content Service - Fetches book data from free, no-auth APIs
 * Uses Open Library, Project Gutenberg (via Gutendex), and Internet Archive
 */

export interface BookExcerpt {
  text: string;
  page?: string;
}

export interface BookContent {
  description: string;
  excerpts: BookExcerpt[];
  coverUrl: string;
  backCoverUrl: string;
  fullTextUrl: string | null;
  pageCount: number;
  publishYear: string;
  hasFullText: boolean;
  metadata: Record<string, any>;
}

export async function fetchBookContent(book: { title: string; author: string; isbn?: string }): Promise<BookContent> {
  const content: BookContent = {
    description: '',
    excerpts: [],
    coverUrl: '',
    backCoverUrl: '',
    fullTextUrl: null,
    pageCount: 0,
    publishYear: '',
    hasFullText: false,
    metadata: {},
  };

  // Try Open Library first (has excerpts and good metadata)
  if (book.isbn) {
    try {
      const olResp = await fetch(`https://openlibrary.org/isbn/${book.isbn}.json`);
      if (olResp.ok) {
        const olData = await olResp.json();

        // Extract description
        content.description =
          typeof olData.description === 'object' ? olData.description.value : olData.description || '';

        // Extract excerpts
        if (olData.excerpts) {
          content.excerpts = olData.excerpts.map((e: any) => ({
            text: e.text,
            page: e.page || 'Opening',
          }));
        }

        // Get cover images
        if (olData.covers && olData.covers.length > 0) {
          content.coverUrl = `https://covers.openlibrary.org/b/id/${olData.covers[0]}-L.jpg`;
          // Try to get back cover (usually second cover if available)
          if (olData.covers && olData.covers.length > 1) {
            content.backCoverUrl = `https://covers.openlibrary.org/b/id/${olData.covers[1]}-L.jpg`;
          }
        }

        // Store page count
        content.pageCount = olData.number_of_pages || 0;

        // Get work details for more info
        if (olData.works && olData.works[0] && olData.works[0].key) {
          try {
            const workResp = await fetch(`https://openlibrary.org${olData.works[0].key}.json`);
            if (workResp.ok) {
              const workData = await workResp.json();

              // Get more excerpts from work data if available
              if (workData.excerpts && content.excerpts.length === 0) {
                content.excerpts = workData.excerpts.map((e: any) => ({
                  text: e.excerpt || e.text,
                  page: e.page || 'Selection',
                }));
              }

              // Get description from work if not found in edition
              if (!content.description && workData.description) {
                content.description =
                  typeof workData.description === 'object' ? workData.description.value : workData.description;
              }
            }
          } catch (e) {
            console.error('Error fetching Open Library work data:', e);
          }
        }
      }
    } catch (e) {
      console.error('Open Library error:', e);
    }
  }

  // Try Gutenberg for public domain full text
  try {
    const searchQuery = `${book.title} ${book.author}`.trim();
    const gutenbergResp = await fetch(`https://gutendex.com/books/?search=${encodeURIComponent(searchQuery)}`);

    if (gutenbergResp.ok) {
      const gutenbergData = await gutenbergResp.json();

      if (gutenbergData.results && gutenbergData.results.length > 0) {
        const gutenbergBook = gutenbergData.results[0];
        content.hasFullText = true;
        content.fullTextUrl = gutenbergBook.formats['text/plain; charset=utf-8'] || gutenbergBook.formats['text/plain'];

        // Fetch opening as excerpt if we don't have any
        if (content.fullTextUrl && content.excerpts.length === 0) {
          try {
            const textResp = await fetch(content.fullTextUrl);
            if (textResp.ok) {
              const fullText = await textResp.text();

              // Clean and extract opening
              const lines = fullText.split('\n').filter((line) => line.trim());

              // Skip header/title info and find actual content start
              let startIndex = 0;
              for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line && line.match(/^(CHAPTER|Chapter|I\.|1\.|PROLOGUE|Prologue)/)) {
                  startIndex = i;
                  break;
                }
              }

              // Extract first meaningful paragraph
              const excerpt = lines
                .slice(startIndex, startIndex + 20)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim()
                .substring(0, 1000);

              if (excerpt.length > 100) {
                content.excerpts.push({
                  text: excerpt + '...',
                  page: 'Opening',
                });
              }
            }
          } catch (e) {
            console.error('Error fetching Gutenberg text:', e);
          }
        }
      }
    }
  } catch (e) {
    console.error('Gutenberg error:', e);
  }

  // Try Internet Archive for additional metadata and covers
  if (!content.coverUrl || !content.publishYear) {
    try {
      const iaQuery = `title:(${book.title}) AND creator:(${book.author})`;
      const iaResp = await fetch(
        `https://archive.org/advancedsearch.php?q=${encodeURIComponent(iaQuery)}&output=json&rows=1&page=1`
      );

      if (iaResp.ok) {
        const iaData = await iaResp.json();

        if (iaData.response && iaData.response.docs && iaData.response.docs.length > 0) {
          const iaBook = iaData.response.docs[0];

          // Get publish year
          content.publishYear = iaBook.year || content.publishYear;

          // Get description if we don't have one
          if (!content.description && iaBook.description) {
            content.description = Array.isArray(iaBook.description) ? iaBook.description[0] : iaBook.description;
          }

          // Get cover from IA if we don't have one
          if (!content.coverUrl && iaBook.identifier) {
            content.coverUrl = `https://archive.org/services/img/${iaBook.identifier}`;
          }

          // Store additional metadata
          content.metadata.iaIdentifier = iaBook.identifier;
          content.metadata.language = iaBook.language;
          content.metadata.subjects = iaBook.subject;
        }
      }
    } catch (e) {
      console.error('Internet Archive error:', e);
    }
  }

  // Generate default cover if none found
  if (!content.coverUrl) {
    // We'll use the BookCover component's default behavior
    content.coverUrl = '';
  }

  return content;
}
