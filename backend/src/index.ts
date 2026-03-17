import express from "express";
import cors from "cors";
import "dotenv/config";
import personsRouter from "./routes/persons";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());

app.use("/api/persons", personsRouter);

app.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});

app.listen(PORT, () => {
	console.log(`Server läuft auf http://localhost:${PORT}`);
});
