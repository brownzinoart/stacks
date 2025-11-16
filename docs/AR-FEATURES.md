# AR Features Documentation

## Overview

Stacks includes two powerful AR (Augmented Reality) features designed to enhance the library experience:

1. **AR Shelf Scanner** - Point your camera at library shelves to discover books
2. **AR Book Navigator** - Get visual directions to any book in the library

## Architecture

### Technology Stack

- **OCR**: Tesseract.js for text recognition on book spines
- **Camera**: Capacitor Camera plugin for native camera access
- **AR Rendering**: AR.js + A-Frame for web-based AR overlays
- **Indoor Navigation**: Custom pathfinding with visual floor markers

### Key Components

```
src/
├── lib/
│   └── ar-service.ts          # Core AR service with OCR and navigation logic
├── features/ar/
│   ├── ar-shelf-scan.tsx      # AR shelf scanning component
│   └── ar-directions.tsx      # AR navigation component
├── app/
│   └── ar-discovery/page.tsx  # Main AR discovery page
└── types/
    └── ar.d.ts               # Type definitions for AR libraries
```

## AR Shelf Scanner

### How It Works

1. User points camera at library shelf
2. OCR recognizes text on book spines
3. System matches recognized titles with catalog
4. AR overlay highlights books based on:
   - 🟢 Green border: Recommended for you
   - 🔵 Blue border: Available to borrow
   - 🔴 Red border: Currently unavailable

### Implementation Details

- Scans every 2 seconds while active
- Processes images using Tesseract.js
- Matches books against user preferences
- Real-time visual feedback

## AR Book Navigator

### How It Works

1. User selects a book from catalog
2. System calculates path using library floor plan
3. Camera shows AR overlay on floor
4. Green dotted path guides to book location
5. Orange marker indicates destination

### Library Layout

Currently configured for Durham County Main Library:

- Single floor implementation
- 4 main sections (Fiction A-M, Fiction N-Z, Non-Fiction 100-500, Non-Fiction 500-900)
- Waypoint-based pathfinding

## Testing

### Running Tests

```bash
npm run test tests/ar-features.spec.ts
```

### Manual Testing

1. Navigate to `/ar-discovery`
2. Grant camera permissions when prompted
3. Test shelf scanner with printed book spines
4. Test navigator with sample book selections

## Future Enhancements

### Short Term

- [ ] Multi-floor navigation support
- [ ] Improved OCR accuracy for curved spines
- [ ] Book reservation from AR view
- [ ] Offline mode for floor plans

### Long Term

- [ ] Integration with more Triangle area libraries
- [ ] Machine learning for better book spine recognition
- [ ] Social features (see what friends are reading)
- [ ] AR book reviews and ratings overlay

## Performance Considerations

- OCR processing is CPU-intensive
- Limit scanning frequency to prevent battery drain
- Cache recognized books for 5 minutes
- Optimize image quality vs processing speed

## Security & Privacy

- Camera permissions required
- No images are stored or transmitted
- All processing happens on-device
- User can revoke permissions at any time

## Troubleshooting

### Common Issues

1. **"AR not supported" message**
   - Ensure using a modern mobile browser
   - Check camera permissions in device settings

2. **Poor text recognition**
   - Ensure good lighting conditions
   - Hold camera steady
   - Try moving closer to shelves

3. **Navigation not working**
   - Verify location services enabled
   - Check floor plan loaded correctly

## Contributing

When adding new AR features:

1. Follow existing patterns in `ar-service.ts`
2. Add appropriate TypeScript types
3. Include E2E tests
4. Update this documentation
