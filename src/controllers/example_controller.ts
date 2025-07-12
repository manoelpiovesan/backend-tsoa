import {Controller, Get, Route, Security, Tags} from "tsoa";

@Tags('Example')
@Route('/example')
//@Security('api_key')
export class ExampleController extends Controller {

    @Get('/public')
    public async getPublicData(): Promise<string> {
        return "This is public data.";
    }

    @Get('/private')
    @Security('api_key')
    public async getPrivateData(): Promise<string> {
        return "This is private data, accessible only with valid credentials.";
    }
}