import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { SignUpDto, SignInDto } from './dto/auth.dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    signUp(signUpDto: SignUpDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: unknown;
                email: string;
                name: string;
            };
            token: string;
        };
    }>;
    signIn(signInDto: SignInDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: unknown;
                email: string;
                name: string;
            };
            token: string;
        };
    }>;
    private generateToken;
}
