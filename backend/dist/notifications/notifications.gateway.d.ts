import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private connectedUsers;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoin(client: Socket, userId: string): void;
    handleLeave(client: Socket, userId: string): void;
    sendFollowNotification(followedUserId: string, followerName: string): void;
    sendPostCreationNotification(followers: string[], authorName: string): void;
}
