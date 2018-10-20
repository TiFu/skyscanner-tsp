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
		server.broadcastToSession(data.getId(), "reorder_cities", data);
		// TODO: recalculate costs
		Route r = session.getRoute(data.getRouteName());
		this.server.getFlightsService().updateTrip(r);
		
		SubmitCityListResponse response = new SubmitCityListResponse();
		response.setRequestId(data.getRequestId());
		response.setFlights(r.getTrip().getFlights());
		response.setTotalPrice(r.getTrip().getTotalPrice());
		response.setRouteName(r.getRouteName());
		
		// TODO: change THIS (reorder_cities) to something different! important
		this.server.broadcastToSession(data.getId(), "reorder_cities", response);
		this.server.broadcastToSession(data.getId(), "state", session);
	}

}
