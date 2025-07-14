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
            ` Your user payload is: ${JSON.stringify(request.user)}`;
    }


    @Get('/admin')
    @Security('jwt', ['admin'])
    public async getAdminData(@Request() request: ExpressRequest): Promise<string> {
        return "This is admin data, accessible only with valid credentials and admin scope." +
            ` Your user payload is: ${JSON.stringify(request.user)}`;
    }


    @Get('/user')
    @Security('jwt', ['user'])
    public async getUserData(@Request() request: ExpressRequest): Promise<string> {
        return "This is user data, accessible only with valid credentials and user scope." +
            ` Your user payload is: ${JSON.stringify(request.user)}`;
    }
}