package tech.ananas.socketio;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.listener.DataListener;

import tech.ananas.models.Session;
import tech.ananas.models.UpdateAlternativeRequest;
import tech.ananas.models.UpdateException;

public class UpdateAlternativeListener implements DataListener<UpdateAlternativeRequest> {
	private SocketIO server;
	
	public UpdateAlternativeListener(SocketIO server) {
		this.server = server;
	}
	
	@Override
	public void onData(SocketIOClient client, UpdateAlternativeRequest data, AckRequest ackSender) throws Exception {
		Session session = this.server.getSessionService().getSession(data.getId());
		try {
		session.updateSelectedAlternative(data);
		} catch (UpdateException e) {
			this.server.sendToClient(client.getSessionId(), "error", e.getMessage());
		}
		
		this.server.broadcastToSession(session.getId(), "state", session);
	}

}
