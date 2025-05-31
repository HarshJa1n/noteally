# Noteally

A minimalist, photo-based notepad web application that leverages AI-powered OCR technology to extract text from photos of book sections, enabling users to quickly create searchable and editable notes.

## Features

- 📸 Photo capture and upload for book pages
- 🤖 AI-powered OCR text extraction using Gemini API
- ✏️ Rich text editor with formatting options
- 🏷️ Note organization with tags and categories
- 🔍 Fast search functionality
- 💾 Local storage for notes
- 📱 Mobile-responsive design

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- A Google AI Studio API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd noteally
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add your API keys:
```bash
# Get your API key from: https://aistudio.google.com/apikey
GEMINI_API_KEY=your_gemini_api_key

# Firebase Configuration (for authentication and Firestore database)
# Get these from Firebase Console > Project Settings > General
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Note**: This app uses Firestore for cloud data storage and Firebase Authentication. Firebase Storage is not used.

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. **Upload Photos**: Navigate to the upload page and drag & drop or select photos of book pages
2. **OCR Processing**: The app automatically extracts text from uploaded images using AI
3. **Edit Notes**: Use the rich text editor to refine and format extracted text
4. **Organize**: Add tags and categories to organize your notes
5. **Search**: Use the search functionality to quickly find specific notes

## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **UI**: Shadcn UI components with Tailwind CSS
- **AI/OCR**: Google Gemini API via Genkit
- **Text Editor**: Tiptap with advanced extensions
- **Database**: Firebase Firestore for cloud storage
- **Authentication**: Firebase Authentication
- **Local Storage**: LocalForage for browser storage
- **TypeScript**: Full type safety

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── services/           # Business logic and API services
├── types/              # TypeScript type definitions
└── genkit/             # Genkit AI flows
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn UI](https://ui.shadcn.com/)
- [Google AI Studio](https://aistudio.google.com/)
- [Tiptap Editor](https://tiptap.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
