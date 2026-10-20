📚 BookVerse
A little corner of the internet for my reading journey.

BookVerse is a personal book-tracking application I built out of my fondness for reading. I wanted a place where I could keep track of the books I read, document my thoughts, save my favorite quotes, and look back at how each story affected me.

For me, reading isn't just about finishing books or counting pages. It's about the stories I experience, the characters I meet, and the thoughts I carry with me after turning the last page.

BookVerse is my personal space to keep all of that in one place.

🔗 Live Application: [bookversead.vercel.app](https://bookversead.vercel.app/)
✨ Features

    📖 Personal Library — Keep your books organized in one place.
    📊 Reading Progress — Track the pages you've read and how far you are from finishing a book.
    🏷️ Reading Status — Organize books into categories such as To Read, Reading, Completed, and Abandoned.
    📝 Personal Reflections — Record your thoughts and experiences while reading.
    💬 Favorite Quotes — Save memorable lines from the books you read.
    ❤️ Reading Impact — Rate how much a book has affected you.
    🎨 Personalized Book Details — Keep track of authors, covers, genres, and other details.
    🌐 Shared Library — Books and reading updates are stored in a shared Supabase database, making the library accessible across devices.

🛠️ Built With

    React — Building the user interface.
    TypeScript — Type safety and more maintainable code.
    Vite — Development server and build tooling.
    Supabase — PostgreSQL database for storing book information.
    Vercel — Hosting and deployment.

🚀 Getting Started

Want to run BookVerse locally?
Prerequisites

    Node.js
    npm
    A Supabase project

Installation

1. Clone the repository

git clone <your-repository-url>
cd bookverse-ad

2. Install dependencies

npm install

3. Configure environment variables

Create a .env.local file in the project root:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

Replace the placeholder values with your Supabase project's URL and publishable key.

4. Start the development server

npm run dev

Open the local URL displayed in your terminal to explore the application.
Build for production

npm run build

To preview the production build locally:

npm run preview

🗄️ Database

BookVerse uses Supabase PostgreSQL to store book information, including:

    Book title and author
    Cover image URL
    Genre and summary
    Reading status and page progress
    Start and completion dates
    Favorite quotes and personal reflections
    Personal impact rating
    Accent color

The database is configured for a shared library, so changes can be reflected across devices.

    Note: The current database configuration allows public access to book records, including inserting, updating, and deleting them. Anyone who can reach the database may be able to modify its contents. Do not store private or sensitive information in this setup.

🎯 Why I Built It

I created BookVerse for myself because I enjoy reading and wanted something more personal than a simple checklist.

Every book leaves something behind. Sometimes it's a memorable character, sometimes a line worth remembering, and sometimes a different perspective on life.

I wanted to keep track of those experiences—not just the books themselves.

BookVerse is a small project born from a personal interest, built to make my reading journey a little more meaningful.
🔮 Future Possibilities

Some things I'd love to explore as the project grows:

    Reading statistics and yearly summaries
    Reading streaks and personal milestones
    Better ways to revisit memorable quotes and reflections
    More insights into my reading habits
    Additional ways to organize and explore my library

👤 Author

Arshath AD

Built with curiosity, code, and a fondness for books. 📚

Every book leaves a mark. BookVerse is where I keep mine.
