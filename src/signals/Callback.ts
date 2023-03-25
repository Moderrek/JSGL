export class Callback {

    fSuccess: Function;
    fError: Function;

    public then(success: Function): Callback{
        if(!(success instanceof Function))
            throw new Error("Param must be function!");
        this.fSuccess = success;
        return this;
    }

    public error(error: Function): Callback{
        if(!(error instanceof Function))
            throw new Error("Param must be function!");
        this.fError = error;
        return this;
    }

    public execThen(){
        if(this.fSuccess instanceof Function)
            this.fSuccess();
    }
    public execError(){
        if(this.fError instanceof Function)
            this.fError();
    }

}