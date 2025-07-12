import express, { response } from "express";
import cors from 'cors';

const app = express();

const PORT = 1234;

app.use(cors());
app.use(express.json());

app.get("/api/hello", (request, response) => {
    response.json({message: "Hello from backend"})
})

app.listen(PORT, () => {
    console.log(`Server running at http: localhost:${PORT}`);
})