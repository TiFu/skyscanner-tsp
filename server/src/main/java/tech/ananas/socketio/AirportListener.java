package tech.ananas.socketio;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.listener.DataListener;

import tech.ananas.services.SkyscannerAPI;

public class AirportListener implements DataListener<Void> {
	private SocketIO server;
	
	public AirportListener(SocketIO server) {
		this.server = server;
	}
	@Override
	public void onData(SocketIOClient client, Void data, AckRequest ackSender) throws Exception {
		this.server.sendToClient(client.getSessionId(), "airports", this.server.getSkyscannerAPI().getAllAirports());
	}

}
