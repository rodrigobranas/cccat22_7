import ExecuteOrder from "./application/usecase/ExecuteOrder";
import GetAccount from "./application/usecase/GetAccount";
import GetDepth from "./application/usecase/GetDepth";
import GetOrder from "./application/usecase/GetOrder";
import PlaceOrder from "./application/usecase/PlaceOrder";
import Signup from "./application/usecase/Signup";
import Deposit from "./application/usecase/Deposit";
import AccountController from "./infra/controller/AccountController";
import OrderController from "./infra/controller/OrderController";
import { AccountAssetDAODatabase } from "./infra/dao/AccountAssetDAO";
import { AccountDAODatabase } from "./infra/dao/AccountDAO";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import Registry from "./infra/di/Registry";
import { ExpressAdapter } from "./infra/http/HttpServer";
import { MediatorMemory } from "./infra/mediator/Mediator";
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";
import { OrderRepositoryDatabase } from "./infra/repository/OrderRepository";
import Book from "./domain/Book";
import { OrderHandlerBook, OrderHandlerExecuteOrder } from "./infra/handler/OrderHandler";

// entrypoint
async function main () {
    const httpServer = new ExpressAdapter();
    Registry.getInstance().provide("mediator", new MediatorMemory());
    Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
    Registry.getInstance().provide("accountDAO", new AccountDAODatabase());
    Registry.getInstance().provide("accountAssetDAO", new AccountAssetDAODatabase());
    Registry.getInstance().provide("accountRepository", new AccountRepositoryDatabase());
    Registry.getInstance().provide("orderRepository", new OrderRepositoryDatabase());
    Registry.getInstance().provide("httpServer", httpServer);
    Registry.getInstance().provide("signup", new Signup());
    Registry.getInstance().provide("getAccount", new GetAccount());
    Registry.getInstance().provide("deposit", new Deposit());
    Registry.getInstance().provide("placeOrder", new PlaceOrder());
    Registry.getInstance().provide("getOrder", new GetOrder());
    Registry.getInstance().provide("getDepth", new GetDepth());
    Registry.getInstance().provide("executeOrder", new ExecuteOrder());
    // BookManager objeto que tem vários books organizado por marketId
    Registry.getInstance().provide("book", new Book("BTC-USD"));
    // const handler = new OrderHandlerBook();
    const handler = new OrderHandlerExecuteOrder();
    handler.handle();
    new AccountController();
    new OrderController();
    httpServer.listen(3000);
}

main();
