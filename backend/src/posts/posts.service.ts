import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Queue } from 'bull';

import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @Inject('BullQueue_post-queue') private postQueue: Queue,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async createPost(createPostDto: CreatePostDto, userId: string) {
    // Add job to queue with 5-second delay
    await this.postQueue.add(
      'create-post',
      {
        ...createPostDto,
        author: userId,
      },
      {
        delay: 5000, // 5 seconds delay
      },
    );

    return {
      success: true,
      message: 'Post creation queued successfully. It will be published in 5 seconds.',
    };
  }

  async processPostCreation(jobData: any) {
    const { title, description, author } = jobData;

    const post = new this.postModel({
      title,
      description,
      author: new Types.ObjectId(author),
    });

    await post.save();

    // Get author's followers and send notifications
    const authorUser = await this.postModel.db.models.User.findById(author);
    if (authorUser && authorUser.followers.length > 0) {
      this.notificationsGateway.sendPostCreationNotification(
        authorUser.followers.map(f => f.toString()),
        authorUser.name
      );
    }

    return {
      success: true,
      message: 'Post created successfully',
      data: post,
    };
  }

  async getTimeline(userId: string) {
    // Get user's following list
    const user = await this.postModel.db.models.User.findById(userId);
    const followingIds = user?.following || [];

    // Get posts from followed users, sorted by newest first
    const posts = await this.postModel
      .find({
        author: { $in: followingIds },
      })
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    return {
      success: true,
      data: posts,
    };
  }

  async getPostsByUser(userId: string) {
    const posts = await this.postModel
      .find({ author: userId })
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: posts,
    };
  }
} 