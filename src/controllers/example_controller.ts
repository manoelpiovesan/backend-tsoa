import {Controller, Get, Route, Security, Tags, Request} from "tsoa";
import {Request as ExpressRequest} from "express";

@Tags('Example')
@Route('/example')
export class ExampleController extends Controller {

    @Get('/public')
    public async getPublicData(): Promise<string> {
        return "This is public data.";
    }

    @Get('/private')
    @Security('jwt')
    public async getPrivateData(@Request() request: ExpressRequest): Promise<string> {
        return "This is private data, accessible only with valid credentials." +
            ` Your auth is: ${request.user?.id} and username: ${request.user?.username}`;
    }
}