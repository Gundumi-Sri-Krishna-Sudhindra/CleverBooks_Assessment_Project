import { Model } from 'mongoose';
import { Queue } from 'bull';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';
export declare class PostsService {
    private postModel;
    private postQueue;
    private notificationsGateway;
    constructor(postModel: Model<PostDocument>, postQueue: Queue, notificationsGateway: NotificationsGateway);
    createPost(createPostDto: CreatePostDto, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    processPostCreation(jobData: any): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, PostDocument, {}> & Post & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    getTimeline(userId: string): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, PostDocument, {}> & Post & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
    }>;
    getPostsByUser(userId: string): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, PostDocument, {}> & Post & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
    }>;
}
