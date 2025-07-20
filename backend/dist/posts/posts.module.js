"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bull_1 = require("@nestjs/bull");
const throttler_1 = require("@nestjs/throttler");
const posts_controller_1 = require("./posts.controller");
const posts_service_1 = require("./posts.service");
const posts_processor_1 = require("./posts.processor");
const post_schema_1 = require("./schemas/post.schema");
const notifications_module_1 = require("../notifications/notifications.module");
let PostsModule = class PostsModule {
};
exports.PostsModule = PostsModule;
exports.PostsModule = PostsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: post_schema_1.Post.name, schema: post_schema_1.PostSchema }]),
            bull_1.BullModule.registerQueue({
                name: 'post-queue',
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'post-creation',
                    ttl: 60000,
                    limit: 60,
                },
            ]),
            notifications_module_1.NotificationsModule,
        ],
        controllers: [posts_controller_1.PostsController],
        providers: [posts_service_1.PostsService, posts_processor_1.PostsProcessor],
        exports: [posts_service_1.PostsService],
    })
], PostsModule);
//# sourceMappingURL=posts.module.js.map