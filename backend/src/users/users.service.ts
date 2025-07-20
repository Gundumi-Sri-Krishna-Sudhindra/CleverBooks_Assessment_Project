import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async listUsers(currentUserId: string) {
    const users = await this.userModel.find({ _id: { $ne: currentUserId } }).select('name email _id');
    return users.map(u => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
    }));
  }

  async findById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async followUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const currentUser = await this.findById(currentUserId);
    const targetUser = await this.findById(targetUserId);

    // Check if already following
    if (currentUser.following.includes(new Types.ObjectId(targetUserId))) {
      throw new BadRequestException('You are already following this user');
    }

    // Add to following list
    await this.userModel.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: targetUserId },
    });

    // Add to target user's followers list
    await this.userModel.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: currentUserId },
    });

    // Send WebSocket notification
    this.notificationsGateway.sendFollowNotification(targetUserId, currentUser.name);

    return {
      success: true,
      message: `You are now following ${targetUser.name}`,
    };
  }

  async unfollowUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('You cannot unfollow yourself');
    }

    const targetUser = await this.findById(targetUserId);

    // Check if not following (robust string comparison)
    const currentUser = await this.findById(currentUserId);
    const followingIds = currentUser.following.map(id => id.toString());
    if (!followingIds.includes(targetUserId)) {
      throw new BadRequestException('You are not following this user');
    }

    // Remove from following list
    await this.userModel.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetUserId },
    });

    // Remove from target user's followers list
    await this.userModel.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUserId },
    });

    return {
      success: true,
      message: `You have unfollowed ${targetUser.name}`,
    };
  }

  async getFollowers(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('followers', 'name email avatar')
      .select('followers');

    return user?.followers || [];
  }

  async getFollowing(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('following', 'name email avatar')
      .select('following');

    return user?.following || [];
  }
} 