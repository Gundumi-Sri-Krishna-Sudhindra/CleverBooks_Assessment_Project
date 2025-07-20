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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
let UsersService = class UsersService {
    constructor(userModel, notificationsGateway) {
        this.userModel = userModel;
        this.notificationsGateway = notificationsGateway;
    }
    async listUsers(currentUserId) {
        const users = await this.userModel.find({ _id: { $ne: currentUserId } }).select('name email _id');
        return users.map(u => ({
            id: u._id.toString(),
            name: u.name,
            email: u.email,
        }));
    }
    async findById(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email });
    }
    async followUser(currentUserId, targetUserId) {
        if (currentUserId === targetUserId) {
            throw new common_1.BadRequestException('You cannot follow yourself');
        }
        const currentUser = await this.findById(currentUserId);
        const targetUser = await this.findById(targetUserId);
        if (currentUser.following.includes(new mongoose_2.Types.ObjectId(targetUserId))) {
            throw new common_1.BadRequestException('You are already following this user');
        }
        await this.userModel.findByIdAndUpdate(currentUserId, {
            $addToSet: { following: targetUserId },
        });
        await this.userModel.findByIdAndUpdate(targetUserId, {
            $addToSet: { followers: currentUserId },
        });
        this.notificationsGateway.sendFollowNotification(targetUserId, currentUser.name);
        return {
            success: true,
            message: `You are now following ${targetUser.name}`,
        };
    }
    async unfollowUser(currentUserId, targetUserId) {
        if (currentUserId === targetUserId) {
            throw new common_1.BadRequestException('You cannot unfollow yourself');
        }
        const targetUser = await this.findById(targetUserId);
        const currentUser = await this.findById(currentUserId);
        const followingIds = currentUser.following.map(id => id.toString());
        if (!followingIds.includes(targetUserId)) {
            throw new common_1.BadRequestException('You are not following this user');
        }
        await this.userModel.findByIdAndUpdate(currentUserId, {
            $pull: { following: targetUserId },
        });
        await this.userModel.findByIdAndUpdate(targetUserId, {
            $pull: { followers: currentUserId },
        });
        return {
            success: true,
            message: `You have unfollowed ${targetUser.name}`,
        };
    }
    async getFollowers(userId) {
        const user = await this.userModel
            .findById(userId)
            .populate('followers', 'name email avatar')
            .select('followers');
        return user?.followers || [];
    }
    async getFollowing(userId) {
        const user = await this.userModel
            .findById(userId)
            .populate('following', 'name email avatar')
            .select('following');
        return user?.following || [];
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notifications_gateway_1.NotificationsGateway])
], UsersService);
//# sourceMappingURL=users.service.js.map