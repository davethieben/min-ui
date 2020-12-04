import Min from "./min-ui/min-ui";
import { Command, Commands } from "./min-ui/commands/command";
import { FetchCommand } from "./min-ui/commands/fetchCommand";
import { FillCommand } from "./min-ui/commands/fillCommand";
import { WindowCommand } from "./min-ui/commands/windowCommand";
import { SetCommand } from "./min-ui/commands/setCommand";

(() =>
{
    window.addEventListener("load", (e) =>
    {
        Min.bootstrap(services =>
        {
            services.bind<Command>(Commands.Command).to(FetchCommand);
            services.bind<Command>(Commands.Command).to(FillCommand);
            services.bind<Command>(Commands.Command).to(SetCommand);
            services.bind<Command>(Commands.Command).to(WindowCommand);

        });

    });
})();
