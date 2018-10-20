package tech.ananas.socketio;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.listener.DataListener;

import tech.ananas.models.ReorderCitiesRequest;
import tech.ananas.models.Route;
import tech.ananas.models.Session;
import tech.ananas.models.SubmitCityListResponse;

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
		if (!this.server.getFlightsService().updateTrip(r)) {
			this.server.broadcastToSession(data.getId(), "error", "Failed to fetch flights!");
		}
		this.server.broadcastToSession(data.getId(), "state", session);
	}

}
