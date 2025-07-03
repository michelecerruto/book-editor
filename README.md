# Book Editor - Advanced Book Writing Tool

A modern, feature-rich book editor built with Next.js, TypeScript, and Tailwind CSS. This application provides both a drag-and-drop page builder and a rich text editor for creating professional books with complete creative control.

## 🚀 Features

### **Dual Editing Modes**
- **Page Builder**: Visual drag-and-drop interface for creating structured layouts
- **Rich Text Editor**: Traditional WYSIWYG editor for focused writing

### **Page Builder Features**
- **Visual Elements Library**: Drag-and-drop elements including:
  - Headings with customizable styling
  - Text paragraphs with rich formatting
  - Bullet and numbered lists
  - Quote blocks with elegant styling
  - Interactive buttons
  - Column layouts for advanced designs
  - Spacers and dividers for layout control

- **Advanced Editing Controls**:
  - Element selection with visual feedback
  - Properties panel for customizing selected elements
  - Text alignment (left, center, right)
  - Font size adjustments
  - Margin and padding controls
  - Element deletion and reordering

- **Tabbed Interface**:
  - **Elements Tab**: Library of draggable components
  - **Properties Tab**: Edit selected element properties
  - **Design Tab**: Global page styling options

- **Drag & Drop Functionality**:
  - Drag elements from library to canvas
  - Reorder existing elements by dragging
  - Visual drop indicators and feedback

### **Rich Text Editor Features**
- **Formatting Controls**: Bold, italic, underline formatting
- **Text Alignment**: Left, center, right alignment options
- **Lists**: Bullet and numbered lists
- **Typography**: Font size selection and heading styles (H1, H2, H3)
- **Real-time Preview**: Live formatting updates

### **Book Management**
- **Pagination System**: Navigate between pages with intuitive controls
- **Dynamic Pages**: Add and remove pages dynamically
- **Page Analytics**: Real-time page and word count tracking
- **Import System**: Import books from text files (.txt, .md, .rtf)
- **Auto-conversion**: Automatic text-to-page conversion (~500 words per page)
- **Metadata**: Editable book title and author information

### **User Experience**
- **Mode Switching**: Seamless switching between Builder and Editor modes
- **Preview Mode**: Preview your layouts without editing controls
- **Auto-save**: Automatic content saving and state persistence
- **Responsive Design**: Works on desktop and tablet devices
- **Professional UI**: Clean, modern interface with intuitive controls

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **State Management**: React hooks (useState, useEffect)

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd book-editor
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage

### Creating a New Book
1. Click "Create New Book" on the landing page
2. Enter your book title and author name
3. Choose your editing mode:
   - **Page Builder**: For structured, visual layouts
   - **Rich Text Editor**: For traditional writing

### Page Builder Mode
1. **Adding Elements**: Drag elements from the Elements tab to the canvas
2. **Editing Content**: Click any element to select it, then use the Properties tab to edit
3. **Styling**: Adjust font sizes, alignment, margins, and padding in the Properties panel
4. **Layout**: Use columns, spacers, and dividers to create professional layouts
5. **Reordering**: Drag existing elements to reposition them
6. **Preview**: Click "Preview" to see your layout without editing controls
7. **Switch Modes**: Use "Editor Mode" button to switch to traditional text editing

### Rich Text Editor Mode
1. **Writing**: Type directly in the editor with real-time formatting
2. **Formatting**: Use the toolbar for bold, italic, underline, and text alignment
3. **Structure**: Create headings, lists, and organize your content
4. **Navigation**: Use pagination controls to move between pages

### Importing an Existing Book
1. Click "Import Existing Book" on the landing page
2. Drag and drop a text file or click to browse
3. The application will automatically:
   - Extract the title from the filename
   - Split the content into pages (~500 words each)
   - Set up the book structure for editing
4. Switch between Builder and Editor modes as needed

### Advanced Features
- **Element Management**: Delete elements using the trash button in Properties panel
- **Auto-save**: All changes are automatically saved to browser storage
- **Page Management**: Add/remove pages using pagination controls
- **Mode Switching**: Seamlessly switch between Builder and Editor modes
- **Design System**: Use the Design tab for global page styling options

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main application page
├── components/
│   ├── BookEditor.tsx       # Main book editor component
│   ├── BookImporter.tsx     # Book import functionality
│   ├── Editor.tsx           # Rich text editor component
│   ├── PaginationControls.tsx  # Page navigation controls
│   ├── Builder.tsx          # Page builder main component export
│   └── builder/             # Page builder components
│       ├── Builder.tsx      # Main builder orchestrator
│       ├── BuilderCanvas.tsx    # Main editing canvas
│       ├── BuilderElementLibrary.tsx  # Draggable elements library
│       ├── BuilderPropertiesPanel.tsx # Element properties editor
│       ├── BuilderSidebar.tsx   # Sidebar with tabs
│       ├── BuilderToolbar.tsx   # Top toolbar with actions
│       ├── index.ts         # Component exports
│       └── README.md        # Builder architecture documentation
├── hooks/
│   ├── useBuilderContent.ts    # Content state management
│   ├── useBuilderDragDrop.ts   # Drag and drop functionality
│   ├── useBuilderSelection.ts  # Element selection management
│   ├── useEditor.ts         # Rich text editor state
│   └── index.ts             # Hook exports
├── lib/
│   └── utils.ts             # Utility functions and helpers
├── types/
│   ├── book.ts              # Book-related type definitions
│   └── builder.ts           # Builder-specific type definitions
└── utils/
    ├── builderUtils.ts      # Builder utility functions
    └── editorUtils.ts       # Editor utility functions
```

## 🔧 Key Components

### BookEditor
The main editor component that orchestrates the entire editing experience, managing book state, page navigation, and content updates. Provides switching between Builder and Editor modes.

### Builder Architecture
A modular page builder system with separation of concerns:

- **Builder.tsx**: Main orchestrator component using custom hooks for state management
- **BuilderToolbar.tsx**: Top navigation with preview toggle and mode switching
- **BuilderSidebar.tsx**: Tabbed interface for Elements, Properties, and Design
- **BuilderCanvas.tsx**: Main editing area with drag-and-drop functionality
- **BuilderElementLibrary.tsx**: Draggable component library with visual feedback
- **BuilderPropertiesPanel.tsx**: Context-sensitive property editor for selected elements

### Custom Hooks
Specialized hooks for managing complex state:

- **useBuilderContent**: Content state management, processing, and auto-save
- **useBuilderDragDrop**: Complete drag-and-drop functionality for elements
- **useBuilderSelection**: Element selection with visual feedback
- **useEditor**: Rich text editor state and formatting management

### Editor (formerly WYSIWYGEditor)
A rich text editor built with contentEditable and document.execCommand for formatting. Provides a toolbar with common formatting options and real-time content updates.

### PaginationControls
Handles page navigation, addition, and removal with a clean, intuitive interface.

### BookImporter
Provides drag-and-drop and file browser functionality for importing text files with automatic book structure generation.

## 🎨 Customization

The application uses Tailwind CSS for styling, making it easy to customize the appearance:

- Colors can be modified in the Tailwind configuration
- Component styles are defined using Tailwind utility classes
- The design system uses consistent spacing and typography scales

## 🚀 Deployment

To build for production:

```bash
npm run build
npm start
```

The application can be deployed to any platform that supports Next.js, such as Vercel, Netlify, or your own server.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Enhancements

- Cloud storage integration
- Multiple export formats (PDF, EPUB, etc.)
- Collaborative editing
- Advanced formatting options
- Book templates
- Chapter organization
- Search and replace functionality
- Spell checking
- Auto-save to cloud

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS.
