import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from 'src/app.service';
import { Logger, UseGuards } from '@nestjs/common';
import { config } from '../config/config';
import { WsThrottlerGuard } from 'src/guard/wsThrottlerGuard';
const appConfig = config().app;
@UseGuards(WsThrottlerGuard)
@WebSocketGateway({
  timeout: appConfig.socket_timeout,
  pingTimeout: appConfig.socket_ping_timeout,
  pingInterval: appConfig.socket_ping_interval
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private logger: Logger = new Logger('ApiGateway');

  @WebSocketServer()
  server: Server;
  
  constructor(private readonly appService: AppService) {
  }

  afterInit(server: Server) {
    this.logger.log("Client initialize")
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client is connected with ${client.id}`)
    const sessionID = this.appService.randomId();
    const userID = this.appService.randomId();
    client['sessionID'] = sessionID;
    client['userID'] = userID;
    client.join(userID);
    client.emit(appConfig.bot_session_event, {
      sessionID,
      userID,
      socketID: client.id
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client is disconnected = ${client.id}`)
  }


  @SubscribeMessage('botRequest')
  async handleMessage(client: Socket, { content, to }: any) {
    this.logger.log({ msg: `Receiving chatbot request for ${to} with ${JSON.stringify(content)} ` });
    this.appService.requestToAdapter({content, to}, this.server)
    return {}
  }

  @SubscribeMessage('endConnection')
  async handleEndConnection(client: Socket) {
    this.logger.log({msg: "The client has closed the bot"});
    client.disconnect(true);
    return {}
  }

  // load testing event
  @SubscribeMessage('client to server event')
  handleClientToServerMessage(client: Socket, message: any): WsResponse<string> {
    this.logger.log({ msg: `LoadTest: Sending response to client` });
    return { event: 'server to client event', data: "response" }
  }

}
