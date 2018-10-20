package tech.ananas.socketio;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.listener.DataListener;

import tech.ananas.models.RestoreSessionRequest;
import tech.ananas.models.Session;

public class RestoreSessionListener implements DataListener<RestoreSessionRequest> {
	private SocketIO server;
	
	public RestoreSessionListener(SocketIO server) {
		this.server = server;
	}
	
	@Override
	public void onData(SocketIOClient client, RestoreSessionRequest data, AckRequest ackSender) throws Exception {
		client.set("name", data.getUser());
		Session session = this.server.getSessionService().getSession(data.getId());
		System.out.println("Restore session: " + session.getId());
		client.joinRoom(data.getId());
		this.server.sendToClient(client.getSessionId(), "restore_session", session);
	}

}
