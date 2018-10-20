package tech.ananas.socketio;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.listener.DataListener;

import tech.ananas.models.RestoreSessionRequest;

public class RestoreSessionListener implements DataListener<RestoreSessionRequest> {
	private SocketIO server;
	
	public RestoreSessionListener(SocketIO server) {
		this.server = server;
	}
	
	@Override
	public void onData(SocketIOClient client, RestoreSessionRequest data, AckRequest ackSender) throws Exception {
		
	}

}
