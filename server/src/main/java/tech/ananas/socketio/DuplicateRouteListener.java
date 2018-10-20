package tech.ananas.socketio;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.listener.DataListener;

import tech.ananas.models.DuplicateRouteRequest;
import tech.ananas.models.Session;

public class DuplicateRouteListener implements DataListener<DuplicateRouteRequest> {
	private SocketIO server;
	
	public DuplicateRouteListener(SocketIO server) {
		this.server = server;
	}
	
	@Override
	public void onData(SocketIOClient client, DuplicateRouteRequest data, AckRequest ackSender) throws Exception {
		Session session = this.server.getSessionService().getSession(data.getId());
		session.duplicateRoute(data.getRouteName());
		
		this.server.broadcastToSession(data.getId(), "state", session);
	}

}
