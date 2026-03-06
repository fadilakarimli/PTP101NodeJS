const blogs = [
  {
    id: "1",
    title: "Express.js ilə İlk REST API (GET/POST/PUT/DELETE)",
    category: "Node.js",
    desc: "Express qurulumu, routing və sadə CRUD endpoint-lərin yazılması (praktik nümunə).",
    image: "/images/blog/node-rest-api.jpg",
    tags: ["nodejs", "express", "rest", "crud"]
  },
  {
    id: "2",
    title: "Middleware nədir? (Global, Route-level, Error)",
    category: "Node.js",
    desc: "req-res arasındakı işləmə məntiqi, next(), və error middleware-in düzgün istifadəsi.",
    image: "/images/blog/node-middleware.jpg",
    tags: ["nodejs", "express", "middleware"]
  },
  {
    id: "3",
    title: "Nodemon və Scripts: dev mühiti necə qurulur?",
    category: "Node.js",
    desc: "nodemon quraşdırılması, package.json scripts və server restart prosesinin rahatlaşdırılması.",
    image: "/images/blog/node-nodemon.jpg",
    tags: ["nodejs", "nodemon", "npm", "scripts"]
  },
  {
    id: "4",
    title: "Status Kodlar: 200, 201, 400, 401, 404, 500 — nə vaxt hansını verək?",
    category: "Node.js",
    desc: "API-də doğru HTTP status kod seçimi və real case-lər (validation, not found, server error).",
    image: "/images/blog/node-status-codes.jpg",
    tags: ["nodejs", "http", "status-codes", "api"]
  },
  {
    id: "5",
    title: "MongoDB Intro: Collection, Document və CRUD məntiqi",
    category: "Node.js",
    desc: "MongoDB əsas anlayışlar və Node.js ilə sadə CRUD əməliyyatlarının ümumi strukturu.",
    image: "/images/blog/node-mongodb-intro.jpg",
    tags: ["nodejs", "mongodb", "database", "crud"]
  }
];


module.exports = blogs;