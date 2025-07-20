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
exports.PostsProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const posts_service_1 = require("./posts.service");
let PostsProcessor = class PostsProcessor {
    constructor(postsService) {
        this.postsService = postsService;
    }
    async handleCreatePost(job) {
        console.log('Processing post creation job:', job.data);
        const result = await this.postsService.processPostCreation(job.data);
        console.log('Post created successfully:', result);
        return result;
    }
};
exports.PostsProcessor = PostsProcessor;
__decorate([
    (0, bull_1.Process)('create-post'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostsProcessor.prototype, "handleCreatePost", null);
exports.PostsProcessor = PostsProcessor = __decorate([
    (0, bull_1.Processor)('post-queue'),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsProcessor);
//# sourceMappingURL=posts.processor.js.map