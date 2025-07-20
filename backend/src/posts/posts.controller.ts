import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
@UseGuards(ThrottlerGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.createPost(createPostDto, req.user.id);
  }

  @Get('timeline')
  @UseGuards(JwtAuthGuard)
  async getTimeline(@Request() req) {
    return this.postsService.getTimeline(req.user.id);
  }
} 