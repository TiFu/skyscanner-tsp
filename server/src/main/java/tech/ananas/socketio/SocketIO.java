package tech.ananas.socketio;
import java.util.UUID;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;

import tech.ananas.models.NewSessionRequest;
import tech.ananas.models.RestoreSessionRequest;
import tech.ananas.services.SessionService;

public class SocketIO {
	private SocketIOServer server;
	private SessionService sessionService;
	
	public SocketIO(String hostname, int port, SessionService sessionService) {
		Configuration configuration = new Configuration();
		configuration.setHostname(hostname);
		configuration.setPort(port);
		// TODO: this should be injected... 
		this.sessionService = sessionService;
		this.server = new SocketIOServer(configuration);
		
		// add listeners
		this.server.addEventListener("new_session", NewSessionRequest.class, new NewSessionListener(this));
		this.server.addEventListener("restore_session", RestoreSessionRequest.class, new RestoreSessionListener(this));
	}
	
	public SessionService getSessionService() {
		return this.sessionService;
	}
	
	public void sendToClient(UUID client, String event, Object response) {
		this.server.getClient(client).sendEvent(event, response);
	}
	
	public void broadcastToSession(String room, String event, Object data) {
		this.server.getRoomOperations(room).sendEvent(event, data);
	}
}
