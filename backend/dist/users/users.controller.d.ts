import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    listUsers(req: any): Promise<{
        id: string;
        name: string;
        email: string;
    }[]>;
    getFollowing(req: any): Promise<import("mongoose").Types.ObjectId[]>;
    followUser(req: any, targetUserId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    unfollowUser(req: any, targetUserId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
