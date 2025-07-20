import { Job } from 'bull';
import { PostsService } from './posts.service';
export declare class PostsProcessor {
    private readonly postsService;
    constructor(postsService: PostsService);
    handleCreatePost(job: Job): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schemas/post.schema").PostDocument, {}> & import("./schemas/post.schema").Post & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
}
