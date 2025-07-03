# Builder Components Architecture

The Builder is a modular page-building system that allows users to create rich, interactive book pages using drag-and-drop elements. This system replaces the previous "Elementor" naming with a cleaner "Builder" terminology.

## Architecture Overview

The Builder follows a component-based architecture with clear separation of concerns:

### Core Components

#### 1. **Builder** (`Builder.tsx`)
The main orchestrator component that manages the entire page-building experience.

**Responsibilities:**
- Coordinates between all sub-components
- Manages preview mode state
- Handles element selection and manipulation
- Provides drag-and-drop functionality

**Props:**
- `book`: Current book being edited
- `currentPageIndex`: Index of the page being edited
- `onSave`: Callback when book is saved
- `onClose`: Callback when closing the builder

#### 2. **BuilderToolbar** (`BuilderToolbar.tsx`)
Header component with primary actions and navigation.

**Features:**
- Preview mode toggle
- Page navigation indicator
- Close button

#### 3. **BuilderSidebar** (`BuilderSidebar.tsx`)
Contains the element library and properties panel.

**Features:**
- Collapsible in preview mode
- Houses both element library and properties panel

#### 4. **BuilderCanvas** (`BuilderCanvas.tsx`)
The main editing area where elements are dropped and arranged.

**Features:**
- Drag-and-drop zones with visual feedback
- Click handling for element selection
- Preview/edit mode switching

#### 5. **BuilderElementLibrary** (`BuilderElementLibrary.tsx`)
Library of draggable elements that can be added to pages.

**Available Elements:**
- **Heading**: H2 elements with styling
- **Text**: Paragraph elements for content
- **Image**: Responsive images with placeholders
- **Divider**: Horizontal rules for content separation
- **Columns**: Two-column layouts

#### 6. **BuilderPropertiesPanel** (`BuilderPropertiesPanel.tsx`)
Context-sensitive panel for editing selected elements.

**Features:**
- Content editing (text/image URLs)
- Style adjustments (font size, alignment, spacing)
- Element deletion

## Custom Hooks

### 1. **useBuilderSelection**
Manages element selection state and visual feedback.

**Features:**
- Tracks selected element ID and DOM reference
- Applies/removes visual selection styling
- Provides selection clearing functionality

### 2. **useBuilderDragDrop**
Handles all drag-and-drop interactions.

**Features:**
- New element creation from library
- Existing element reordering
- Visual drag feedback and drop zones

### 3. **useBuilderContent**
Manages content state and operations.

**Features:**
- Content processing for Builder compatibility
- Auto-save functionality
- Element manipulation (style, content, deletion)
- Event listener management

## Utility Functions

### Builder Utils (`builderUtils.ts`)
- `generateElementId()`: Creates unique element identifiers
- `processContentForBuilder()`: Converts content to Builder format
- `applySelectionStyling()`: Visual selection feedback
- Element manipulation utilities

### Editor Utils (`editorUtils.ts`)
- `hasBuilderContent()`: Detects Builder elements
- `applyTextStyling()`: Ensures text visibility
- `setSafeHTMLContent()`: Safe content updates

## Type System

### Core Types (`builder.ts`)
- `ElementLibraryItem`: Element definitions
- `ElementSelection`: Selection state
- `DragDropState`: Drag-and-drop state
- `BuilderProps`: Main component props
- `ProcessedContent`: Content processing results

## Design Principles

### 1. **Separation of Concerns**
- UI components handle only rendering and user interaction
- Business logic is encapsulated in custom hooks
- Utility functions provide pure, reusable operations

### 2. **Custom Hooks Pattern**
- State management separated from UI components
- Reusable business logic across components
- Easier testing and maintenance

### 3. **Type Safety**
- Comprehensive TypeScript interfaces
- Strict null checking and error handling
- Clear component contracts

### 4. **Modularity**
- Each component has a single, clear responsibility
- Easy to extend with new element types
- Clean interfaces between components

## Usage Example

```tsx
import { Builder } from '@/components/Builder';

function MyApp() {
  return (
    <Builder
      book={currentBook}
      currentPageIndex={0}
      onSave={(updatedBook) => {
        // Handle book saving
      }}
      onClose={() => {
        // Handle builder closing
      }}
    />
  );
}
```

## Extension Points

### Adding New Element Types
1. Add element definition to `ELEMENT_LIBRARY` in `Builder.tsx`
2. Extend properties panel for element-specific controls
3. Update styling and templates as needed

### Custom Element Properties
1. Extend `ElementLibraryItem` interface
2. Update `BuilderPropertiesPanel` for new property types
3. Add utility functions for element-specific operations

### Advanced Interactions
1. Extend `useBuilderDragDrop` for complex drag behaviors
2. Add new hooks for specialized functionality
3. Extend canvas component for advanced editing features

## Performance Considerations

- **Event Listener Management**: Hooks properly attach/detach listeners
- **Re-render Optimization**: Strategic use of `useCallback` and dependencies
- **DOM Manipulation**: Efficient element selection and styling
- **Memory Management**: Proper cleanup in `useEffect` hooks

## Future Enhancements

The modular architecture supports easy addition of:
- Advanced element types (tables, forms, media)
- Layout templates and themes
- Collaborative editing features
- Undo/redo functionality
- Advanced styling options
- Component nesting and grouping 