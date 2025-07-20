import { Model, Types } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { NotificationsGateway } from '../notifications/notifications.gateway';
export declare class UsersService {
    private userModel;
    private notificationsGateway;
    constructor(userModel: Model<UserDocument>, notificationsGateway: NotificationsGateway);
    listUsers(currentUserId: string): Promise<{
        id: string;
        name: string;
        email: string;
    }[]>;
    findById(userId: string): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    followUser(currentUserId: string, targetUserId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    unfollowUser(currentUserId: string, targetUserId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getFollowers(userId: string): Promise<Types.ObjectId[]>;
    getFollowing(userId: string): Promise<Types.ObjectId[]>;
}
