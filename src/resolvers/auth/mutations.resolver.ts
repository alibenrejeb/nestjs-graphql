import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { AuthLoginOutput } from "./../../models/auth/login.model";
import { LocalAuthGuard } from "./../../auths/guards/local-auth.guard";
import { AuthService } from "./../../services/auth.service";

@Resolver()
export class AuthMutationsResolver {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Mutation(() => AuthLoginOutput)
    async login(
        @Context('req') req,
        @Args('username') _username: string,
        @Args('password') _password: string
    ) {
        return await this.authService.login(req.user);
    }
}