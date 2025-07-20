import { Controller, Post, Param, UseGuards, Request, Get } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(ThrottlerGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async listUsers(@Request() req) {
    return this.usersService.listUsers(req.user.id);
  }

  @Get('following')
  @UseGuards(JwtAuthGuard)
  async getFollowing(@Request() req) {
    return this.usersService.getFollowing(req.user.id);
  }

  @Post('follow/:userId')
  @UseGuards(JwtAuthGuard)
  async followUser(@Request() req, @Param('userId') targetUserId: string) {
    return this.usersService.followUser(req.user.id, targetUserId);
  }

  @Post('unfollow/:userId')
  @UseGuards(JwtAuthGuard)
  async unfollowUser(@Request() req, @Param('userId') targetUserId: string) {
    return this.usersService.unfollowUser(req.user.id, targetUserId);
  }
} 