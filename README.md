# Breadit / Clone of Reddit

![Slide 16_9 - 1](https://github.com/jcodev2/breadit/assets/72767265/af1474a0-31d9-4f48-900f-70e44cff340a)

Build with Next.js App Router, TypeScript & TailwindCSS

## Features

- **Infinite scrolling for dynamically loading posts**
- **Authentication using NextAuth & Google**
- **Custom feed for authenticated users**
- **Advanced caching using Upstash Redis**
- **Great user experience**
- **Modern data fetching using React-Query**
- **A functional post editor**
- **Image uploads & link previews**
- **Full comment functionality with nested replies**

## Getting Started

To get started, clone the repository

```bash
git clone git@github.com:jcodev2/breadit.git
```

Then install the dependencies

```bash
npm install
# or
yarn install
```

Then run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

**note:** You will need to create a `.env.local` file with the following environment variables

```bash
DATABASE_URL=
NEXTAUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

REDIS_URL=
REDIS_SECRET=
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
