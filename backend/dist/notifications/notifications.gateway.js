"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let NotificationsGateway = class NotificationsGateway {
    constructor() {
        this.connectedUsers = new Map();
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        for (const [userId, socketId] of this.connectedUsers.entries()) {
            if (socketId === client.id) {
                this.connectedUsers.delete(userId);
                break;
            }
        }
    }
    handleJoin(client, userId) {
        this.connectedUsers.set(userId, client.id);
        client.join(`user_${userId}`);
        console.log(`User ${userId} joined with socket ${client.id}`);
    }
    handleLeave(client, userId) {
        this.connectedUsers.delete(userId);
        client.leave(`user_${userId}`);
        console.log(`User ${userId} left`);
    }
    sendFollowNotification(followedUserId, followerName) {
        const socketId = this.connectedUsers.get(followedUserId);
        if (socketId) {
            this.server.to(socketId).emit('user_followed', {
                message: `${followerName} followed you`,
                type: 'follow',
                timestamp: new Date(),
            });
        }
    }
    sendPostCreationNotification(followers, authorName) {
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
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handleLeave", null);
exports.NotificationsGateway = NotificationsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        },
    })
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map