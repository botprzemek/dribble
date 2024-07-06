import { WS } from "@/ws/server";
import { registerExceptions } from "@/handler/error";

registerExceptions();

new WS().start();
