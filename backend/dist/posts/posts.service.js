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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const post_schema_1 = require("./schemas/post.schema");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
let PostsService = class PostsService {
    constructor(postModel, postQueue, notificationsGateway) {
        this.postModel = postModel;
        this.postQueue = postQueue;
        this.notificationsGateway = notificationsGateway;
    }
    async createPost(createPostDto, userId) {
        await this.postQueue.add('create-post', {
            ...createPostDto,
            author: userId,
        }, {
            delay: 5000,
        });
        return {
            success: true,
            message: 'Post creation queued successfully. It will be published in 5 seconds.',
        };
    }
    async processPostCreation(jobData) {
        const { title, description, author } = jobData;
        const post = new this.postModel({
            title,
            description,
            author: new mongoose_2.Types.ObjectId(author),
        });
        await post.save();
        const authorUser = await this.postModel.db.models.User.findById(author);
        if (authorUser && authorUser.followers.length > 0) {
            this.notificationsGateway.sendPostCreationNotification(authorUser.followers.map(f => f.toString()), authorUser.name);
        }
        return {
            success: true,
            message: 'Post created successfully',
            data: post,
        };
    }
    async getTimeline(userId) {
        const user = await this.postModel.db.models.User.findById(userId);
        const followingIds = user?.following || [];
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
    async getPostsByUser(userId) {
        const posts = await this.postModel
            .find({ author: userId })
            .populate('author', 'name email avatar')
            .sort({ createdAt: -1 });
        return {
            success: true,
            data: posts,
        };
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __param(1, (0, common_1.Inject)('BullQueue_post-queue')),
    __metadata("design:paramtypes", [mongoose_2.Model, Object, notifications_gateway_1.NotificationsGateway])
], PostsService);
//# sourceMappingURL=posts.service.js.map