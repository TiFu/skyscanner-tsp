package tech.ananas.socketio;
import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;

public class SocketIO {
	private SocketIOServer server;
	
	public SocketIO(String hostname, int port) {
		Configuration configuration = new Configuration();
		configuration.setHostname(hostname);
		configuration.setPort(port);
		this.server = new SocketIOServer(configuration);
		
	}
}
