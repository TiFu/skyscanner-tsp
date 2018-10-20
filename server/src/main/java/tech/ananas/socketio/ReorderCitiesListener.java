package tech.ananas.socketio;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.listener.DataListener;

import tech.ananas.models.ReorderCitiesRequest;
import tech.ananas.models.Route;
import tech.ananas.models.Session;
import tech.ananas.models.SubmitCityListResponse;
import tech.ananas.services.FlightServiceException;

public class ReorderCitiesListener implements DataListener<ReorderCitiesRequest> {
	private SocketIO server;
	
	public ReorderCitiesListener(SocketIO server) {
		this.server = server;
	}
	
	@Override
	public void onData(SocketIOClient client, ReorderCitiesRequest data, AckRequest ackSender) throws Exception {
		Session session = this.server.getSessionService().getSession(data.getId());
		boolean updated = session.updateRoute(data);
		// TODO: recalculate costs
		Route r = session.getRoute(data.getRouteName());
		if (r == null) {
			this.server.sendToClient(client.getSessionId(), "error", "Unknown route selected!");
			return;
		}
		try {
			this.server.getFlightsService().updateTrip(r);
		} catch (FlightServiceException e) {
			this.server.sendToClient(client.getSessionId(), "error", e.getMessage());
			return;
		}
		this.server.broadcastToSession(data.getId(), "state", session);
		
	}

}
