# Notion AI Clone

A collaborative document editing application built with modern web frameworks and libraries like Next.js, MongoDB, and Liveblocks to create a seamless, responsive, and interactive user experience.

## Features

- **Real-time Collaboration**: Multiple users can edit documents simultaneously.
- **Rich Text Editor**: Support for various text formatting options.
- **Document Organization**: Create, manage, and organize documents efficiently.
- **Secure Authentication**: User authentication via Clerk.
- **Responsive Design**: Works seamlessly across different devices and screen sizes.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Authentication**: Clerk
- **Database**: MongoDB
- **Real-time Collaboration**: Liveblocks
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS

## Prerequisites

Before you begin, ensure you have the following:

- Node.js (v18 or higher)
- MongoDB instance (local or Atlas)
- Clerk account for authentication
- Liveblocks account for real-time collaboration

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/notion-ai-clone.git
cd notion-ai-clone
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:

```
MONGODB_URI=your_mongodb_uri
MONGODB_DB=notion_clone
CLERK_SECRET_KEY=your_clerk_secret_key
LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret_key
NEXT_PUBLIC_BASE_URL=your_api_base_url
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
