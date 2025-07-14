import {Controller, Get, Route, Security, Tags, Request} from "tsoa";
import { KeycloakRequest } from "../middlewares/keycloak_auth";

@Tags('Example')
@Route('/example')
export class ExampleController extends Controller {

    @Get('/public')
    public async getPublicData(): Promise<string> {
        return "This is public data.";
    }

    @Get('/private')
    @Security('keycloak')
    public async getPrivateData(@Request() request: KeycloakRequest): Promise<string> {
        return "This is private data, accessible only with valid Keycloak credentials." +
            ` Your user payload is: ${JSON.stringify(request.keycloakUser)}`;
    }

    @Get('/admin')
    @Security('keycloak', ['admin'])
    public async getAdminData(@Request() request: KeycloakRequest): Promise<string> {
        return "This is admin data, accessible only with valid Keycloak credentials and admin role." +
            ` Your user payload is: ${JSON.stringify(request.keycloakUser)}`;
    }

    @Get('/user')
    @Security('keycloak', ['user'])
    public async getUserData(@Request() request: KeycloakRequest): Promise<string> {
        return "This is user data, accessible only with valid Keycloak credentials and user role." +
            ` Your user payload is: ${JSON.stringify(request.keycloakUser)}`;
    }
}