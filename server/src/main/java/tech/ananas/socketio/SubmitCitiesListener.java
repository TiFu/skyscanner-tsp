package tech.ananas.socketio;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.listener.DataListener;

import tech.ananas.models.Route;
import tech.ananas.models.Session;
import tech.ananas.models.SubmitCityListRequest;
import tech.ananas.models.SubmitCityListResponse;
import tech.ananas.models.User;
import tech.ananas.services.FlightServiceException;

public class SubmitCitiesListener implements DataListener<SubmitCityListRequest> {
	private SocketIO server;
	
	public SubmitCitiesListener(SocketIO server) {
		this.server = server;
	}
	
	@Override
	public void onData(SocketIOClient client, SubmitCityListRequest data, AckRequest ackSender) throws Exception {
		Session session = this.server.getSessionService().getSession(data.getId());
		if (session == null) {
			this.server.sendToClient(client.getSessionId(), "error", "Session not found!");
			return;
		}

		if (!client.has("name")) {
			client.set("name", "Unknown");
		}
		User user = new User(client.get("name"));

		Route r = session.addRoute(user, data);
		// TODO: recalculate costs
		try {
			this.server.getFlightsService().updateTrip(r);
		} catch (FlightServiceException e) {
			this.server.sendToClient(client.getSessionId(), "error", e.getMessage());
		}
			
		System.out.println("Publishing to clients!");
		this.server.broadcastToSession(data.getId(), "state", session);
	}

}
