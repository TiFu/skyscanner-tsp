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
		User u = new User(data.getUser());
		String sessionId = this.server.getSessionService().createNewSession(u);
		NewSessionResponse response = new NewSessionResponse(sessionId);
		this.server.sendToClient(client.getSessionId(), "new_session", response);
	}

}
