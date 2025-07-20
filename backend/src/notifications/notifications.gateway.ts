import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, userId: string) {
    this.connectedUsers.set(userId, client.id);
    client.join(`user_${userId}`);
    console.log(`User ${userId} joined with socket ${client.id}`);
  }

  @SubscribeMessage('leave')
  handleLeave(client: Socket, userId: string) {
    this.connectedUsers.delete(userId);
    client.leave(`user_${userId}`);
    console.log(`User ${userId} left`);
  }

  sendFollowNotification(followedUserId: string, followerName: string) {
    const socketId = this.connectedUsers.get(followedUserId);
    if (socketId) {
      this.server.to(socketId).emit('user_followed', {
        message: `${followerName} followed you`,
        type: 'follow',
        timestamp: new Date(),
      });
    }
  }

  sendPostCreationNotification(followers: string[], authorName: string) {
    followers.forEach(followerId => {
      const socketId = this.connectedUsers.get(followerId);
      if (socketId) {
        this.server.to(socketId).emit('post_created', {
          message: `${authorName} created a new post`,
          type: 'post',
          timestamp: new Date(),
        });
      }
    });
  }
} 