package tech.ananas.socketio;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.DataListener;

import tech.ananas.models.NewSessionRequest;
import tech.ananas.models.NewSessionResponse;
import tech.ananas.models.User;

public class NewSessionListener implements DataListener<NewSessionRequest> {
	private SocketIO server;
	
	public NewSessionListener(SocketIO server) {
		this.server = server;
	}
	
	@Override
	public void onData(SocketIOClient client, NewSessionRequest data, AckRequest ackSender) throws Exception {
		System.out.println("Creating new session!");
		client.set("name", data.getUser());
		User u = new User(data.getUser());
		String sessionId = this.server.getSessionService().createNewSession(u);
		client.joinRoom(sessionId);
		System.out.println("Created new session: " + sessionId);
		NewSessionResponse response = new NewSessionResponse(sessionId);
		this.server.sendToClient(client.getSessionId(), "new_session", response);
		this.server.broadcastToSession(sessionId, "state", this.server.getSessionService().getSession(sessionId));
	}

}
