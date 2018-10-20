package tech.ananas.socketio;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.listener.DataListener;

import tech.ananas.models.Route;
import tech.ananas.models.Session;
import tech.ananas.models.SubmitCityListRequest;
import tech.ananas.models.SubmitCityListResponse;
import tech.ananas.models.User;

public class SubmitCitiesListener implements DataListener<SubmitCityListRequest> {
	private SocketIO server;
	
	public SubmitCitiesListener(SocketIO server) {
		this.server = server;
	}
	
	@Override
	public void onData(SocketIOClient client, SubmitCityListRequest data, AckRequest ackSender) throws Exception {
		Session session = this.server.getSessionService().getSession(data.getId());
		Route r = session.addRoute(new User(client.get("name")), data);
		// TODO: recalculate costs
		this.server.getFlightsService().updateTrip(r);
			
		// TODO: change THIS (reorder_cities) to something different! important
//		this.server.broadcastToSession(data.getId(), "city_list", response);
		this.server.broadcastToSession(data.getId(), "state", session);
	}

}
