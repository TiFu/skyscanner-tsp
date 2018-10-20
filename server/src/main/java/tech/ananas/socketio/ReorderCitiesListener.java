package tech.ananas.socketio;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.listener.DataListener;

import tech.ananas.models.ReorderCitiesRequest;

public class ReorderCitiesListener implements DataListener<ReorderCitiesRequest> {
	private SocketIO server;
	
	public ReorderCitiesListener(SocketIO server) {
		this.server = server;
	}
	
	@Override
	public void onData(SocketIOClient client, ReorderCitiesRequest data, AckRequest ackSender) throws Exception {
		
	}

}
