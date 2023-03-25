export class Callback {

    fSuccess: () => void;
    fError: () => void;

    then(success: () => void): Callback{
        if(!(success instanceof Function))
            throw new Error("Param must be function!");
        this.fSuccess = success;
        return this;
    }

    error(error: () => void): Callback{
        if(!(error instanceof Function))
            throw new Error("Param must be function!");
        this.fError = error;
        return this;
    }

    execThen(){
        if(this.fSuccess instanceof Function)
            this.fSuccess();
    }
    execError(){
        if(this.fError instanceof Function)
            this.fError();
    }

}