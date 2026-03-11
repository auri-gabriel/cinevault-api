import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getAllMovies = async (_: Request, res: Response) => {
  const movies = await prisma.movie.findMany();
  res.json(movies);
};

export const getMovieById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const movie = await prisma.movie.findUnique({ where: { id: Number(id) } });
  if (!movie) {
    res.status(404).json({ message: 'Movie not found' });
    return;
  }
  res.json(movie);
};

export const createMovie = async (req: Request, res: Response) => {
  const { title, description, releaseDate, rating } = req.body;
  const movie = await prisma.movie.create({
    data: { title, description, releaseDate: new Date(releaseDate), rating },
  });
  res.status(201).json(movie);
};

export const deleteMovie = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.movie.delete({ where: { id: Number(id) } });
  res.status(204).send();
};
