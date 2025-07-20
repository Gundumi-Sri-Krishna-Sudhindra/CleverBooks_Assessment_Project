import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
}
