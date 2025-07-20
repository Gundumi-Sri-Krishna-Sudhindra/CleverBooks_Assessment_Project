import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    createPost(createPostDto: CreatePostDto, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getTimeline(req: any): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, import("./schemas/post.schema").PostDocument, {}> & import("./schemas/post.schema").Post & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
    }>;
}
