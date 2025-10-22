import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest, CreateWorkoutPlanDto } from '../types';

export class WorkoutController {
  async createPlan(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated'
        });
      }

      const planData: CreateWorkoutPlanDto = req.body;

      // Validation
      if (!planData.name || !planData.frequency || !planData.workouts) {
        return res.status(400).json({
          success: false,
          error: 'Name, frequency, and workouts are required'
        });
      }

      // Create plan with workouts and exercises
      const plan = await prisma.workoutPlan.create({
        data: {
          userId: req.user.userId,
          name: planData.name,
          description: planData.description,
          frequency: planData.frequency,
          trainingTypes: JSON.stringify(planData.trainingTypes || []),
          workouts: {
            create: planData.workouts.map(workout => ({
              dayOfWeek: workout.dayOfWeek,
              trainingType: workout.trainingType,
              exercises: {
                create: workout.exercises.map(exercise => ({
                  exerciseId: exercise.exerciseId,
                  exerciseName: exercise.exerciseName,
                  sets: exercise.sets,
                  reps: exercise.reps,
                  weight: exercise.weight,
                  duration: exercise.duration,
                  restTime: exercise.restTime,
                  order: exercise.order,
                  notes: exercise.notes,
                  gifUrl: exercise.gifUrl,
                  bodyPart: exercise.bodyPart,
                  equipment: exercise.equipment,
                  target: exercise.target
                }))
              }
            }))
          }
        },
        include: {
          workouts: {
            include: {
              exercises: {
                orderBy: {
                  order: 'asc'
                }
              }
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        data: plan
      });
    } catch (error) {
      console.error('Error in createPlan:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create workout plan'
      });
    }
  }

  async getUserPlans(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated'
        });
      }

      const plans = await prisma.workoutPlan.findMany({
        where: {
          userId: req.user.userId
        },
        include: {
          workouts: {
            include: {
              exercises: {
                orderBy: {
                  order: 'asc'
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json({
        success: true,
        data: plans,
        count: plans.length
      });
    } catch (error) {
      console.error('Error in getUserPlans:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch workout plans'
      });
    }
  }

  async getPlanById(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated'
        });
      }

      const { id } = req.params;

      const plan = await prisma.workoutPlan.findFirst({
        where: {
          id,
          userId: req.user.userId
        },
        include: {
          workouts: {
            include: {
              exercises: {
                orderBy: {
                  order: 'asc'
                }
              }
            }
          }
        }
      });

      if (!plan) {
        return res.status(404).json({
          success: false,
          error: 'Workout plan not found'
        });
      }

      res.json({
        success: true,
        data: plan
      });
    } catch (error) {
      console.error('Error in getPlanById:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch workout plan'
      });
    }
  }

  async updatePlan(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated'
        });
      }

      const { id } = req.params;
      const { name, description, frequency, trainingTypes } = req.body;

      // Check if plan exists and belongs to user
      const existingPlan = await prisma.workoutPlan.findFirst({
        where: {
          id,
          userId: req.user.userId
        }
      });

      if (!existingPlan) {
        return res.status(404).json({
          success: false,
          error: 'Workout plan not found'
        });
      }

      // Update plan
      const updatedPlan = await prisma.workoutPlan.update({
        where: { id },
        data: {
          name: name || existingPlan.name,
          description: description !== undefined ? description : existingPlan.description,
          frequency: frequency || existingPlan.frequency,
          trainingTypes: trainingTypes ? JSON.stringify(trainingTypes) : existingPlan.trainingTypes
        },
        include: {
          workouts: {
            include: {
              exercises: {
                orderBy: {
                  order: 'asc'
                }
              }
            }
          }
        }
      });

      res.json({
        success: true,
        data: updatedPlan
      });
    } catch (error) {
      console.error('Error in updatePlan:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update workout plan'
      });
    }
  }

  async deletePlan(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated'
        });
      }

      const { id } = req.params;

      // Check if plan exists and belongs to user
      const existingPlan = await prisma.workoutPlan.findFirst({
        where: {
          id,
          userId: req.user.userId
        }
      });

      if (!existingPlan) {
        return res.status(404).json({
          success: false,
          error: 'Workout plan not found'
        });
      }

      // Delete plan (cascades to workouts and exercises)
      await prisma.workoutPlan.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Workout plan deleted successfully'
      });
    } catch (error) {
      console.error('Error in deletePlan:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete workout plan'
      });
    }
  }
}

export default new WorkoutController();



