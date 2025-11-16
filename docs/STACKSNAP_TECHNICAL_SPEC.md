# 📸 StackSnap Technical Specification

## Overview
StackSnap is the core feature allowing users to photograph bookshelves and get interactive book recommendations overlaid on the captured image.

## Technical Flow

### 1. Photo Capture
```typescript
// Using Capacitor Camera API
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

const captureImage = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Camera
  })
  return image.dataUrl
}
```

### 2. OCR Processing
```typescript
// Using Tesseract.js for client-side OCR
import Tesseract from 'tesseract.js'

const recognizeBooks = async (imageData: string) => {
  const { data: { text } } = await Tesseract.recognize(imageData, 'eng', {
    logger: m => console.log(m) // Progress tracking
  })
  
  // Parse text to extract book titles/authors
  const books = parseBookTitles(text)
  return books
}
```

### 3. Book Metadata Lookup
```typescript
// Google Books API integration
const enrichBookData = async (books: ParsedBook[]) => {
  const enrichedBooks = await Promise.all(
    books.map(async (book) => {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(book.title + ' ' + book.author)}`
      )
      const data = await response.json()
      return {
        ...book,
        metadata: data.items[0]?.volumeInfo,
        cover: data.items[0]?.volumeInfo?.imageLinks?.thumbnail
      }
    })
  )
  return enrichedBooks
}
```

### 4. AI Recommendations
```typescript
// Generate recommendations based on identified books
const generateRecommendations = async (identifiedBooks: EnrichedBook[]) => {
  const bookTitles = identifiedBooks.map(b => b.title).join(', ')
  
  const prompt = `Based on these books: ${bookTitles}, recommend 3 similar books that would fit this collection.`
  
  const recommendations = await aiService.getRecommendations(prompt)
  return recommendations
}
```

### 5. Interactive Overlay UI
```typescript
// Create interactive overlay on captured image
const StackSnapOverlay = ({ imageData, identifiedBooks, recommendations }) => {
  return (
    <div className="relative">
      <img src={imageData} alt="Captured shelf" className="w-full" />
      
      {identifiedBooks.map((book, index) => (
        <div 
          key={index}
          className="absolute bg-black/80 text-white p-2 rounded-lg"
          style={{
            top: book.position.y,
            left: book.position.x
          }}
        >
          <h3 className="font-bold text-sm">{book.title}</h3>
          <p className="text-xs">{book.author}</p>
          <button 
            className="bg-primary-green text-black px-2 py-1 rounded mt-1 text-xs"
            onClick={() => addToStack(book)}
          >
            Add to Stack
          </button>
        </div>
      ))}
      
      {/* Recommendations panel */}
      <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-4">
        <h3 className="font-bold mb-2">Recommended for you:</h3>
        {recommendations.map(rec => (
          <RecommendationCard key={rec.id} book={rec} />
        ))}
      </div>
    </div>
  )
}
```

## Implementation Components

### Core Files to Create/Modify
- `src/features/stacksnap/camera-capture.tsx` - Photo capture interface
- `src/features/stacksnap/ocr-processor.tsx` - OCR text recognition
- `src/features/stacksnap/overlay-ui.tsx` - Interactive overlay component
- `src/lib/book-recognition-service.ts` - Book parsing and enrichment
- `src/lib/stacksnap-orchestrator.ts` - Coordinates entire flow

### Existing Files to Leverage
- `src/lib/ocr-worker-pool.ts` - Already exists for OCR processing
- `src/components/book-cover.tsx` - Book display components
- `src/lib/ai-recommendation-service.ts` - AI recommendation logic
- `src/lib/google-books-api.ts` - Google Books integration

## Performance Considerations

### OCR Optimization
- Process image in Web Worker to avoid UI blocking
- Resize/compress images before OCR to improve speed
- Cache OCR results to avoid re-processing same images

### UI Responsiveness
- Show loading states during OCR processing
- Progressive enhancement - show captured image immediately
- Lazy load recommendations after initial book identification

### Offline Support
- Cache identified books locally
- Sync recommendations when connection available
- Graceful degradation for offline usage

## Launch MVP Features
1. **Photo Capture** - Take picture of bookshelf
2. **Book Recognition** - OCR to identify 3-5 book titles
3. **Basic Overlay** - Show identified books with "Add to Stack" buttons
4. **Simple Recommendations** - 2-3 book suggestions based on identified titles
5. **Social Sharing** - Share the annotated image

## Future Enhancements
- Multiple shelf detection in single image
- Improved OCR accuracy with custom training
- Real-time camera overlay (no capture required)
- Advanced positioning algorithms for overlay placement
- Community shelf sharing and browsing