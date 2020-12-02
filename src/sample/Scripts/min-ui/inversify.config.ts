import "reflect-metadata";
import { Container } from "inversify";

import { Services } from "./types";
import { IExecutor, Executor } from "./services/executor";
import { ILogFactory, LogFactory } from "./services/logFactory";
import { IParser, Parser } from "./services/parser";
import { IPublisher, Publisher } from "./services/publisher";
import { Command, Commands } from "./commands/command";
import { FetchCommand } from "./commands/fetchCommand";
import { FillCommand } from "./commands/fillCommand";

var container = new Container();

container.bind<IExecutor>(Services.Executor).to(Executor);
container.bind<IParser>(Services.Parser).to(Parser);
container.bind<IPublisher>(Services.Publisher).to(Publisher);
container.bind<ILogFactory>(Services.LogFactory).to(LogFactory);


container.bind<Command>(Commands.FetchCommand).to(FetchCommand);
container.bind<Command>(Commands.FillCommand).to(FillCommand);


export default container;
