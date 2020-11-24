import { Container } from "inversify";
import { Services } from "./types.js";
import { Command, Commands } from "./commands/command.js";
import { IExecutor, Executor } from "./services/executor.js";
import { ILogFactory, LogFactory } from "./services/logFactory.js";
import { IPublisher, Publisher } from "./services/publisher.js";
import { FetchCommand } from "./commands/fetchCommand.js";
import { FillCommand } from "./commands/fillCommand.js";
import { IParser, Parser } from "./services/parser.js";

var container = new Container();

container.bind<IExecutor>(Services.Executor).to(Executor);
container.bind<IParser>(Services.Parser).to(Parser);
container.bind<IPublisher>(Services.Publisher).to(Publisher);
container.bind<ILogFactory>(Services.LogFactory).to(LogFactory);


container.bind<Command>(Commands.FetchCommand).to(FetchCommand);
container.bind<Command>(Commands.FillCommand).to(FillCommand);


export default container;
