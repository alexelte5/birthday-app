// backend/src/routes/persons.ts
import { Router } from "express";
import prisma from "../lib/prisma";
import {
	validatePersonPatch,
	validatePersonPost,
} from "../validators/person.validator";

const router = Router();

// GET /api/persons
router.get("/", async (req, res) => {
	try {
		const persons = await prisma.person.findMany({
			include: { birthdays: true },
		});
		res.json(persons);
	} catch (error) {
		res.status(500).json({ error: "Etwas ist schiefgelaufen" });
	}
});

router.get("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const person = await prisma.person.findFirst({
			where: { id },
			include: { birthdays: true, gifts: true },
		});
		res.json(person);
	} catch (error) {
		res.status(500).json({ error: "Etwas ist schiefgelaufen" });
	}
});

// POST /api/persons
router.post("/", async (req, res) => {
	const { name, emoji, date } = req.body;
	const parsedDate = new Date(date);

	const validationError = validatePersonPost(name, parsedDate);
	if (validationError) {
		return res.status(400).json({ error: validationError });
	}

	try {
		const result = await prisma.$transaction(async (tx) => {
			const person = await tx.person.create({
				data: { name, emoji },
			});
			const birthday = await tx.birthday.create({
				data: { date: parsedDate, personId: person.id },
			});
			return { ...person, birthdays: [birthday] };
		});
		res.json(result);
	} catch (error) {
		res.status(500).json({ error: "Etwas ist schiefgelaufen" });
	}
});

// PATCH /api/persons/:id  — :id ist ein URL-Parameter
router.patch("/:id", async (req, res) => {
	const id = req.params.id; // so liest du den Parameter
	const { name, emoji, date } = req.body;
	const parsedDate = date ? new Date(date) : undefined;

	const validationError = validatePersonPatch(name, parsedDate);
	if (validationError) {
		return res.status(400).json({ error: validationError });
	}

	try {
		const result = await prisma.$transaction(async (tx) => {
			const personData: Record<string, unknown> = {};
			if (name !== undefined) personData.name = name;
			if (emoji !== undefined) personData.emoji = emoji;
			const person = await tx.person.update({
				where: { id },
				data: personData,
			});

			let birthday = await tx.birthday.findFirst({
				where: { personId: id },
			});

			if (date !== undefined && birthday) {
				birthday = await tx.birthday.update({
					where: { id: birthday.id },
					data: { date: parsedDate },
				});
			}
			return { ...person, birthdays: birthday ? [birthday] : [] };
		});
		res.json(result);
	} catch (error) {
		res.status(500).json({ error: "Etwas ist schiefgelaufen" });
	}
});

// DELETE /api/persons/:id
router.delete("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const deleted = await prisma.person.delete({
			where: { id },
		});
		res.json(deleted);
	} catch (error) {
		res.status(500).json({ error: "Etwas ist schiefgelaufen" });
	}
});

export default router;
