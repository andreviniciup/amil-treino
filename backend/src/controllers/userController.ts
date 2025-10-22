import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { AuthRequest, RegisterDto, LoginDto, UpdateProfileDto } from '../types';

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const { email, name, password, age, gender, weight, height, fitnessGoal, trainingDays }: RegisterDto = req.body;

      // Validation
      if (!email || !name || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email, name and password are required'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters'
        });
      }

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User with this email already exists'
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash,
          age,
          gender,
          weight,
          height,
          fitnessGoal,
          trainingDays: trainingDays ? JSON.stringify(trainingDays) : null
        },
        select: {
          id: true,
          email: true,
          name: true,
          age: true,
          gender: true,
          weight: true,
          height: true,
          fitnessGoal: true,
          trainingDays: true,
          createdAt: true
        }
      });

      // Generate token
      const jwtSecret = process.env.JWT_SECRET || 'default-secret-change-this';
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        jwtSecret,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        data: {
          user,
          token
        }
      });
    } catch (error) {
      console.error('Error in register:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to register user'
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password }: LoginDto = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Generate token
      const jwtSecret = process.env.JWT_SECRET || 'default-secret-change-this';
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        jwtSecret,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt
          },
          token
        }
      });
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to login'
      });
    }
  }

  async getProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated'
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: {
          id: true,
          email: true,
          name: true,
          age: true,
          gender: true,
          weight: true,
          height: true,
          fitnessGoal: true,
          trainingDays: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error in getProfile:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get profile'
      });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated'
        });
      }

      const { name, age, gender, weight, height, fitnessGoal, trainingDays }: UpdateProfileDto = req.body;

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (age !== undefined) updateData.age = age;
      if (gender !== undefined) updateData.gender = gender;
      if (weight !== undefined) updateData.weight = weight;
      if (height !== undefined) updateData.height = height;
      if (fitnessGoal !== undefined) updateData.fitnessGoal = fitnessGoal;
      if (trainingDays !== undefined) updateData.trainingDays = JSON.stringify(trainingDays);

      const user = await prisma.user.update({
        where: { id: req.user.userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          age: true,
          gender: true,
          weight: true,
          height: true,
          fitnessGoal: true,
          trainingDays: true,
          createdAt: true,
          updatedAt: true
        }
      });

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error in updateProfile:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile'
      });
    }
  }
}

export default new UserController();

