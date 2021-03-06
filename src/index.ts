import * as dotenv from "dotenv";
import { appLogger } from "./logger";
import { App } from "./server";

dotenv.config();
App.init().listen(3300);
const applicationStartLog = appLogger("Club Manager Start up");
applicationStartLog.log({
    level: "info",
    message: `Application is starting at port 3000`
});
