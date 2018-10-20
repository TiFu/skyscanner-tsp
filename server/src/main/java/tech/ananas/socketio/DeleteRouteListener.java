package tech.ananas.socketio;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.listener.DataListener;

import tech.ananas.models.DeleteRouteRequest;
import tech.ananas.models.Session;

public class DeleteRouteListener implements DataListener<DeleteRouteRequest>{
	private SocketIO server;
	public DeleteRouteListener(SocketIO server) {
		this.server = server;
	}
	
	@Override
	public void onData(SocketIOClient client, DeleteRouteRequest data, AckRequest ackSender) throws Exception {
		Session session = this.server.getSessionService().getSession(data.getId());
		session.deleteRoute(data.getRouteName());

		this.server.broadcastToSession(data.getId(), "state", this.server.getSessionService().getSession(data.getId()));
	}

}
