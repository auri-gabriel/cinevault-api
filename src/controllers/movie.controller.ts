import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import { deleteCacheKeys, getFromCache, setInCache } from '../lib/cache';

const prisma = new PrismaClient();

const movieCacheKey = (id: number): string => `movies:${id}`;
const allMoviesCacheKey = 'movies:all';

export const getAllMovies = async (_: Request, res: Response) => {
  const cachedMovies = await getFromCache<unknown[]>(allMoviesCacheKey);
  if (cachedMovies) {
    res.json(cachedMovies);
    return;
  }

  const movies = await prisma.movie.findMany();
  await setInCache(allMoviesCacheKey, movies);
  res.json(movies);
};

export const getMovieById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const movieId = Number(id);

  const cachedMovie = await getFromCache<unknown>(movieCacheKey(movieId));
  if (cachedMovie) {
    res.json(cachedMovie);
    return;
  }

  const movie = await prisma.movie.findUnique({ where: { id: movieId } });
  if (!movie) {
    res.status(404).json({ message: 'Movie not found' });
    return;
  }

  await setInCache(movieCacheKey(movieId), movie);
  res.json(movie);
};

export const createMovie = async (req: Request, res: Response) => {
  const { title, description, releaseDate, rating } = req.body;
  const movie = await prisma.movie.create({
    data: { title, description, releaseDate: new Date(releaseDate), rating },
  });

  await deleteCacheKeys([allMoviesCacheKey]);
  await setInCache(movieCacheKey(movie.id), movie);
  res.status(201).json(movie);
};

export const deleteMovie = async (req: Request, res: Response) => {
  const { id } = req.params;
  const movieId = Number(id);

  await prisma.movie.delete({ where: { id: movieId } });
  await deleteCacheKeys([allMoviesCacheKey, movieCacheKey(movieId)]);
  res.status(204).send();
};
