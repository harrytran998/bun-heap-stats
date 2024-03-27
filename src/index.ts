import { Elysia } from "elysia";
import { heapStats } from "bun:jsc";

const topics = {
  heapStat: 'heap-stats'
}

const app = new Elysia()
.ws('/ws', {
  open(ws) {
    ws.subscribe(topics.heapStat)
    console.log('Open Connection:', ws.id)
  },
  close(ws) {
    ws.unsubscribe(topics.heapStat)
    console.log('Closed Connection:', ws.id)
  },
  message(ws, message) {
    console.log(heapStats());
  },
})
.get("/", () => {
  return heapStats()

}).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

const socket = new WebSocket(`ws://localhost:3000/ws`);

socket.addEventListener(topics.heapStat, event => {
  console.log(event);
})