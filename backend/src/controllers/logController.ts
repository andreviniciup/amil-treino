import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest, CreateWorkoutLogDto } from '../types';

export class LogController {
  async createWorkoutLog(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated'
        });
      }

      const logData: CreateWorkoutLogDto = req.body;

      // Validation
      if (!logData.workoutId || !logData.exercises) {
        return res.status(400).json({
          success: false,
          error: 'WorkoutId and exercises are required'
        });
      }

      // Create workout log with exercise logs
      const log = await prisma.workoutLog.create({
        data: {
          userId: req.user.userId,
          workoutId: logData.workoutId,
          duration: logData.duration,
          notes: logData.notes,
          exercises: {
            create: logData.exercises.map(exercise => ({
              exerciseId: exercise.exerciseId,
              sets: exercise.sets,
              reps: JSON.stringify(exercise.reps),
              weights: JSON.stringify(exercise.weights),
              completed: exercise.completed
            }))
          }
        },
        include: {
          exercises: true
        }
      });

      res.status(201).json({
        success: true,
        data: log
      });
    } catch (error) {
      console.error('Error in createWorkoutLog:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create workout log'
      });
    }
  }

  async getUserLogs(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated'
        });
      }

      const { limit = '50', offset = '0' } = req.query;

      const logs = await prisma.workoutLog.findMany({
        where: {
          userId: req.user.userId
        },
        include: {
          exercises: true
        },
        orderBy: {
          completedAt: 'desc'
        },
        take: parseInt(limit as string),
        skip: parseInt(offset as string)
      });

      // Buscar workouts associados
      const logsWithWorkouts = await Promise.all(
        logs.map(async (log) => {
          const workout = await prisma.workout.findUnique({
            where: { id: log.workoutId },
            select: {
              id: true,
              trainingType: true,
              dayOfWeek: true
            }
          });
          
          return {
            ...log,
            workout
          };
        })
      );

      const total = await prisma.workoutLog.count({
        where: {
          userId: req.user.userId
        }
      });

      res.json({
        success: true,
        data: logsWithWorkouts,
        count: logsWithWorkouts.length,
        total
      });
    } catch (error) {
      console.error('Error in getUserLogs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch workout logs'
      });
    }
  }

  async getLogById(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated'
        });
      }

      const { id } = req.params;

      const log = await prisma.workoutLog.findFirst({
        where: {
          id,
          userId: req.user.userId
        },
        include: {
          exercises: true
        }
      });

      if (!log) {
        return res.status(404).json({
          success: false,
          error: 'Workout log not found'
        });
      }

      res.json({
        success: true,
        data: log
      });
    } catch (error) {
      console.error('Error in getLogById:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch workout log'
      });
    }
  }

  async getStats(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated'
        });
      }

      // Total workouts completed
      const totalWorkouts = await prisma.workoutLog.count({
        where: {
          userId: req.user.userId
        }
      });

      // Total time trained
      const logs = await prisma.workoutLog.findMany({
        where: {
          userId: req.user.userId
        },
        select: {
          duration: true
        }
      });

      const totalMinutes = logs.reduce((sum, log) => sum + (log.duration || 0), 0);

      // Recent workouts (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentWorkouts = await prisma.workoutLog.count({
        where: {
          userId: req.user.userId,
          completedAt: {
            gte: sevenDaysAgo
          }
        }
      });

      // Current streak
      const allLogs = await prisma.workoutLog.findMany({
        where: {
          userId: req.user.userId
        },
        orderBy: {
          completedAt: 'desc'
        },
        select: {
          completedAt: true
        }
      });

      let currentStreak = 0;
      let lastDate: Date | null = null;

      for (const log of allLogs) {
        const logDate = new Date(log.completedAt);
        logDate.setHours(0, 0, 0, 0);

        if (!lastDate) {
          lastDate = logDate;
          currentStreak = 1;
          continue;
        }

        const dayDiff = Math.floor(
          (lastDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (dayDiff === 0) {
          // Same day, skip
          continue;
        } else if (dayDiff === 1) {
          // Consecutive day
          currentStreak++;
          lastDate = logDate;
        } else {
          // Streak broken
          break;
        }
      }

      res.json({
        success: true,
        data: {
          totalWorkouts,
          totalMinutes,
          recentWorkouts,
          currentStreak
        }
      });
    } catch (error) {
      console.error('Error in getStats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch stats'
      });
    }
  }
}

export default new LogController();



